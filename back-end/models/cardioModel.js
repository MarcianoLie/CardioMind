const mongoose = require("mongoose");

const HeartPredictionHistorySchema = mongoose.Schema({
    userId: String, 
    age: Number,
    gender: { type: String, enum: ["male", "female"] },
    height: Number,
    weight: Number,
    systolic: Number,
    diastolic: Number,
    cholesterol: { type: String, enum: ["normal", "above normal", "well above normal"]},
    glucose: { type: String, enum: ["normal", "above normal", "well above normal"]},
    smoke: { type: String, enum: ["yes", "no"] },
    alcohol: { type: String, enum: ["yes", "no"] },
    active: { type: String, enum: ["yes", "no"] },
    predictionResult: String ,
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("HeartPredictionHistory", HeartPredictionHistorySchema);
