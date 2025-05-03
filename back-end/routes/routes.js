const express = require("express");
const { register, login, handleGoogleAuth, resetPassword, signOutUser } = require("../controller/authController.js");
const { editProfile, profile, saveSuicidePrediction, newsUpdate, getHealthArticles } = require("../controller/appController.js");
const { authUser } = require("../auth/middleware.js")


const router = express.Router();

// auth
router.post('/googleAuth', handleGoogleAuth);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', signOutUser);
// router.post('/logout', authUser, signOutUser);
router.post('/resetPassword', resetPassword);

// router.get('/users', (req, res) => {
//     res.send('Ini daftar users');
// });

// app
router.put('/profile', editProfile);
router.get('/profile', profile);
router.post('/suicideHistory', saveSuicidePrediction);
router.get('/news/update', newsUpdate);
router.get('/news', getHealthArticles);

module.exports = router;