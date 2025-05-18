const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
    userId: String,
    commentId: String,
    reply: String,
    createdAt: Date,
});

module.exports = mongoose.model("Reply", replySchema);