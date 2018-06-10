var request = require('request');  
var express = require("express");
var mongoose = require("mongoose");
var path = require('path');
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");
// Require all models
var db = require("../models");
// Initialize Express
var app = express.Router();

//Routes

// Routes
//var routes = require("./routes");

app.get("/",function(req,res){
    res.redirect('/scrape');
})
// A GET route for scraping the echoJS website


app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with request
    axios.get("http://www.politico.com/").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
  
      // Now, we grab every h1 that is a 'headline' class, and do the following:
      $("h1.headline").each(function(i, element) {
        // Save an empty result object
        var result = {};
  
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .children("a")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");
  
          //check for duplicates
          db.Article.count( { link : result.link}, function(error, count) {
            if(count==0){   
        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, send it to the client
            return res.json(err);
          });
        }
    })
      });
  
      // redirect after scraping
      res.redirect("/articles");
      
    });
  });
  
  // API Route for getting JSON of all Articles from the db
  app.get("/api/articles", function(req, res) {
    
    db.Article.find()
      .then(function(dbArticle) {
        //  send back the articles
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
  // Route for getting all Articles from the db
  // Grab every document in the Articles collection that is NOT saved
  app.get("/articles", function(req, res) {
    // sort by id descending)
    db.Article.find({ saved: false }).sort({_id: -1})
  
      // include the notes
      .populate('notes')
  
      // render
      .exec(function(err, article){
        
        if (err){
          console.log(err);
        } 
        else {
          var hbsObject = {articles: article}
          res.render('index', hbsObject);
          
        }
  });
  });

  // Route for getting all Articles from the db
  // Grab every document in the Articles collection that is NOT saved
  app.get("/saved/articles", function(req, res) {
    // sort by id descending)
    db.Article.find({ saved: true }).sort({_id: -1})
  
      // include the notes
      .populate('notes')
  
      // render
      .exec(function(err, article){
        
        if (err){
          console.log(err);
        } 
        else {
          var hbsObject = {articles: article}
          res.render('saved', hbsObject);
          
        }
  });
  });
  
  //select article by id and populate notes
  app.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
  // Route for saving article note
  app.post("/articles/:id", function(req, res) {
    // Create a new note 
    db.Note.create(req.body)
      .then(function(dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  // Route for saving article 
  app.post("/articles/save/:id", function(req, res) {
    //select article by ID and updated the saved value to true
   db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true }, { new: true })
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
    
  });
  // Route for 'deleting' saved article 
  app.post("/articles/delete/:id", function(req, res) {
    //select article by ID and updated the saved value to true
   db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: false }, { new: true })
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
    
  });