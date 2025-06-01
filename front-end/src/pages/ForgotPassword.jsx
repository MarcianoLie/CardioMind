import { useState } from "react";
import { Link } from "react-router-dom";
import "../css/style.css";
import Logo from "../assets/images/Logo.png";
import TopEllipse from "../assets/images/topEllipse.png";
import BotEllipse from "../assets/images/botEllipse.png";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError("");
    setSuccessMessage("");
  };

  const validateEmail = () => {
    if (!email) {
      setError("Email is required");
      return false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Email is invalid");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/resetPassword`, {
        email: email
      });

      setSuccessMessage("Password reset instructions have been sent to your email.");
      setEmail("");
    } catch (error) {
      console.error("Error:", error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to send reset email. Please try again.");
      }
    } finally {
      setIsLoading(false);
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
            <div className="sign-in-label">FORGOT PASSWORD</div>

            <div className="form-group">
              <input
                type="email"
                id="email"
                placeholder="Enter your email address"
                value={email}
                onChange={handleChange}
                className={error ? "error" : ""}
              />
              {error && <span className="error-message">{error}</span>}
              {successMessage && (
                <span className="success-message" style={{ color: "#2b7a0b", marginTop: "5px", display: "block" }}>
                  {successMessage}
                </span>
              )}
            </div>

            <button type="submit" className="signin-btn" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="signup-link">
            <p>
              Remember your password?
              <Link to="/login"> Sign In</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ForgotPassword;