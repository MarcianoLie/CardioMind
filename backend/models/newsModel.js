const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
    title: String,
    link: { type: String, unique: true},
    description: String,
    pubDate: Date,
    imageUrl: String
});

module.exports = mongoose.model("News", newsSchema);