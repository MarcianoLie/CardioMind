import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/style.css";
import Logo from "../assets/images/Logo.png";
import Profile from "../assets/images/Profile.png";
import EyeIcon from "../assets/images/eye.png";
import GoogleIcon from "../assets/images/google.png";
import TopEllipse from "../assets/images/topEllipse.png";
import BotEllipse from "../assets/images/botEllipse.png";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import axios from "axios"; 
 

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    birthPlace: "",
    birthDate: "",
    number: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = formData.fullname;
    const birthPlace = formData.birthPlace;
    const birthDate = new Date(formData.birthDate);
    const number = formData.number;
    const email = formData.email;
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;
     if (isNaN(birthDate)) {
       alert("Tanggal lahir tidak valid, gunakan format misalnya: 'Medan, 01/01/2000'");
       return;
     }
     if (password !== confirmPassword) {
       alert("Password dan Konfirmasi tidak cocok");
       return;
     }
     console.log({
       name,
       birthPlace: birthPlace,
       birthDate: birthDate,
       // birthDate: birthDate,
       phone: number,
       email,
       password
     });
     try {
       
       const response = await axios.post(`${process.env.BACKEND_URL}/api/register`, {
         name,
         birthPlace: birthPlace,
         birthDate: birthDate,
         phone: number,
         email,
         password
       });
       const data = response.data;
       if (data.error) {
         alert("Gagal daftar: " + data.message);
       } else {
         alert("Pendaftaran berhasil! Silakan cek email kamu untuk verifikasi sebelum login.");
         navigate("/login");
       }
   
       alert("Sign in sukses!");
       navigate("/")
     } catch (error) {
       console.error("Error login :", error);
       alert("Gagal login");
     }
     // console.log("Sign up form submitted", formData);
  };

  const handleGoogleSignUp = async (e) => {
  e.preventDefault();
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const idToken = await user.getIdToken();

    // Melakukan autentikasi dengan backend
    const response = await axios.post(`${process.env.BACKEND_URL}/api/googleAuth`, {}, {
      headers: {
        Authorization: `Bearer ${idToken}`
      },
      withCredentials: true
    });

    // Setelah login berhasil, ambil profil
    try {
      const profileResponse = await fetch(`${process.env.BACKEND_URL}/api/profile`, {
        credentials: "include",
      });
      const profileResult = await profileResponse.json();

      if (profileResponse.ok) {
        localStorage.setItem("profileName", profileResult.user.displayName || '');
        localStorage.setItem("profileImage", "data:image/jpeg;base64," + profileResult.user.profileImage || '');
        
        console.log("Data profil berhasil disimpan ke localStorage");
      }
    } catch (profileError) {
      console.error("Error mengambil profil:", profileError);
      localStorage.setItem("profileName", user.displayName || '');
      localStorage.setItem("profileImage", user.photoURL || '');
    }

    alert("Sign in sukses dengan Google!");
    navigate("/");
  } catch (error) {
    console.error("Error login Google:", error);
    alert("Gagal login dengan Google");
  }
};

  return (
    <div className="container">
      <div className="background">
        <img src={TopEllipse} alt="" className="top-ellipse" />
        <img src={BotEllipse} alt="" className="bottom-ellipse" />
      </div>
      <main>
        <div className="login-container">
          <div className="login-logo">
            <img src={Logo} alt="CardioMind Logo" />
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="sign-in-label">SIGN UP</div>

            <div className="form-group">
              <input
                type="text"
                id="fullname"
                placeholder="Full Name"
                value={formData.fullname}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                id="birthPlace"
                placeholder="Tempat Lahir"
                value={formData.birthPlace}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="date"
                id="birthDate"
                placeholder="Tanggal Lahir"
                value={formData.birthDate}
                onChange={handleChange}
                required
                className="date-input"
              />
            </div>

            <div className="form-group">
              <input
                type="tel"
                id="number"
                placeholder="Number"
                value={formData.number}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="email"
                id="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="8"
                />
                <img
                  src={EyeIcon}
                  alt="Show/Hide Password"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  role="button"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="password-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength="8"
                />
                <img
                  src={EyeIcon}
                  alt="Show/Hide Password"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  role="button"
                />
              </div>
            </div>

            <button type="submit" className="signin-btn" onClick={handleSubmit}>
              Sign Up
            </button>
          </form>

          <div className="divider">
            <span>OR SIGN UP WITH</span>
          </div>

          <div className="google-login">
            <button className="google-btn" onClick={handleGoogleSignUp}>
              <img src={GoogleIcon} alt="Google" />
              <span>
                Login with <strong>google</strong>
              </span>
            </button>
          </div>

          <div className="signup-link">
            <p>
              Already have an account? <Link to="/login">Sign In</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SignUp;
