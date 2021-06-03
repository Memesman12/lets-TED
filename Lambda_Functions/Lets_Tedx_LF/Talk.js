  
const mongoose = require('mongoose');

const talk_schema = new mongoose.Schema({
    title: String,
    duration: String,
    url: String,
    details: String,
    num_views: Number,
    main_author: String
}, { collection: 'tedx_data' });

module.exports = mongoose.model('talk', talk_schema);