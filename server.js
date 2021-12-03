const express = require("express");
const app = express();
const fs = require("fs");
const mysql = require("mysql");
const FileReader = require('filereader');
let fileReader = new FileReader();
var FileAPI = require('file-api')
  , File = FileAPI.File
  , FileList = FileAPI.FileList
  ;

let packagesTable = {};

app.use(express.static("public", { "extensions": ["css", "js"] }));
app.use(express.static("views", { "extensions": ["html", "htm", "ejs"] }));
app.set("view engine", "ejs");

app.listen(8000, ()=>{ console.log("server started on port 8000"); });



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
			var sql = "SELECT * FROM packages";
			connection.query(sql, (err, result, fields)=>{
				if(err){
					throw err;
				}
				packagesTable = result;	
			});
		});
		
		res.render("../index", {packagesTable : packagesTable});
	});

app.use((req, res, next)=>{
	res.status(404).render("404");
});

