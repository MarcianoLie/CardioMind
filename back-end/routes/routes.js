const express = require("express");
const { register, login, handleGoogleAuth, resetPassword, signOutUser, checkSession } = require("../controller/authController.js");
const { postReply, getReplies ,editProfile, profile, saveSuicidePrediction, newsUpdate, getHealthArticles, articleById, postComments, getComments, postCardioPredict, postImageProfile, getCardioHistory } = require("../controller/appController.js");
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
router.post('/updateImage',postImageProfile);
router.get('/news/update', newsUpdate);
router.get('/news', getHealthArticles); 
router.get('/comments/:newsId', getComments); //gw ubah dlu buat komen
router.get('/riwayatCardio/', getCardioHistory); 
router.get('/news/:id', articleById)
router.post("/comments", postComments);
router.post("/reply", postReply);
router.get("/reply/:commentId", getReplies);
router.get("/check-session", checkSession);
router.post("/postcardiohistory", postCardioPredict);


module.exports = router;