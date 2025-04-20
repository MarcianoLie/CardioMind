const { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} = require("firebase/auth");
const { doc, setDoc, collection, getDoc } = require('firebase/firestore');
const { db, auth } = require("../auth/firebase-config.js");
const { sendPasswordResetEmail } = require('firebase/auth');
const { admin } = require("../auth/middleware.js")
const dotenv = require("dotenv");
const { mongo } = require("mongoose");
const { User } = require("./authController.js");

dotenv.config();

const profile = async (req, res) => {
    try{
        const userId = req.user.uid;
        const UserProfile = await User.findOne({uid: userId});
        res.status(200).json(UserProfile);
    } catch (error){
        res.status(500).json({error: true, message: error.message})
    }
}

const editProfile = async (req, res) => {
    const { name, birthPlace, birthDate, phone } = req.body;
    try{
        const userNewData = {
            displayName: name,
            birthPlace: birthPlace,
            birthDate: birthDate,
            phone: phone
        }
    
    res.status(200).json({ error: false, message: "Data user berhasil diubah", uid: user.uid });
    }
     catch (error) {
    res.status(400).json({ error: true, message: error.message });
    }
};

module.exports = { editProfile };