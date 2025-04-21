import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/images/Logo.png"; // Update with correct path
import "../css/style.css";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Track if dropdown is open

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close the menu when a link is clicked (for mobile)
  const closeMenu = () => {
    setIsMenuOpen(false);
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
            {/* Prediksi menu with dropdown */}
            <li className="dropdown-container">
              <a
                onClick={toggleDropdown}
                className="dropdown__link"
              >
                Prediksi
              </a>
              {/* Dropdown Menu */}
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
        <Link to="/login" className="login-btn">Login</Link>
        <Link to="/signup" className="signup-btn">Sign up</Link>
      </div>
    </header>
  );
};

export default Header;
