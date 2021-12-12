/* 	SAIT Fall 2021 Group 2
	Alex, Jaspal, Rasheed, Richard
*/
/*
	Server configurations and startup for the website

	Authors: Alex/Richard- Configurations we needed for our pages
			 Alex- Comments + mostly everything else
			 Richard- SQL statement for Contact page, dayjs for home page, random additions. 
	Note that Register page was originated by Rasheed, and the post statements, sql , and records insert was done via pair (via Richard/Alex) programming, but code was never submitted by Rasheed.
*/

//Declarations and basic configuration
const express = require("express");
const app = express();
const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);
dayjs().format();
const fs = require("fs");
const mysql = require("mysql");
const FileReader = require('filereader');
let fileReader = new FileReader();
var FileAPI = require('file-api')
, File = FileAPI.File
, FileList = FileAPI.FileList
;
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

//Tables that are served to the client (these probably shouldn't be global)
let packagesTable = {};
let agenciesTable = new Array();

//Directories
app.use(express.static("public", { "extensions": ["css", "js"] }));
app.use(express.static("views", { "extensions": ["html", "htm"] }));

//Server start
app.set("view engine", "ejs");
app.listen(8000, ()=>{ console.log("server started on port 8000"); });

//Function for requesting a mysql connection
//Always hardcode your passwords for extra security ;)
var getConnection = ()=>{
	return mysql.createConnection({
		host: "localhost",
		user: "Alex",
		password: "password",
		database: "travelexperts"
	})
};

//Gets the main page (index)
app.get("/", (req, res)=>{
	var connection = getConnection();
	connection.connect( (err)=>{
		if(err){
			throw err;
		}
		//Omits packages past valid date as per specifications
		var sql = "SELECT * FROM packages WHERE PkgEndDate > CURDATE()";

		connection.query(sql, (err, result, fields)=>{
			if(err){
				throw err;
			}
			packagesTable = result;	//I just send the whole table, some further refinement needed
			res.render("../index", {packagesTable: packagesTable, dayjs: dayjs});
		});
	});
	
	
});

//Gets the contact page
app.get("/contact", (req, res)=>{
	var connection = getConnection();

	connection.connect( (err)=>{

		if(err){
			throw err;
		}
		//Gets specific columns of the Agency and Agencies table. Joins them so each agent is matched with their agency.
		//Written by Richard
		var sql = "select agencies.AgencyId, agencies.AgncyAddress, agencies.AgncyCity,agencies.AgncyProv, " 
					+ "agencies.AgncyPostal, agencies.AgncyCountry, agencies.AgncyPhone, agencies.AgncyFax, " 
					+ "agents.AgtFirstName, agents.AgtLastName, agents.AgtBusPhone, agents.AgtEmail, "
					+ "agents.AgtPosition, agents.AgtMiddleInitial " 
					+ "from agencies join agents on agents.AgencyId = agencies.AgencyId " 
					+ "where agents.AgencyId = agencies.AgencyId order by agencies.agencyid";
		connection.query(sql, (err, result, fields)=>{
			if(err){
				throw err;
			}
			//(A bit hacky of a solution, I got it working and never went back for refactoring. Rushed work to get someone else's done.)

			//Separates each Agency to arr[i] and then each agent of said agency is matched and can be accessed by arr[i][j].
			//Each agent row has redundant lines of info for the Agency, thus agency info is also accessed by arr[i][j]. (This could be fixed in multiple ways, JSON for example)

			let arr = new Array();
			let innerArr = new Array();
			//Index of arr
			var i = -1; //Starts at -1 to flag start of loop sequence
			//Index of innerArr
			var j = 0;
			//Keeps track of the last AgencyId worked on
			var lastId = -1; //Starts at -1 as it is a known invalid ID

			//Since the resulting table is sorted by ID, I can make certain assumptions and go through the array linearly
			Object.keys(result).forEach(function(key){
				var row = result[key];
				//Moves to new row of arr if all relevant agents are added
				if(row.AgencyId != lastId){
					lastId = row.AgencyId;
					
					//Does not enter on first loop, otherwise arr[0] will be empty
					if(i != -1){
						
						arr[i] = innerArr;
						innerArr = new Array();
						j = 0;
					}
					
					i++;
					
				}
				
				//Add agent to the array
				innerArr[j++] = row;
			});	
			//Adds the final array since it doesn't happen organically in the loop
			arr[i] = innerArr;
			agenciesTable = arr;	
			res.render("contact", {agenciesTable: agenciesTable, dayjs: dayjs});
		});
	});
	
	
});

//Gets the order page
app.get("/order", (req, res)=>{
	//Set the requested package id given by the user/page
	var pkgId = req.query.pkgId;

	var connection = getConnection();
	connection.connect( (err)=>{

		if(err){
			throw err;
		}
		var sql = "SELECT PkgDesc, PkgName, PkgThumbnail FROM packages WHERE PackageId = " + pkgId;

		connection.query(sql, (err, result, fields)=>{
			if(err){
				throw err;
			}
			var desc = "";
			var title = "";
			var thumb = "";

			Object.keys(result).forEach(function(key) {
				var row = result[key];
				desc = row.PkgDesc;
				title = row.PkgName;
				thumb = row.PkgThumbnail;

			});
			
			res.render("order", {desc : desc, title : title, thumb : thumb, pkgId: pkgId});
		});
	});
	
	
});

//Takes user input from the order page and inserts into the database
app.post("/submit-order", urlencodedParser, (req, res)=>{
	var connection = getConnection();
	connection.connect( (err)=>{
		if(err){
			throw err;
		}
		var pkgId = req.body.pkgId;
		var custId = req.body.CustomerId;
		var travCount = req.body.TravelerCount;
		var tripType = req.body.TripTypeId;
		
		var sql = "INSERT INTO bookings (BookingDate, TravelerCount, CustomerId, TripTypeId) VALUES (?,?,?,?)";
		//Booking date is just assumed to be today
		var values = [dayjs().format(),travCount, 104, tripType.charAt(0)];

		connection.query(sql, values, (err, result, fields)=>{
			if(err){
				throw err;
			}
			
		});
		//Simply redirect to home page at this time
		return res.redirect("/");
	});
	
	
});

//Gets the register page
app.get("/register", (req, res)=>{
	res.render("register");
});

//This MUST be at the bottom of the page else it will override your page requests!
//Show 404 if request cannot be completed
app.use((req, res, next)=>{
	res.status(404).render("404");
});

