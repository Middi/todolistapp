const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const moment = require('moment');
var port = process.env.PORT || 3000;

mongoose.connect('mongodb://middi:youandme123@ds151651.mlab.com:51651/nodekb');
let dbb = mongoose.connection;

// Check Connection
dbb.once('open', function () {
    console.log('Connected to MongoDB');
});

// Check for DB Errors
dbb.on('error', function () {
    console.log(err);
});

// Init App
const app = express();

//Bring in Models
let Article = require('./models/article');

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Home Route
app.get('/', function (req, res) {
    Article.find({}, function (err, articles) {
        if (err) {
            console.log(err);
        }
        else {
            res.render('index', {
                title: 'Articles',
                articles: articles
            });
        }
    });
});

// Get single Article
app.get('/article/:id', function(req, res){
    Article.findById(req.params.id, function(err, article){
        //set date format
        var date = moment(article.date).format('MMMM Do YYYY, hh:mm a');
        res.render('article', {
            article: article,
            date: date
        });
    });
});

// Add Route
app.get('/articles/add', function (req, res) {
    res.render('add_article', {
        title: 'Add Article',
    });
});

// Add Submit POST Route
app.post('/articles/add', function(req, res){
    let article = new Article();
    article.title = req.body.title;
    article.body = req.body.body;
    article.date = moment();
    article.save(function(err){
        if(err){
            console.log(err);
            return;
        }
        else {
            res.redirect('/');
        }
    });
});

// Load Edit Form
app.get('/article/edit/:id', function(req, res){
    Article.findById(req.params.id, function(err, article){
        res.render('edit_article', {
            title: 'Edit Article',
            article: article
        });
    });
});


// Update Submit POST Route
app.post('/articles/edit/:id', function(req, res){
    let article = {};
    article.title = req.body.title;
    article.body = req.body.body;

    let query = {_id:req.params.id};

    Article.update(query, article, function(err){
        if(err){
            console.log(err);
            return;
        }
        else {
            res.redirect('/');
        }
    });
});

// Delete Article
app.delete('/article/:id', function(req, res){
    let query = {_id:req.params.id};

    Article.remove(query, function(err){
        if(err){
            console.log(err);
        }
        res.send('Success');
    });
});

// Start Server
app.listen(port, function () {
    console.log('server started on port 8080');
});