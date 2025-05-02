import React from "react";
import tennis from "../assets/images/Slide2.png"
import anjing from "../assets/images/Slide5.png"
import "../css/style.css";
import "../css/news.css";
import { Link } from "react-router-dom";



const InfoKesehatan = () => {
  return (
    <div className="container">
      <main>
        <div className="news-content">
          <div className="back-button">
            <Link to="/">
              <svg
                width="18"
                height="15"
                viewBox="0 0 18 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 7.5H17M1 7.5L7.5 1M1 7.5L7.5 14"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>

          <div className="featured-article">
            <div className="featured-image">
              <Link to="/news">
                <img
                  src={tennis}
                  alt="Olahraga yang baik untuk mencegah penyakit Cardiovascular"
                />
              </Link>
            </div>
            <div className="featured-info">
              <div className="article-meta">
                <span className="article-tag">CV</span>
                <span className="article-dot">•</span>
                <span className="article-time">15 minutes ago</span>
              </div>
              <h1 className="featured-title">
                <Link
                  to="/news"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Olahraga yang baik untuk mencegah penyakit "Cardiovascular"
                </Link>
              </h1>
              <div className="author-section">
                <div className="rectangle-divider"></div>
                <div className="article-author">
                  <span>By CardioMind</span>
                  <span className="article-date">12 Maret 2025</span>
                </div>
              </div>
            </div>
          </div>

          <div className="section-title">
            <h2>Topik Terkini</h2>
          </div>

          <div className="article-grid">
            {/* Combined Row */}
            <div className="article-row">
              <div className="article-card">
                <Link
                  to="/news"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="article-image">
                    <img
                      src={anjing}
                      alt="Article image"
                    />
                  </div>
                  <div className="article-info">
                    <div className="article-meta">
                      <span className="article-tag">CV</span>
                      <span className="article-dot">•</span>
                      <span className="article-time">3 minutes ago</span>
                    </div>
                    <h3 className="article-title">Makanan Sehat untuk Jantung</h3>
                  </div>
                </Link>
              </div>

              <div className="article-card">
                <Link
                  to="/news"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="article-image">
                    <img
                      src={anjing}
                      alt="Article image"
                    />
                  </div>
                  <div className="article-info">
                    <div className="article-meta">
                      <span className="article-tag">CV</span>
                      <span className="article-dot">•</span>
                      <span className="article-time">3 minutes ago</span>
                    </div>
                    <h3 className="article-title">Bahaya Rokok bagi Jantung</h3>
                  </div>
                </Link>
              </div>

              <div className="article-card">
                <Link
                  to="/news"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="article-image">
                    <img
                      src={anjing}
                      alt="Article image"
                    />
                  </div>
                  <div className="article-info">
                    <div className="article-meta">
                      <span className="article-tag">CV</span>
                      <span className="article-dot">•</span>
                      <span className="article-time">3 minutes ago</span>
                    </div>
                    <h3 className="article-title">Manajemen Stres untuk Jantung Sehat</h3>
                  </div>
                </Link>
              </div>

              <div className="article-card">
                <Link
                  to="/news"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="article-image">
                    <img
                      src={anjing}
                      alt="Article image"
                    />
                  </div>
                  <div className="article-info">
                    <div className="article-meta">
                      <span className="article-tag">CV</span>
                      <span className="article-dot">•</span>
                      <span className="article-time">3 minutes ago</span>
                    </div>
                    <h3 className="article-title">Pentingnya Cek Kesehatan Jantung Rutin</h3>
                  </div>
                </Link>
              </div>

              <div className="article-card">
                <Link
                  to="/news"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="article-image">
                    <img
                      src={anjing}
                      alt="Article image"
                    />
                  </div>
                  <div className="article-info">
                    <div className="article-meta">
                      <span className="article-tag">CV</span>
                      <span className="article-dot">•</span>
                      <span className="article-time">3 minutes ago</span>
                    </div>
                    <h3 className="article-title">Menjaga Kesehatan Jantung di Usia Muda</h3>
                  </div>
                </Link>
              </div>

              <div className="article-card">
                <Link
                  to="/news"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="article-image">
                    <img
                      src={anjing}
                      alt="Article image"
                    />
                  </div>
                  <div className="article-info">
                    <div className="article-meta">
                      <span className="article-tag">CV</span>
                      <span className="article-dot">•</span>
                      <span className="article-time">3 minutes ago</span>
                    </div>
                    <h3 className="article-title">Kenali Gejala Serangan Jantung</h3>
                  </div>
                </Link>
              </div>

              <div className="article-card">
                <Link
                  to="/news"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="article-image">
                    <img
                      src={anjing}
                      alt="Article image"
                    />
                  </div>
                  <div className="article-info">
                    <div className="article-meta">
                      <span className="article-tag">CV</span>
                      <span className="article-dot">•</span>
                      <span className="article-time">3 minutes ago</span>
                    </div>
                    <h3 className="article-title">Teknologi Baru dalam Pengobatan Kardiovaskular</h3>
                  </div>
                </Link>
              </div>

              <div className="article-card">
                <Link
                  to="/news"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="article-image">
                    <img
                      src={anjing}
                      alt="Article image"
                    />
                  </div>
                  <div className="article-info">
                    <div className="article-meta">
                      <span className="article-tag">CV</span>
                      <span className="article-dot">•</span>
                      <span className="article-time">3 minutes ago</span>
                    </div>
                    <h3 className="article-title">Hubungan Diet dan Kesehatan Jantung</h3>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InfoKesehatan;
