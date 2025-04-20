import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Profile from '../assets/images/Profile.png'; // Update with correct path
import Logo from '../assets/images/Logo.png';      // Update with correct path
import "../css/style.css"

const Header = () => {
  // Simulasi status login dan nama pengguna
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Ganti sesuai dengan logika login Anda
  const [userName, setUserName] = useState(""); // Simpan nama pengguna setelah login

  useEffect(() => {
    // Simulasikan pengambilan data pengguna dari session atau API
    // Jika sudah login, set isLoggedIn ke true dan userName sesuai dengan nama pengguna
    const loggedInUser = localStorage.getItem("user"); // Cek apakah ada user di localStorage
    if (loggedInUser) {
      setIsLoggedIn(true);
      setUserName(loggedInUser); // Ambil nama pengguna dari localStorage atau API
    }
  }, []);

  return (
    <header>
      <div className="left-header">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
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
        {isLoggedIn ? (
          <span>Hi, {userName}!</span> // Menampilkan nama pengguna setelah login
        ) : (
          <>
            <Link to="/login" className="login-btn">
              Login
            </Link>
            <Link to="/signup" className="signup-btn">
              Sign up
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
