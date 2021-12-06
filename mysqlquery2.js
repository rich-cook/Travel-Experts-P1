const mysql = require("mysql");

const con = mysql.createConnection({
	host: "localhost",
	user: "Jassu",
	password: "J@ssu24",
	database: "threaded project 1"
});

con.connect((err)=>{
	if (err) throw err;
	
	con.query("select * from agencies", (err, result, fields)=>{
		if (err) throw err;
		
		console.log(fields);
		console.log(result);
		con.end((err)=>{
			if (err) throw err;
		});
	});
});