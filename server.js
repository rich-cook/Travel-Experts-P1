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

//Table that is served to the client
let packagesTable = {};
let agenciesTable = new Array();

app.use(express.static("public", { "extensions": ["css", "js"] }));
app.use(express.static("views", { "extensions": ["html", "htm"] }));
app.set("view engine", "ejs");

app.listen(8000, ()=>{ console.log("server started on port 8000"); });

//Always hardcode your passwords for extra security ;)
var getConnection = ()=>{
	return mysql.createConnection({
		host: "localhost",
		user: "Alex",
		password: "password",
		database: "travelexperts"
	})
};

app.get("/", (req, res)=>{
	var connection = getConnection();

	connection.connect( (err)=>{

		if(err){
			throw err;
		}
		var sql = "SELECT * FROM packages WHERE PkgEndDate > CURDATE()";

		connection.query(sql, (err, result, fields)=>{
			if(err){
				throw err;
			}
			packagesTable = result;	
			res.render("../index", {packagesTable: packagesTable, dayjs: dayjs});
		});
	});
	
	
});

app.get("/contact", (req, res)=>{
	var connection = getConnection();

	connection.connect( (err)=>{

		if(err){
			throw err;
		}
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
			let arr = new Array();
			let innerArr = new Array();
			var i = -1;
			var j = 0;
			var lastId = -1;
			Object.keys(result).forEach(function(key){
				var row = result[key];
				if(row.AgencyId != lastId){
					lastId = row.AgencyId;
					
					if(i != -1){
						
						arr[i] = innerArr;
						innerArr = new Array();
						j = 0;
					}
					
					i++;
					
				}
				
				innerArr[j++] = row;
			});	
			arr[i] = innerArr;
			agenciesTable = arr;	
			res.render("contact", {agenciesTable: agenciesTable, dayjs: dayjs});
		});
	});
	
	
});

app.get("/order", (req, res)=>{
	console.log(req.query.pkgId);
	var connection = getConnection();

	connection.connect( (err)=>{

		if(err){
			throw err;
		}
		//var sql = "SELECT PkgDesc, PkgName, PkgThumbnail FROM packages WHERE PackageId = " + req.query.pkgId;

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
			
			res.render("order", {desc : desc, title : title, thumb : thumb});
		});
	});
	
	
});

app.post("/submit-order", (req, res)=>{
	console.log("submit order");
	var connection = getConnection();

	connection.connect( (err)=>{

		if(err){
			throw err;
		}

		/*
			BookingDate
			BookingNo ???
			TravelerCount
			CustomerId
			TripTypeId- Trip Types: Business, Group, Leisure
			PackageId

		*/
		var sql = "INSERT INTO bookings (";

		connection.query(sql, (err, result, fields)=>{
			if(err){
				throw err;
			}
			
		});
	});
	
	
});

//This MUST be at the bottom of the page else it will override your page requests!
app.use((req, res, next)=>{
	res.status(404).render("404");
});

