import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/images/Logo.png";
import LogoSmall from "../assets/images/logo-mobile.svg";
import ProfileImg from "../assets/images/Profile.png";
import profile from "../assets/images/Profile.png";
import "../css/style.css";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [profileImage, setProfileImage] = useState(""); // Default image
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const sidebarRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const navigate = useNavigate();

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const formatProfileImage = (base64Data) => {
          if (!base64Data) return profile;
          
          // Jika sudah memiliki prefix data:image
          if (base64Data.startsWith('data:image')) {
            return base64Data;
          }
          if (base64Data.startsWith('http://localhost:8080/api/img')) {
            return base64Data;
          }
          
          // Jika sudah URL lengkap (http://)
          if (base64Data.startsWith('http')) {
            const encodedUrl = encodeURIComponent(base64Data);
            return `http://localhost:8080/api/img/${encodedUrl}`;
          }

          if (base64Data.endsWith('.png')) {
            return base64Data;
          }
          
          // Jika base64 tanpa prefix
          return `data:image/jpeg;base64,${base64Data}`;
        };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // When opening mobile menu, close dropdown if open
    if (!isMobileMenuOpen && isDropdownOpen) {
      setIsDropdownOpen(false);
    }
  };

  // Close menu on link click
  const closeMenu = () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  // Toggle profile dropdown
  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Add event listener for close button
  useEffect(() => {
    const handleCloseClick = (e) => {
      // Check if the click was on the close button (::before pseudo-element)
      // We can approximate by checking if click was at the top-left region of the sidebar
      if (sidebarRef.current && isMobileMenuOpen) {
        const { top, left } = e.target.getBoundingClientRect();
        if (top < 50 && left < 50) {
          closeMenu();
        }
      }
    };

    if (isMobileMenuOpen && sidebarRef.current) {
      sidebarRef.current.addEventListener('click', handleCloseClick);
    }

    return () => {
      if (sidebarRef.current) {
        sidebarRef.current.removeEventListener('click', handleCloseClick);
      }
    };
  }, [isMobileMenuOpen]);

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

          // Cek localStorage untuk nama dan gambar profil
          const storedDisplayName = localStorage.getItem("profileName");
          const storedProfileImage = localStorage.getItem("profileImage");

          // Gunakan data dari localStorage jika tersedia
          if (storedDisplayName) {
            setUserName(storedDisplayName);
          } else {
            setUserName(data.user); // Fallback ke data dari API
          }
          setStatus(data.status)

          // Gunakan gambar profil dari localStorage jika tersedia
          if (storedProfileImage && storedProfileImage !== "undefined" && storedProfileImage !== "" && storedProfileImage !== null) {
            console.log(storedProfileImage)
            console.log(profile)
            setProfileImage(storedProfileImage);
          }
        } else {
          setIsLoggedIn(false);
          setUserName("");
          console.log(profile)
          setProfileImage(profile); // Reset ke gambar default
          localStorage.removeItem("profileName");
          localStorage.removeItem("profileImage");
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Gagal mengecek sesi:", error);
        setIsLoggedIn(false);
      }
    };

    checkSession();

    // Cek lokal storage saat komponen dimuat
    const storedDisplayName = localStorage.getItem("profileName");
    const storedProfileImage = localStorage.getItem("profileImage");

    if (storedDisplayName) {
      setUserName(storedDisplayName);
    }

    if (storedProfileImage && storedProfileImage !== "undefined" && storedProfileImage !== "") {
      setProfileImage(storedProfileImage);
    }

    const intervalId = setInterval(checkSession, 1000); // per detik cek ulang

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
        localStorage.removeItem("profileName");
        localStorage.removeItem("profileImage");
        setIsLoggedIn(false);
        setUserName("");
        setProfileImage(ProfileImg); // Reset ke gambar default
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
      <div className={`hamburger-menu ${isMobileMenuOpen ? 'open' : ''}`} onClick={toggleMobileMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className={`left-header ${isMobileMenuOpen ? 'open' : ''}`} ref={sidebarRef}>
        <nav>
          <ul>
            <li>
              {(status == "admin")?<Link to="/AdminDashboard" onClick={closeMenu}>Home</Link>:<Link to="/" onClick={closeMenu}>Home</Link>}
              {/* <Link to="/" onClick={closeMenu}>Home</Link> */}
            </li>
            <li>
              <Link to="/infokesehatan" onClick={closeMenu}>Info Kesehatan</Link>
            </li>
            <li className="dropdown-container">
              <a onClick={toggleDropdown} className="dropdown__link">
                Prediksi <span className="dropdown-arrow">&#9662;</span>
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
          <img className="logo-large" src={Logo} alt="CardioMind Logo" />
          <img className="logo-small" src={LogoSmall} alt="CardioMind Logo Small" />
        </Link>
      </div>

      <div className="auth-buttons">
        {isLoggedIn ? (
          <div className="user-info" ref={profileDropdownRef}>
            <div className="profile-img-container" onClick={toggleProfileDropdown}>
              {/* <img src={profileImage} alt="Profile" className="profile-image" /> */}
              <img src={formatProfileImage(profileImage)} alt="Profile" className="dropdown-profile-image" />
            </div>
            {isProfileDropdownOpen && (
              <div className="profile-dropdown">
                <div className="profile-dropdown-header">
                  <img src={formatProfileImage(profileImage)} alt="Profile" className="dropdown-profile-image" />
                  <div className="dropdown-user-info">
                    <span className="dropdown-username">{userName}</span>
                  </div>
                </div>
                <div className="profile-dropdown-menu">
                  <Link to="/profile" className="dropdown-item" onClick={() => setIsProfileDropdownOpen(false)}>
                    <span className="dropdown-item-icon">👤</span>
                    Profile
                  </Link>
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-item" onClick={handleLogout}>
                    <span className="dropdown-item-icon">🚪</span>
                    Logout
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="login-btn">Login</Link>
            <Link to="/signup" className="signup-btn">Sign up</Link>
          </>
        )}
      </div>

      {isMobileMenuOpen && <div className="mobile-menu-overlay" onClick={toggleMobileMenu}></div>}
    </header>
  );
};

export default Header;