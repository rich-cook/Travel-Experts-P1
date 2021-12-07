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
let agenciesTable = {};

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
		var sql = "select agencies.AgencyId, agencies.AgncyAddress, agencies.AgncyCity,agencies.AgncyProv, agencies.AgncyPostal, agencies.AgncyCountry, agencies.AgncyPhone, agencies.AgncyFax, agents.AgtFirstName, agents.AgtLastName, agents.AgtBusPhone, agents.AgtEmail, agents.AgtPosition from agencies join agents on agents.AgencyId = agencies.AgencyId where agents.AgencyId = agencies.AgencyId order by agencies.agencyid;";

		connection.query(sql, (err, result, fields)=>{
			if(err){
				throw err;
			}

			agenciesTable = result;	
			console.log(agenciesTable);
		});
	});
	
	res.render("contact", {agenciesTable: agenciesTable, dayjs: dayjs});
});

app.use((req, res, next)=>{
	res.status(404).render("404");
});

