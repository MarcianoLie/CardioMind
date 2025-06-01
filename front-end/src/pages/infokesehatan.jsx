import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/style.css";
import "../css/news.css";
import tennis from "../assets/images/Slide2.png";
import anjing from "../assets/images/Slide5.png";

const InfoKesehatan = () => {
  const [articles, setArticles] = useState([]);
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/news`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch articles");
        }

        if (result.data && result.data.length > 0) {
          setArticles(result.data);
          // Set artikel pertama sebagai featured article
          setFeaturedArticle(result.data[0]);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const articleDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - articleDate) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} detik yang lalu`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
    return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`;
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-spinner"></div>
        <p>Memuat artikel...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message">
          <p>Gagal memuat artikel: {error}</p>
          <button onClick={() => window.location.reload()}>Coba Lagi</button>
        </div>
      </div>
    );
  }

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

          {featuredArticle && (
            <div className="featured-article">
              <div className="featured-image">
                <Link to={`/news/${featuredArticle._id}`}>
                  <img
                    src={featuredArticle.imageUrl || tennis}
                    alt={featuredArticle.title}
                    onError={(e) => {
                      e.target.src = tennis;
                    }}
                  />
                </Link>
              </div>
              <div className="featured-info">
                <div className="article-meta">
                  <span className="article-tag">CV</span>
                  <span className="article-dot">•</span>
                  <span className="article-time">
                    {getTimeAgo(featuredArticle.pubDate)}
                  </span>
                </div>
                <h1 className="featured-title">
                  <Link
                    to={`/news/${featuredArticle._id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    {featuredArticle.title}
                  </Link>
                </h1>
                <div className="author-section">
                  <div className="rectangle-divider"></div>
                  <div className="article-author">
                    <span>By CardioMind</span>
                    <span className="article-date">
                      {formatDate(featuredArticle.pubDate)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="section-title">
            <h2>Topik Terkini</h2>
          </div>

          <div className="article-grid">
            <div className="article-row">
              {articles.map((article, index) => (
                <div className="article-card" key={article._id}>
                  <Link
                    to={`/news/${article._id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div className="article-image">
                      <img
                        src={article.imageUrl || anjing}
                        alt={article.title}
                        onError={(e) => {
                          e.target.src = anjing;
                        }}
                      />
                    </div>
                    <div className="article-info">
                      <div className="article-meta">
                        <span className="article-tag">CV</span>
                        <span className="article-dot">•</span>
                        <span className="article-time">
                          {getTimeAgo(article.pubDate)}
                        </span>
                      </div>
                      <h3 className="article-title">{article.title}</h3>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InfoKesehatan;