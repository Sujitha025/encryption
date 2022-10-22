//jshint esversion:6
//env file is just like text file where no syntax will be there
require('dotenv').config(); //always at top because we use it for environment variables after this we shall create .env file for storing environment variables
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption"); // for authentication
const app = express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser: true});
const userSchema =  new mongoose.Schema ({ //for encryption
  email:String,
  password:String
});
//const secret = "Thisisourlittlesecret."; add this before creating User collections but it actually place din .env file
//we use process.env.SECRET for accessing secret from .env file
userSchema.plugin(encrypt, {secret:process.env.SECRET,encryptedFields: ["password"] }); //for encrypting particular fields we use encryptedFields here we only want password if we wandt any other put comma after password and continue

//encrypt when save and decrypt when find

const User = new mongoose.model("User",userSchema);

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){
    const newUser = new User({
      email:req.body.username,
      password:req.body.password
    });
    newUser.save(function(err){
      if(err){
        console.log(err);
      }
      else{
        res.render("secrets");
      }
    });
});

app.post("/login",function(req,res){
     const username = req.body.username;
     const password = req.body.password;

     User.findOne({email:username},function(err,foundUser){
       if(err){
         console.log(err);
       }
       else{
         if(foundUser){
           if(foundUser.password === password){
             res.render("secrets");
           }
         }
       }
     })
});










app.listen(3000,function(){
  console.log("Server started on port 3000");
})
