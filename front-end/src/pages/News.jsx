import React, { useState, useEffect } from "react";
import "../css/style.css";
import "../css/news.css";
import tennis from "../assets/images/Slide2.png";
import anjing from "../assets/images/Slide5.png";
import profile from "../assets/images/Profile.png";
import logo from "../assets/images/Logo.png";
import { useParams } from "react-router-dom";

const News = () => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [newsData, setNewsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { newsId } = useParams();

  useEffect(() => {

    const fetchNewsData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/news/${newsId}`
        );
        const result = await response.json();

        if (response.ok) {
          setNewsData(result.data);
        } else {
          setError(result.message || "Failed to fetch news data");
        }
      } catch (error) {
        setError("An error occurred while fetching news data");
        console.error("Error fetching news data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/comments/${newsId}`);
        const result = await response.json();

        if (response.ok) {
          setComments(result.data);
        } else {
          console.error("Failed to fetch comments:", result.message);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchNewsData();
    fetchComments();
    
    // Set interval for comments refresh
    const interval = setInterval(fetchComments, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAddComment = async () => {
    if (commentText.trim()) {
      const payload = {
        comment: commentText,
        newsId: newsId, // Using hardcoded newsId as in your original code
      };

      console.log("Sending comment payload:", payload);

      try {
        const response = await fetch("http://localhost:8080/api/comments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        console.log("Server response:", result);

        if (response.ok) {
          setCommentText("");
          handleCloseCommentBox();
        } else {
          alert("Gagal menambahkan komentar: " + result.message);
        }
      } catch (error) {
        console.error("Error saat fetch komentar:", error);
      }
    }
  };

  const handleCloseCommentBox = () => {
    const commentBoxOverlay = document.getElementById("comment-box-overlay");
    commentBoxOverlay.style.display = "none";
    document.body.style.overflow = "auto";
  };

  const handleOpenCommentBox = () => {
    const commentBoxOverlay = document.getElementById("comment-box-overlay");
    commentBoxOverlay.style.display = "flex";
    document.body.style.overflow = "hidden";
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (error) {
    return <div className="container">Error: {error}</div>;
  }

  if (!newsData) {
    return <div className="container">No news data found</div>;
  }

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  return (
    <div className="container">
      <main>
        <div className="news-content">
          <div className="back-button">
            <a href="/infokesehatan">
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
            </a>
          </div>

          <div className="featured-article">
            <div className="featured-image">
              <img
                src={newsData.imageUrl || tennis}
                alt={newsData.title}
                onError={(e) => {
                  e.target.src = tennis; // Fallback image if the URL is broken
                }}
              />
            </div>
            <div className="featured-info">
              <div className="article-meta">
                <span className="article-tag">CV</span>
                <span className="article-dot">•</span>
                <span className="article-time">
                  {formatDate(newsData.pubDate)}
                </span>
              </div>
              <h1 className="featured-title">{newsData.title}</h1>
              <div className="author-section">
                <div className="rectangle-divider"></div>
                <div className="article-author">
                  <span>By CardioMind</span>
                  <span className="article-date">
                    {formatDate(newsData.pubDate)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: newsData.description }}
          />

          <hr />

          <div className="comment-section">
            <div className="comment-title">
              <h2>Komentar</h2>
              <div
                className="add-comment-btn"
                id="add-comment-btn"
                onClick={handleOpenCommentBox}
              >
                <div className="plus-icon"></div>
              </div>
            </div>

            {comments.map((comment, index) => (
              <div className="user-comment" key={index}>
                <div className="user-comment-logo">
                  <img src={profile} alt="User profile" />
                </div>
                <div className="user-comment-content">
                  <p>{comment.username}</p>
                </div>
                <div className="user-comment-content">
                  <p>{comment.comment}</p>
                </div>
                <div className="user-comment-content">
                  <p>
                    {new Date(comment.createdAt).toLocaleString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <hr />

          <div className="related-topics">
            <h2>Topik Terkait</h2>
            <div className="article-row">
              <div className="article-card">
                <a
                  href="/news"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="article-image">
                    <img src={anjing} alt="Article image" />
                  </div>
                  <div className="article-info">
                    <div className="article-meta">
                      <span className="article-tag">CV</span>
                      <span className="article-dot">•</span>
                      <span className="article-time">3 minutes ago</span>
                    </div>
                    <h3 className="article-title">Makanan Sehat untuk Jantung</h3>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div
        className="comment-box-overlay"
        id="comment-box-overlay"
        style={{ display: "none" }}
      >
        <div className="comment-box">
          <div
            className="comment-back-button"
            id="close-comment-box"
            onClick={handleCloseCommentBox}
          >
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
          </div>
          <div className="comment-box-logo">
            <img src={logo} alt="CardioMind Logo" />
          </div>
          <textarea
            className="comment-textarea"
            placeholder="Tulis komentar Anda di sini..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          ></textarea>
          <button className="comment-submit-btn" onClick={handleAddComment}>
            SEND
          </button>
        </div>
      </div>
    </div>
  );
};

export default News;