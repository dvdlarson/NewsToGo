var request = require('request');  
var express = require("express");
var mongoose = require("mongoose");
var path = require('path');
var axios = require("axios");
var cheerio = require("cheerio");
// Require all models
var db = require("../models");
// Initialize Express
var router = express.Router();

//Routes

// Routes
//var routes = require("./routes");

router.get("/",function(req,res){
    res.redirect('/scrape');
})
// A GET route for scraping 


router.get("/scrape", function(req, res) {
    axios.get("http://www.politico.com/").then(function(response) {
      var $ = cheerio.load(response.data);
      $("h1.headline").each(function(i, element) {
        
        var result = {};
  
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
  router.get("/api/articles", function(req, res) {
    
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
  router.get("/articles", function(req, res) {
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
  router.get("/saved/articles", function(req, res) {
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
  router.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
        .populate("note")
      .then(function(dbArticle) {
         res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
  // Route for saving article note
  router.post("/add-note/:id", function(req, res) {
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
  router.post("/articles/save/:id", function(req, res) {
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
  router.post("/articles/delete/:id", function(req, res) {
    //select article by ID and updated the saved value to true
   db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: false }, { new: true })
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
    
  });

  module.exports = router;