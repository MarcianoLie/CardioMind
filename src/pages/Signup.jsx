import { useState } from "react";
import { Link } from "react-router-dom";
import "../css/style.css";
import Logo from "../assets/images/Logo.png";
import Profile from "../assets/images/Profile.png";
import EyeIcon from "../assets/images/eye.png";
import GoogleIcon from "../assets/images/google.png";
import TopEllipse from "../assets/images/topEllipse.png";
import BotEllipse from "../assets/images/botEllipse.png";

function SignUp() {
  const [formData, setFormData] = useState({
    fullname: "",
    placeDob: "",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sign up form submitted", formData);
  };

  const handleGoogleSignUp = (e) => {
    e.preventDefault();
    console.log("Google sign up clicked");
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
                id="placeDob"
                placeholder="Place, Date of Birth"
                value={formData.placeDob}
                onChange={handleChange}
                required
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

            <button type="submit" className="signin-btn">
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
