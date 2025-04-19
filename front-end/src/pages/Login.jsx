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

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (errors[id]) {
      setErrors((prev) => ({
        ...prev,
        [id]: "",
      }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      email: "",
      password: "",
    };

    if (!formData.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      console.log("Login form submitted", formData, rememberMe);
      // Simulate API call
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await axios.post("http://localhost:8080/login", {
        email: formData.email,
        password: formData.password,
      });
  
      const { uid, userToken, message } = response.data;
  
      console.log("Login berhasil:", message);
      console.log("UID:", uid);
      console.log("Token:", userToken);
  
      // Simpan token ke localStorage/sessionStorage kalau perlu
      localStorage.setItem("token", userToken);

      // On successful login
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      setErrors({
        email: "Invalid credentials",
        password: "Invalid credentials",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();
  
      await axios.post("http://localhost:8080/googleAuth", {}, {
        headers: {
          Authorization: `Bearer ${idToken}`
        },
        withCredentials: true
      });
  
      alert("Sign in sukses dengan Google!");
      navigate("/")
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

      <header>
        <div className="left-header">
          <div className="profile">
            <img src={Profile} alt="Profile" className="profile-img" />
          </div>
          <nav>
            <ul>
              <li>
                <Link to="/info">Info Kesehatan</Link>
              </li>
              <li>
                <Link to="/prediksi">Prediksi</Link>
              </li>
              <li>
                <Link to="/riwayat">Riwayat</Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="logo-center">
          <Link to="/">
            <img src={Logo} alt="CardioMind Logo" />
          </Link>
        </div>

        <div className="auth-buttons">
          <Link to="/login" className="login-btn">
            Login
          </Link>
          <Link to="/signup" className="signup-btn">
            Sign up
          </Link>
        </div>
      </header>

      <main>
        <div className="login-container">
          <div className="login-logo">
            <img src={Logo} alt="CardioMind Logo" />
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="sign-in-label">SIGN IN</div>

            <div className="form-group">
              <input
                type="email"
                id="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "error" : ""}
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "error" : ""}
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
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            <div className="remember-me">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <label htmlFor="remember">Remember me?</label>
            </div>

            <button type="submit" className="signin-btn" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="divider">
            <span>OR SIGN IN WITH</span>
          </div>

          <div className="google-login">
            <button
              className="google-btn"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <img src={GoogleIcon} alt="Google" />
              <span>
                Login with <strong>google</strong>
              </span>
            </button>
          </div>

          <div className="signup-link">
            <p>
              Don't have an account?
              <Link to="/signup"> Create Account</Link>
            </p>
          </div>
        </div>
      </main>

      <footer>
        <div className="footer-content">
          <p>© CardioMind, 2025 All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
}

export default Login;
