const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    userId: String,
    newsId: String,
    comment: String,
    createdAt: Date,
});

module.exports = mongoose.model("Comments", commentSchema);