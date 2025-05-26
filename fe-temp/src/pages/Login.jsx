import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/style.css";
import Logo from "../assets/images/Logo.png";
import EyeIcon from "../assets/images/eye.png";
import GoogleIcon from "../assets/images/google.png";
import TopEllipse from "../assets/images/topEllipse.png";
import BotEllipse from "../assets/images/botEllipse.png";

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
      await new Promise((resolve) => setTimeout(resolve, 1000));

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

  const handleGoogleLogin = (e) => {
    e.preventDefault();
    console.log("Google login clicked");
    // Add Google authentication logic here
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
    </div>
  );
}

export default Login;
