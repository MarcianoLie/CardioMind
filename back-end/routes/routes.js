const express = require("express");
const { register, login, googleLogin, googleRegister, resetPassword, signOutUser } = require("../controller/authController.js");
const { authUser } = require("../auth/middleware.js")


const router = express.Router();


router.post('/googleRegister', googleRegister);
router.post('/googleLogin', googleLogin);
router.post('/register', register);
router.post('/login', login);


router.post('/logout', authUser, signOutUser);
router.post('/login/resetPassword', resetPassword);

module.exports = router;