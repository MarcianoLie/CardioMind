const { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification } = require("firebase/auth");
const { db, auth } = require("../auth/firebase-config.js");
const { sendPasswordResetEmail } = require('firebase/auth');
const { admin } = require("../auth/middleware.js");
const { User } = require("../models/userModel.js");

const dotenv = require("dotenv");

dotenv.config();



//sign tanpa google
const register = async (req, res) => {
  const { name, birthPlace, birthDate, phone, email, password } = req.body;
  console.log("Incoming data:", req.body);
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await sendEmailVerification(user);

    const userData = {
      displayName: name,
      email,
      userId: user.uid,
      birthPlace: birthPlace,
      birthDate: birthDate,
      phone: phone,
      profileImage: null,
      created_at: new Date(),
      status: "user"
    };


    const mongoUser = new User({
      ...userData,
    });
    await mongoUser.save();

    res.status(200).json({ error: false, message: "User berhasil terdaftar", uid: user.uid });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(400).json({ error: true, message: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Pindahkan pengecekan email verified ke frontend
    if (!firebaseUser.emailVerified) {
      return res.status(403).json({
        error: true,
        message: "Email belum diverifikasi. Cek inbox email kamu.",
        requiresVerification: true
      });
    }

    const idToken = await firebaseUser.getIdToken();
    const user = await User.findOne({ email: firebaseUser.email });

    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User tidak ditemukan di MongoDB"
      });
    }

    // Set session
    req.session.userId = user.userId;
    req.session.status = user.status;
    req.session.username = user.displayName;

    // Simpan session dan kirim response
    req.session.save(err => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({ error: 'Session save failed' });
      }

      // Set cookie header
      res.setHeader('Set-Cookie', [
        `cm_auth=${req.sessionID}; Domain=.railway.app; Path=/; Secure; SameSite=None; HttpOnly; Max-Age=${14 * 24 * 60 * 60}`
      ]);

      // Hanya satu response
      res.json({
        error: false,
        message: 'Berhasil Sign In',
        uid: firebaseUser.uid,
        userId: user.userId,
        userToken: idToken,
        status: user.status,
        displayName: user.displayName,
        profileImage: user.profileImage
      });
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(401).json({
      error: true,
      message: 'Email atau password salah',
      firebaseError: error.message
    });
  }
}

// sign google
const handleGoogleAuth = async (req, res) => {
  try {
    const idToken = req.headers.authorization?.split("Bearer ")[1];
    if (!idToken) {
      return res.status(401).json({ error: true, message: "Token tidak ditemukan" });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, name, email, picture } = decodedToken;


    let user = await User.findOne({ userId: uid });

    if (!user) {
      const newUser = new User({
        userId: uid,
        displayName: name,
        email,
        birthPlace: null,
        birthDate: null,
        phone: null,
        profileImage: picture || null,
        created_at: new Date(),
        status: "user"
      });

      user = await newUser.save();
    }

    req.session.userId = user.userId;
    req.session.status = user.status;
    req.session.username = user.displayName;
    console.log("Session status set:", req.session.status);
    console.log("Session userId set via Google login/signup:", req.session.userId);
    req.session.save(err => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({ error: 'Session save failed' });
      }

      res.setHeader('Set-Cookie', [
        `cm_auth=${req.sessionID}; Domain=.railway.app; Path=/; Secure; SameSite=None; HttpOnly; Max-Age=${14 * 24 * 60 * 60}`
      ]);

      res.json({ success: true });
    });

    return res.status(200).json({
      error: false,
      message: "Login Google sukses",
      uid,
      email,
      displayName: name,
      profileImage: picture,
      status: user.status
    });

  } catch (error) {
    console.error("Error Google Auth:", error);
    return res.status(400).json({ error: true, message: error.message });
  }
};


// reset password
const resetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    await sendPasswordResetEmail(auth, email);
    console.log('Link reset email telah dikirimkan ke:', email);
    return res.status(200).json({ message: "Link Reset Password Telah Dikirim Ke Email" });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(400).json({ error: true, message: error.message });
  }

}

//signout
const signOutUser = async (req, res) => {
  try {
    req.session.destroy();
    return res.status(200).json({ message: "Sign out Berhasil" });
  } catch (error) {
    console.log('Error melakukan sign out:', error);
    return res.status(500).json({ message: "Gagal Melakukan Sign Out" });
  }
};

const checkSession = (req, res) => {
  // console.log("Check : ",req.session.userId)
  if (req.session && req.session.userId) {
    return res.status(200).json({ isLoggedIn: true, user: req.session.username || "User", status: req.session.status });
  } else {
    return res.status(401).json({ isLoggedIn: false });
  }
};



module.exports = { register, login, handleGoogleAuth, signOutUser, resetPassword, checkSession }
