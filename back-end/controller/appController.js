const { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } = require("firebase/auth");
const { doc, setDoc, collection, getDoc } = require('firebase/firestore');
const { db, auth } = require("../auth/firebase-config.js");
const { sendPasswordResetEmail } = require('firebase/auth');
const { admin } = require("../auth/middleware.js")
const dotenv = require("dotenv");
const { mongo } = require("mongoose");
const { User } = require("./authController.js");

dotenv.config();

const profile = async (req, res) => {
    try {
        const userId = req.user.uid;
        const userProfile = await User.findOne({ userId: userId });

        if (!userProfile) {
            return res.status(404).json({ error: true, message: "User tidak ditemukan" });
        }

        res.status(200).json({ error: false, message: "Data User ditemukan", user: userProfile });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
};


const editProfile = async (req, res) => {
    const { displayName, birthPlace, birthDate, phone } = req.body;
    const uid = req.user.uid;
    try {
        const userNewData = {
            displayName: displayName,
            birthPlace: birthPlace,
            birthDate: birthDate,
            phone: phone
        }
        const result = await User.updateOne(
            { userId: uid },
            { $set: userNewData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: true, message: "User tidak ditemukan" });
        }

        res.status(200).json({ error: false, message: "Data user berhasil diubah", uid: uid });
    }
    catch (error) {
        res.status(400).json({ error: true, message: error.message });
    }
};

module.exports = { editProfile, profile };