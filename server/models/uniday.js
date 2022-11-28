let mongoose = require('mongoose'); 
let uniday = mongoose.Schema({
    date: String,
    description: String,
    }, 
    {
        collection: "posts"
    }
);

module.exports = mongoose.model('posts', uniday);