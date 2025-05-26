const mongoose = require('mongoose');

const suicidePredictionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    predictionResult: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('SuicidePrediction', suicidePredictionSchema);
