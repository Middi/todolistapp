const express = require('express');
const router = express.Router();

const moment = require('moment');

//Bring in Article Models
let Article = require('../models/article');

// User Model
let User = require('../models/user');

// Add Route
router.get('/add', function (req, res) {
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
        article.date = new Date();
        article.fave = req.body.check;

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
    let query = { _id: req.params.id };

    Article.remove(query, function (err) {
        if (err) {
            console.log(err);
        }
        res.send('Success');
    });
});


// Get single Article
router.get('/:id', function (req, res) {
    Article.findById(req.params.id, function (err, article) {
        //set date format
        var date = moment(article.date).format('MMMM Do YYYY, hh:mm a');
        res.render('article', {
            article: article,
            date: date
        });
    });
});


module.exports = router;

