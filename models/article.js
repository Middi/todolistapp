let mongoose = require('mongoose');

// Article Schema
let articleSchema = mongoose.Schema({
    title:{
        type: String,
    },
    body:{
        type: String,
    },
    author:{
        type: String,
    },
    date:{
    },
    fave:{
    },
    color:{
        type: Number,
    }
});

let Article = module.exports = mongoose.model('Article', articleSchema);