var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")

const app = express()

app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
       extended:true
	   }))
	   
mongoose.connect('mongodb://localhost:27017/mydb',{
     useNewUrlParser: true,
	 useUnifiedTopology: true
});


var db = mongoose.connection;

db.on('error' ,()=>console.log("Error in Connecting to Database"));
db.once('open' ,()=>console.log(" Connected to Database"));


app.post("/sign_up", (req,res)=>{
      var firstname = req.body.firstname;
	  var lastname = req.body.lastname;
	  var email = req.body.email;
	  var phoneno = req.body.phoneno;
	  
	  var data = {
	      "firstname": firstname,
		  "lastname": lastname,
		  "email": email,
		  "phoneno": phoneno
		  
	  }
	  db.collection('users').insertOne(data,(err,collection)=>{
	  if(err){
	         throw err;
			 }
			 console.log("Record Inserted Succesfully");
	  
	  });
	  
	  return res.redirect('signup_success.html')
	  
})

app.get("/",(req,res)=>{
      res.set({
	  "Allow-access-Allow-Origin": '*'
	  })
	  return res.redirect('index.html');
	  
	  }).listen(8000);

console.log("listening on PORT 8000");	  



