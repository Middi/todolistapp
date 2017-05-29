let mongoose = require('mongoose');

// Article Schema
let articleSchema = mongoose.Schema({
    title:{
        type: String,
    },
    body:{
        type: String,
    },
    date:{
    }
});

let Article = module.exports = mongoose.model('Article', articleSchema);