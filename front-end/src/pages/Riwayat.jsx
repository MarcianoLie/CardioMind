import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/history.css";
import topEllipse from "../assets/images/topEllipse.png";
import botEllipse from "../assets/images/botEllipse.png";
import profile from "../assets/images/Profile.png";
import stress from "../assets/images/stress.png";
import jantung from "../assets/images/jantung.png";

const Riwayat = () => {
  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const loginBtn = document.querySelector(".auth-buttons .login-btn");
    const signupBtn = document.querySelector(".auth-buttons .signup-btn");
    const profileCardImg = document.getElementById("profile-card-img");
    const profileUsername = document.getElementById("profile-username");

    if (isLoggedIn === "true" && loginBtn && signupBtn) {
      // Change buttons to show logout instead
      loginBtn.textContent = "Logout";
      loginBtn.href = "#";
      signupBtn.style.display = "none";

      // Add logout functionality
      loginBtn.addEventListener("click", function (e) {
        e.preventDefault();
        localStorage.setItem("isLoggedIn", "false");
        window.location.reload();
      });

      // Load username from localStorage if available
      const savedUsername = localStorage.getItem("username");
      if (savedUsername && profileUsername) {
        profileUsername.textContent = savedUsername;
      }
    } else {
      // Redirect to login page if not logged in
      // Uncomment this if you want to restrict access to logged in users only
      // window.location.href = "login.html";
    }

    // Load profile image from localStorage if available for header
    const savedProfileImage = localStorage.getItem("profileImage");
    const profileImg = document.querySelector(".profile-img");
    if (savedProfileImage && profileImg) {
      profileImg.src = savedProfileImage;

      // Also update the profile card image
      if (profileCardImg) {
        profileCardImg.src = savedProfileImage;
      }
    }

    // Add dropdown functionality
    const dropdownToggle = document.querySelector(".dropdown-toggle");
    if (dropdownToggle) {
      dropdownToggle.addEventListener("click", function (e) {
        e.preventDefault();
        const dropdownMenu = this.nextElementSibling;
        dropdownMenu.style.display =
          dropdownMenu.style.display === "flex" ? "none" : "flex";
      });
    }

    // Tab filtering functionality
    const tabs = document.querySelectorAll(".tab");
    const predictionCards = document.querySelectorAll(".prediction-card");

    tabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        // Remove active class from all tabs and add to clicked tab
        tabs.forEach((t) => t.classList.remove("active"));
        this.classList.add("active");

        const filterType = this.dataset.type;

        // Filter cards based on selected tab
        predictionCards.forEach((card) => {
          if (filterType === "semua" || card.dataset.category === filterType) {
            card.style.display = "flex";
          } else {
            card.style.display = "none";
          }
        });
      });
    });
  }, []);

  return (
    <div className="container">
      <div className="background">
        <img src={topEllipse} alt="" className="top-ellipse" />
        <img src={botEllipse} alt="" className="bottom-ellipse" />
      </div>

      <main>
        <div className="history-content">
          {/* Left Profile Section */}
          <div className="profile-card">
            <div className="profile-image">
              <img
                id="profile-card-img"
                src={profile}
                alt="Profile Icon"
              />
            </div>
            <h2 className="username" id="profile-username">
              Azka
            </h2>

            <div className="prediction-stats">
              <div className="stats-images">
                {/* Stress prediction stats */}
                <div className="stat-icon">
                  <img src={stress} alt="Stress Icon" />
                </div>
                <div className="stat-level">Level : Rendah</div>

                {/* Heart prediction stats */}
                <div className="stat-icon">
                  <img src={jantung} alt="Heart Icon" />
                </div>
                <div className="stat-level">Level : Rendah</div>
              </div>
            </div>
          </div>

          {/* Main Content Section */}
          <div className="main-content">
            <Link to="/" className="back-link">
              <svg width="18" height="16.5" viewBox="0 0 18 16.5">
                <path
                  d="M8 1L1 8.5L8 16"
                  stroke="black"
                  strokeWidth="1.5"
                  fill="none"
                />
                <path d="M1 8.5H17" stroke="black" strokeWidth="1.5" />
              </svg>
            </Link>

            <h1 className="history-title">Riwayat Prediksi</h1>

            {/* Filter tabs */}
            <div className="history-tabs">
              <div className="tab active" data-type="semua">
                Semua
              </div>
              <div className="tab" data-type="stress">
                Stress
              </div>
              <div className="tab" data-type="jantung">
                Jantung
              </div>
            </div>

            {/* Prediction cards */}
            <div className="prediction-cards">
              {/* First prediction */}
              <div className="prediction-card" data-category="stress">
                <div className="prediction-image">
                  <img src={stress} alt="Stress Icon" />
                </div>
                <div className="prediction-info">
                  <h3 className="prediction-title">
                    Prediksi Tingkat Bunuh Diri
                  </h3>
                  <p className="prediction-level">
                    Level : <span>Rendah</span>
                  </p>
                </div>
                <a href="#" className="prediction-details">
                  Lihat Detail Prediksi
                </a>
              </div>

              {/* Second prediction */}
              <div className="prediction-card" data-category="jantung">
                <div className="prediction-image">
                  <img src={jantung} alt="Heart Icon" />
                </div>
                <div className="prediction-info">
                  <h3 className="prediction-title">Prediksi Tingkat Jantung</h3>
                  <p className="prediction-level">
                    Level : <span>Rendah</span>
                  </p>
                </div>
                <a href="#" className="prediction-details">
                  Lihat Detail Prediksi
                </a>
              </div>

              {/* Third prediction */}
              <div className="prediction-card" data-category="stress">
                <div className="prediction-image">
                  <img src={stress} alt="Stress Icon" />
                </div>
                <div className="prediction-info">
                  <h3 className="prediction-title">
                    Prediksi Tingkat Bunuh Diri
                  </h3>
                  <p className="prediction-level">
                    Level : <span>Rendah</span>
                  </p>
                </div>
                <a href="#" className="prediction-details">
                  Lihat Detail Prediksi
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Riwayat;