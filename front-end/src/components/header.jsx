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
    const checkSession = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/check-session", {
          method: "GET",
          credentials: "include", // Wajib jika pakai session
        });
  
        const data = await response.json();
        if (data.isLoggedIn) {
          setIsLoggedIn(true);
          setUserName(data.user);
        } else {
          setIsLoggedIn(false);
          setUserName("");
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Gagal mengecek sesi:", error);
        setIsLoggedIn(false);
      }
    };
  
    checkSession();
  
    const intervalId = setInterval(checkSession, 10000); // per 10 detik cek ulang
  
    return () => clearInterval(intervalId);
  }, []);
  

  // Handle logout
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8080/api/logout", {
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
              <Link to="/infokesehatan" onClick={closeMenu}>Info Kesehatan</Link>
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
