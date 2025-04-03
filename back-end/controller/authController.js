const { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} = require("firebase/auth");
const { doc, setDoc, collection, getDoc } = require('firebase/firestore');
const { db, auth } = require("../auth/firebase-config.js");
const { sendPasswordResetEmail } = require('firebase/auth');
const dotenv = require("dotenv");

dotenv.config();

//sign tanpa google
const register = async (req, res) => {
  const { name, birthPlace, birthDate, phone, email, password } = req.body;
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
    };

    const userDocRef = doc(collection(db, 'users'), user.uid);
    await setDoc(userDocRef, userData);

    res.status(200).json({ error: false, message: "User berhasil terdaftar", uid: user.uid });
  } catch (error) {
    res.status(400).json({ error: true, message: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

    
      const idToken = await user.getIdToken();

      res.json({
          error: false, 
          message: 'Berhasil Sign In', 
          uid: user.uid,
          userToken: idToken 
      });
  } catch (error) {
    console.error(error)
      res.status(404).json({ error: true, message: 'Error melakukan Sign In' });
  }
}

// sign google
const googleRegister = async (req, res) => {

  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    const userDocRef = doc(db, "users", user.uid);
    const userDocSnapshot = await getDoc(userDocRef);

    if (!userDocSnapshot.exists()) {
      await setDoc(userDocRef, {
        displayName: user.displayName,
        email: user.email,
        userId: user.uid,
        profileImage: user.photoURL,
      });
    }


    res.status(200).json({
      error: false,
      message: "Berhasil login dengan Google",
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      profileImage: user.photoURL,
    });
  } catch (error) {
    console.error("Error Google Register:", error);
    res.status(400).json({ error: true, message: "Gagal register dengan Google" });
  }
}

const googleLogin = async (req, res) => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    res.status(200).json({
      error: false,
      message: "Login sukses dengan Google",
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      profileImage: user.photoURL,
    });
  } catch (error) {
    console.error("Error Google Login:", error);
    res.status(400).json({ error: true, message: "Gagal login dengan Google" });
  }
}

// reset password
const resetPassword = async(req, res) => {
  const { email } = req.body;
  try {
      await sendPasswordResetEmail(auth, email);
      console.log('Link reset email telah dikirimkan ke:', email);
      return res.status(200).json({message: "Link Reset Password Telah Dikirim Ke Email"});
  } catch (error) {
      return res.status(200).json({message: "Error melakukan reset password"});
  }
}

//signout
const signOutUser = async(req, res) => {
  try {
      await signOut(auth);
      return res.status(200).json({message: "Sign out Berhasil"});
  } catch (error) {
      console.log('Error melakukan sign out:', error);
      return res.status(500).json({message: "Gagal Melakukan Sign Out"});
  }
}



module.exports = { register, login, googleRegister, googleLogin, signOutUser, resetPassword };
