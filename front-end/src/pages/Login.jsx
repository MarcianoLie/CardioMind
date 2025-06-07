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
import profile from "../assets/images/Profile.png";
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

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/login`,
        {
          email: formData.email,
          password: formData.password,
        },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        }
      );

      const { uid, userToken, message, status, displayName, profileImage } = response.data;

      // Handle profile image
      const profileImageUrl = profileImage?.startsWith('http')
        ? profileImage
        : profileImage
          ? `data:image/jpeg;base64,${profileImage}`
          : '';

      // Store data
      localStorage.setItem("token", userToken);
      localStorage.setItem("profileName", displayName);
      localStorage.setItem("profileImage", profileImageUrl);

      // Redirect
      if (status === "admin") {
        navigate("/AdminDashboard");
      } else {
        navigate("/");
      }

    } catch (error) {
      if (error.response) {
        setErrors({
          email: error.response.data.message || "Invalid credentials",
          password: error.response.data.message || "Invalid credentials",
        });
      } else {
        setErrors({
          email: "Network error",
          password: "Network error",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatProfileImage = (base64Data) => {
    if (!base64Data) return profile;

    // Jika sudah memiliki prefix data:image
    if (base64Data.startsWith('data:image')) {
      return base64Data;
    }

    // Jika sudah URL lengkap (http://)
    if (base64Data.startsWith('http')) {
      const encodedUrl = encodeURIComponent(base64Data);
      return `${import.meta.env.VITE_BACKEND_URL}/api/img/${encodedUrl}`;
    }

    // Jika base64 tanpa prefix
    return `data:image/jpeg;base64,${base64Data}`;
  };

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/googleAuth`, {}, {
        headers: {
          Authorization: `Bearer ${idToken}`
        },
        withCredentials: true
      });
      const { status } = response.data;



      try {
        const profileResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile`, {
          credentials: "include",
        });
        const profileResult = await profileResponse.json();

        if (profileResponse.ok) {
          localStorage.setItem("profileName", profileResult.user.displayName || '');
          // localStorage.setItem("profileImage", "data:image/jpeg;base64," + profileResult.user.profileImage || '');
          localStorage.setItem("profileImage", (!profileResult.user.profileImage)
            ? ''
            : (profileResult.user.profileImage.startsWith('http')
              ? formatProfileImage(profileResult.user.profileImage)
              : "data:image/jpeg;base64," + profileResult.user.profileImage) || '');

          console.log("Data profil berhasil disimpan ke localStorage");
        }
      } catch (profileError) {
        console.error("Error mengambil profil:", profileError);
        localStorage.setItem("profileName", user.displayName || '');
        localStorage.setItem("profileImage", user.photoURL || '');
      }

      alert("Sign in sukses dengan Google!");
      localStorage.setItem("user", "true");

      if (status === "user") {
        navigate("/")
      } else if (status === "admin") {
        navigate("/AdminDashboard")
      }
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

            <div className="forgot-password" style={{ textAlign: "right", marginBottom: "15px" }}>
              <Link to="/ForgotPassword" style={{ color: "#2b7a0b", textDecoration: "none", fontSize: "14px" }}>
                Forgot Password?
              </Link>
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
    </div>
  );
}

export default Login;
