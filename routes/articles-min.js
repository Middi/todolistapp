const express = require('express');
const router = express.Router();

const moment = require('moment');
// const multer = require('multer');
// const upload = multer();

//Bring in Article Models
let Article = require('../models/article');

// User Model
let User = require('../models/user');

// New route for posting with multer
// router.post('/upload', upload.single('avatar'), function(req, res) {
//     const formData = req.file
//     delete formData.buffer
//   res.send(formData)
// })

// Add Route
router.get('/add', ensureAuthenticated, function (req, res) {
    res.render('add_article', {
        title: 'Add Article'
    });
});

// Add Submit POST Route
router.post('/add', function (req, res) {

    req.checkBody('body', 'Body is required').notEmpty();

    // Get Errors
    let errors = req.validationErrors();

    if (errors) {
        res.render('add_article', {
            title: 'Add Article',
            errors: errors
        });
    }
    else {
        let article = new Article();
        article.title = req.body.title;
        article.body = req.body.body;
        article.author = req.user._id;
        article.date = moment();
        article.fave = req.body.check;
        article.color = req.body.color;

        article.save(function (err) {
            if (err) {
                console.log(err);
                return;
            }
            else {
                req.flash('success', 'Article Added');
                res.redirect('/');
            }
        });
    }
});

// Load Edit Form
router.get('/edit/:id', function (req, res) {
    Article.findById(req.params.id, function (err, article) {
        if(article.author != req.user._id){
            req.flash('danger', 'Not Authorised');
            res.redirect('/');
        }
        res.render('edit_article', {
            title: 'Edit Article',
            article: article
        });
    });
});

// Update Submit POST Route
router.post('/edit/:id', function (req, res) {
    let article = {};
    article.title = req.body.title;
    article.body = req.body.body;
    article.date = moment();
    article.fave = req.body.check;
    article.color = req.body.color;

    let query = { _id: req.params.id };

    Article.update(query, article, function (err) {
        if (err) {
            console.log(err);
            return;
        }
        else {
            req.flash('success', 'Article Updated');
            res.redirect('/');
        }
    });
});

// Delete Article
router.delete('/:id', function (req, res) {
    if (!req.user._id) {
        res.status(500).send();
    }
    let query = { _id: req.params.id };

    Article.findById(req.params.id, function (err, article) {
        if (article.author != req.user._id) {
            res.status(500).send();
        }
        else {

            Article.remove(query, function (err) {
                if (err) {
                    console.log(err);
                }
                res.send('Success');
            });
        }
    });

});


// Get single Article
router.get('/:id', function (req, res) {
    Article.findById(req.params.id, function (err, article) {
        //set date format
        var date = moment(article.date).format('MMMM Do YYYY, hh:mm a');
        User.findById(article.author, function (err, user) {
            res.render('article', {
                article: article,
                date: date,
                author: user.name
            });
        });
    });
});

// Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } 
  else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

module.exports = router;

