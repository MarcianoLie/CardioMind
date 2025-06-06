const mongoose = require("mongoose");

const cardioSchema = new mongoose.Schema({
    userId: String,
    age: Number, 
    gender: String, 
    height: Number, 
    weight: Number, 
    ap_hi: Number, 
    ap_lo: Number,      
    cholesterol: Number, 
    glucose: Number, 
    smoke: String, 
    alcohol: String, 
    active: String,
    score: Number,
    createdAt: {type: Date, default: Date.now,},
});

module.exports = mongoose.model("cardioPredict", cardioSchema);