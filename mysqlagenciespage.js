const express = require("express");
const app = express();
const fs = require("fs");
const mysql = require("mysql");

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
			
			fs.readFile("header.html", (err, header)=>{
				if (err) throw err;
				
				res.writeHead(200, { "Content-Type": "text/html" });
				res.write(header);
				
				res.write("<table border='1'>");
				
				res.write("<tr>");
				for (field of fields)
				{
					res.write("<th>" + field.name + "</th>");
				}
				res.write("</tr>");
				
				for (customer of result)
				{
					res.write("<tr>");
					res.write("<td>" + agencies.AgencyId + "</td>"
						+ "<td>" + agencies.AgncyAddress + "</td>"
						+ "<td>" + agencies.AgncyCity + "</td>"
						+ "<td>" + agencies.AgncyProv + "</td>"
						+ "<td>" + agencies.AgncyPostal + "</td>"
						+ "<td>" + agencies.AgncyCountry + "</td>"
						+ "<td>" + agencies.AgncyPhone + "</td>"
						+ "<td>" + agencies.AgncyFax + "</td>");
					res.write("</tr>");
				}
				res.write("</table>");
				fs.readFile("footer.html", (err, footer)=>{
					if (err) throw err;
					res.write(footer);
					res.end();
				});
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