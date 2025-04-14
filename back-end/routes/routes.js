const express = require("express");
const { register, login, handleGoogleAuth, resetPassword, signOutUser } = require("../controller/authController.js");
const { authUser } = require("../auth/middleware.js")


const router = express.Router();


router.post('/googleAuth', handleGoogleAuth);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', authUser, signOutUser);
router.post('/login/resetPassword', resetPassword);

// router.get('/users', (req, res) => {
//     res.send('Ini daftar users');
// });

module.exports = router;