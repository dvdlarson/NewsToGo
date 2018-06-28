var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require('request');
var axios = require("axios");
var cheerio = require("cheerio");
//var APIKey="0d356412ea364ed89f3e4c595713817e";
// Require all models
//var db = require("./models");
var app = express();
var router = require('./controllers/controller.js');
app.use('/', router);



var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
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
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);



// Start the server
app.listen(process.env.PORT || 5000, function() {
  console.log("App running!");
});
