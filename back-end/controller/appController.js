const { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } = require("firebase/auth");
const { doc, setDoc, collection, getDoc } = require('firebase/firestore');
const { db, auth } = require("../auth/firebase-config.js");
const { sendPasswordResetEmail } = require('firebase/auth');
const { admin } = require("../auth/middleware.js")
const dotenv = require("dotenv");
const User = require("../models/userModel.js");
const SuicidePrediction = require('../models/suicideModel.js');

dotenv.config();

// profile
const profile = async (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: true, message: "Unauthorized" });

    const userProfile = await User.findOne({ _id: userId });
    if (!userProfile) {
        return res.status(404).json({ error: true, message: "User tidak ditemukan" });
    }

    res.status(200).json({ error: false, message: "Data User ditemukan", user: userProfile });
};


const editProfile = async (req, res) => {
    const { displayName, birthPlace, birthDate, phone } = req.body;
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: true, message: "Unauthorized" });
    try {
        const userNewData = {
            displayName: displayName,
            birthPlace: birthPlace,
            birthDate: birthDate,
            phone: phone
        }
        const result = await User.updateOne(
            { _id: userId },
            { $set: userNewData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: true, message: "User tidak ditemukan" });
        }

        res.status(200).json({ error: false, message: "Data user berhasil diubah", _id: userId });
    }
    catch (error) {
        res.status(400).json({ error: true, message: error.message });
    }
};


// history
const saveSuicidePrediction = async (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    const { message, predictionResult } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User tidak ditemukan" });
        }

        // Gunakan userId dari MongoDB (yang _id)
        const prediction = new SuicidePrediction({
            userId: user.userId,  
            message,
            predictionResult,
        });

        await prediction.save();
        res.status(201).json({ success: true, data: prediction });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};


module.exports = { editProfile, profile, saveSuicidePrediction };
