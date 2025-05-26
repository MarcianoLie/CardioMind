import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/history.css";
import topEllipse from "../assets/images/topEllipse.png";
import botEllipse from "../assets/images/botEllipse.png";
import profile from "../assets/images/Profile.png";
import stress from "../assets/images/stress.png";
import jantung from "../assets/images/jantung.png";

const Riwayat = () => {
  const [suicidePredictions, setSuicidePredictions] = useState([]);
  const [cardioPredictions, setCardioPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("semua");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/check-session", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();
        if (data.isLoggedIn) {
          setIsLoggedIn(true);
          const storedDisplayName = localStorage.getItem("profileName");
          const storedProfileImage = localStorage.getItem("profileImage");
          setUsername(storedDisplayName || "User");
          setProfileImage(storedProfileImage);
          // Fetch data secara paralel
          await Promise.all([
            fetchSuicidePredictions(),
            fetchCardioPredictions()
          ]);

          setLoading(false);
        } else {
          window.location.href = "/login";
        }
      } catch (error) {
        console.error("Error checking session:", error);
        window.location.href = "/login";
      }
    };

    checkSession();
  }, []);

  const fetchSuicidePredictions = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/suicideHistory", {
        credentials: 'include'
      });
      const data = await response.json();
      if (!data.error) {
        const sortedData = data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setSuicidePredictions(sortedData);
      }

    } catch (error) {
      console.error("Failed to fetch suicide predictions:", error);
    }
  };

  const fetchCardioPredictions = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/riwayatCardio", {
        credentials: 'include'
      });
      const data = await response.json();
      if (!data.error) {
        const sortedData = data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setCardioPredictions(sortedData);
      }

    } catch (error) {
      console.error("Failed to fetch cardio predictions:", error);
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const getRiskLevel = (result) => {
    if (!result) return "Tidak diketahui";
    if (typeof result === 'string') {
      if (result.toLowerCase().includes("high") || result.toLowerCase().includes("tinggi")) return "Tinggi";
      if (result.toLowerCase().includes("medium") || result.toLowerCase().includes("sedang")) return "Sedang";
      return "Rendah";
    }
    return result >= 0.5 ? "Tinggi" : "Rendah";
  };


  const filteredPredictions = (() => {
    if (activeTab === "semua") {
      const all = [
        ...suicidePredictions.map(p => ({ ...p, type: 'stress' })),
        ...cardioPredictions.map(p => ({ ...p, type: 'jantung' }))
      ];
      return all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    if (activeTab === "stress") {
      return suicidePredictions.map(p => ({ ...p, type: 'stress' }));
    }
    if (activeTab === "jantung") {
      return cardioPredictions.map(p => ({ ...p, type: 'jantung' }));
    }
    return [];
  })();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8080/api/logout", {
        method: "POST",
        credentials: "include",
      });
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

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
                src={profileImage || profile}
                alt="Profile Icon"
              />
            </div>
            <h2 className="username" id="profile-username">
              {username}
            </h2>

            <div className="prediction-stats">
              <div className="stats-images">
                <div className="stat-icon">
                  <img src={stress} alt="Stress Icon" />
                </div>
                Level: {suicidePredictions.length > 0
                  ? suicidePredictions[0].predictionResult
                  : "Tidak ada data"}


                <div className="stat-icon">
                  <img src={jantung} alt="Heart Icon" />
                </div>
                <div className="stat-level">
                  Level: {cardioPredictions.length > 0
                    ? (cardioPredictions[0].score >= 0.5
                      ? "Berpotensi Sakit Jantung"
                      : "Tidak Berpotensi Sakit Jantung")
                    : "Tidak ada data"}
                </div>

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

            <div className="auth-buttons">
              {isLoggedIn && (
                <button className="login-btn" onClick={handleLogout}>
                  Logout
                </button>
              )}
            </div>

            <h1 className="history-title">Riwayat Prediksi</h1>

            <div className="history-tabs">
              <div
                className={`tab ${activeTab === "semua" ? "active" : ""}`}
                onClick={() => setActiveTab("semua")}
              >
                Semua
              </div>
              <div
                className={`tab ${activeTab === "stress" ? "active" : ""}`}
                onClick={() => setActiveTab("stress")}
              >
                Stress
              </div>
              <div
                className={`tab ${activeTab === "jantung" ? "active" : ""}`}
                onClick={() => setActiveTab("jantung")}
              >
                Jantung
              </div>
            </div>

            <div className="prediction-cards">
              {loading ? (
                <div className="loading-spinner">Memuat data...</div>
              ) : filteredPredictions.length === 0 ? (
                <p className="no-data">Tidak ada riwayat prediksi</p>
              ) : (
                filteredPredictions.map((prediction) => (
                  <div key={prediction._id} className="prediction-card" data-category={prediction.type}>
                    <div className="prediction-image">
                      <img src={prediction.type === "jantung" ? jantung : stress} alt="Icon" />
                    </div>
                    <div className="prediction-info">
                      <h3 className="prediction-title">
                        {prediction.type === "jantung"
                          ? "Prediksi Risiko Jantung"
                          : "Prediksi Tingkat Bunuh Diri"}
                      </h3>

                      {prediction.type === "jantung" ? (
                        <>
                          <p className="prediction-message">
                            Skor Risiko: {(prediction.score * 100).toFixed(2)}%
                          </p>
                          <p className="prediction-level">
                            Kesimpulan: <span>
                              {prediction.score >= 0.5
                                ? "Berpotensi Sakit Jantung"
                                : "Tidak Berpotensi Sakit Jantung"}
                            </span>
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="prediction-message">
                            {prediction.message.length > 50
                              ? `${prediction.message.substring(0, 50)}...`
                              : prediction.message}
                          </p>
                          <p className="prediction-level">
                            Level: <span>{prediction.predictionResult}</span>
                          </p>
                        </>
                      )}
                      <p className="prediction-date">{formatDate(prediction.createdAt)}</p>
                    </div>
                    <Link
                      to={`/detail-prediksi/${prediction._id}`}
                      className="prediction-details"
                    >
                      Lihat Detail Prediksi
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Riwayat;