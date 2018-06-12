var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require('request');
var axios = require("axios");
var cheerio = require("cheerio");
var APIKey="0d356412ea364ed89f3e4c595713817e";
// Require all models
//var db = require("./models");
var app = express();
var router = require('./controllers/controller.js');
app.use('/', router);
var PORT = 3000;
var MONGODB_URI = "mongodb://heroku_s3h8ts8g:9doc85r01bscs5e6b0"
// Initialize Express


// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));
// Set Handlebars.
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({
  defaultLayout: "main"
}));
app.set("view engine", "handlebars");
// Connect to the Mongo DB
mongoose.connect("mongodb://heroku1041:db104185210@ds051903.mlab.com:51903/heroku_s3h8ts8g");



// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
