const { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } = require("firebase/auth");
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

    const userData = {
      displayName: name,
      email,
      userId: user.uid,
      birthPlace: birthPlace,
      birthDate: birthDate,
      phone: phone,
      profileImage: null,
      created_at: new Date()
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
    const idToken = await firebaseUser.getIdToken();

    // 🔍 Cari user di MongoDB berdasarkan UID atau email
    const user = await User.findOne({ email: firebaseUser.email });
    if (!user) {
      return res.status(404).json({ error: true, message: "User tidak ditemukan di MongoDB" });
    }
    // 🧠 Simpan userId ke dalam session
    req.session.userId = user._id;
    console.log("Session userId set:", req.session.userId);

    res.json({
      error: false,
      message: 'Berhasil Sign In',
      uid: firebaseUser.uid,
      userId: user._id, // kirim juga kalau perlu
      userToken: idToken,
    });
  } catch (error) {
    console.error(error)
    res.status(404).json({ error: true, message: 'Error melakukan Sign In' });
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
        created_at: new Date()
      });

      user = await newUser.save(); 
    }

    req.session.userId = user._id;
    console.log("Session userId set via Google login/signup:", req.session.userId);

    return res.status(200).json({
      error: false,
      message: "Login Google sukses",
      uid,
      email,
      displayName: name,
      profileImage: picture,
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



module.exports = { register, login, handleGoogleAuth, signOutUser, resetPassword }
