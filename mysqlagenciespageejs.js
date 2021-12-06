const express = require("express");
const app = express();
const mysql = require("mysql");
app.set("view engine", "ejs");

app.listen(8000, (err)=>{
	if (err) throw err;
	console.log("server started");
});

app.get("/getagencies", (req, res)=>{
	var conn = getConnection();
	conn.connect((err)=>{
		if (err) throw err;
		
		var sql = "select * from agencies";
		conn.query(sql, (err, result, fields)=>{
			if (err) throw err;
			
			res.render("index", { result: result });
			conn.end((err)=>{
				if (err) throw err;
			});
		});
	});
});

var getConnection = ()=>{
	return mysql.createConnection({
		host: "localhost",
		user: "Jassu",
		password: "J@ssu24",
		database: "threaded project 1"
	});
}