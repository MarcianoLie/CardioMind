import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/images/Logo.png";
import "../css/style.css";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown on link click
  const closeMenu = () => {
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    // Fungsi untuk memeriksa status login
    const checkLoginStatus = () => {
      const loggedInUser = localStorage.getItem("user");
      if (loggedInUser) {
        setIsLoggedIn(true);
        setUserName(loggedInUser);
      } else {
        setIsLoggedIn(false);
        setUserName("");
      }
    };

    // Call checkLoginStatus immediately to ensure the state is correct on load
    checkLoginStatus();

    // Optional: Periodically check the login status
    const intervalId = setInterval(checkLoginStatus, 1000); // Cek setiap detik

    // Cleanup the interval when component unmounts
    return () => clearInterval(intervalId);
  }, []); // Only run on initial render

  // Handle logout
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8080/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Hanya jika backend pakai auth
        },
        credentials: "include", // Jika pakai session login
      });

      if (response.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        setUserName("");
        navigate("/login");
      } else {
        console.error("Logout gagal");
      }
    } catch (err) {
      console.error("Terjadi kesalahan saat logout:", err);
    }
  };

  return (
    <header>
      <div className="left-header">
        <nav>
          <ul>
            <li>
              <Link to="/" onClick={closeMenu}>Home</Link>
            </li>
            <li>
              <Link to="/info" onClick={closeMenu}>Info Kesehatan</Link>
            </li>
            <li className="dropdown-container">
              <a onClick={toggleDropdown} className="dropdown__link">
                Prediksi
              </a>
              {isDropdownOpen && (
                <div className="dropdown-list-predict">
                  <Link to="/PrediksiJantung" className="dropdown-link" onClick={closeMenu}>
                    Kesehatan Jantung
                  </Link>
                  <Link to="/PrediksiBunuhdiri" className="dropdown-link" onClick={closeMenu}>
                    Bunuh Diri
                  </Link>
                </div>
              )}
            </li>
            <li>
              <Link to="/riwayat" onClick={closeMenu}>Riwayat</Link>
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
        {isLoggedIn ? (
          <div className="user-info">
            <span>Hi, {userName}!</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        ) : (
          <>
            <Link to="/login" className="login-btn">Login</Link>
            <Link to="/signup" className="signup-btn">Sign up</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
