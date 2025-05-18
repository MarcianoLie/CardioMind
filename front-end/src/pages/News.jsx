import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DOMPurify from 'dompurify';
import "../css/style.css";
import "../css/news.css";
import "../css/article-content.css";
import tennis from "../assets/images/Slide2.png";
import anjing from "../assets/images/Slide5.png";
import profile from "../assets/images/Profile.png";
import logo from "../assets/images/Logo.png";

const News = () => {
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [comments, setComments] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [newsData, setNewsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { newsId } = useParams();

  // Format date safely
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      return "Invalid date";
    }
  };

  // Process HTML content with security and additional styling
  const processHtmlContent = (html) => {
    if (!html) return "";
    
    // Add classes to specific elements for better styling
    let processed = html
      .replace(/<img/g, '<img class="article-image"')
      .replace(/<table/g, '<table class="article-table"')
      .replace(/<a/g, '<a target="_blank" rel="noopener noreferrer"');
    
    // Sanitize HTML to prevent XSS attacks
    return DOMPurify.sanitize(processed, {
      ADD_ATTR: ['target'], // Allow target attribute for links
      ADD_TAGS: ['iframe'], // Allow iframes if needed
    });
  };

  const handleAddComment = async () => {
    if (commentText.trim()) {
      const payload = {
        comment: commentText,
        newsId: newsId,
        parentId: replyingTo
      };

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

        if (response.ok) {
          fetchComments();
          setCommentText("");
          setReplyingTo(null);
          handleCloseCommentBox();
        } else {
          alert("Failed to add comment: " + result.message);
        }
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };
  const handleAddReply = async () => {
    if (replyText.trim()) {
      const payload = {
        reply: replyText,
        commentId: replyingTo,
      };

      try {
        const response = await fetch("http://localhost:8080/api/reply", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (response.ok) {
          fetchComments();
          setReplyText("");
          setReplyingTo(null);
          handleCloseCommentBox();
        } else {
          alert("Failed to add reply: " + result.message);
        }
      } catch (error) {
        console.error("Error adding reply:", error);
      }
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/comments/${newsId}`);
      const result = await response.json();

      if (response.ok) {
        setComments(result.data || []);
      } else {
        console.error("Failed to fetch comments:", result.message);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/news/${newsId}`);
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

    fetchNewsData();
    fetchComments();
    
    const interval = setInterval(fetchComments, 1000);
    return () => clearInterval(interval);
  }, [newsId]);

  const handleReply = (commentId, username) => {
    setReplyingTo(commentId);
    setCommentText(`@${username} `);
    handleOpenCommentBox();
  };

  const handleCloseCommentBox = () => {
    const commentBoxOverlay = document.getElementById("comment-box-overlay");
    if (commentBoxOverlay) {
      commentBoxOverlay.style.display = "none";
      document.body.style.overflow = "auto";
    }
  };

  const handleOpenCommentBox = () => {
    const commentBoxOverlay = document.getElementById("comment-box-overlay");
    if (commentBoxOverlay) {
      commentBoxOverlay.style.display = "flex";
      document.body.style.overflow = "hidden";
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading article...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Article</h2>
        <p>{error}</p>
        <button 
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!newsData) {
    return (
      <div className="no-data-container">
        <h2>Article Not Found</h2>
        <p>The requested article could not be loaded.</p>
        <a href="/infokesehatan" className="back-link">
          Back to Health Info
        </a>
      </div>
    );
  }

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
                src={newsData?.imageUrl || tennis}
                alt={newsData?.title || "News article"}
                onError={(e) => {
                  e.target.src = tennis;
                }}
              />
            </div>
            <div className="featured-info">
              <div className="article-meta">
                <span className="article-tag">CV</span>
                <span className="article-dot">•</span>
                <span className="article-time">
                  {formatDate(newsData?.pubDate)}
                </span>
              </div>
              <h1 className="featured-title">
                {newsData?.title || "Untitled Article"}
              </h1>
              <div className="author-section">
                <div className="rectangle-divider"></div>
                <div className="article-author">
                  <span>By {newsData?.author || "CardioMind"}</span>
                  <span className="article-date">
                    {formatDate(newsData?.pubDate)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Article content with HTML rendering */}
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ 
              __html: processHtmlContent(newsData?.description) 
            }}
          />

          <hr className="content-divider" />

          <div className="comment-section">
            <div className="comment-title">
              <h2>Comments</h2>
              <div
                className="add-comment-btn"
                id="add-comment-btn"
                onClick={handleOpenCommentBox}
              >
                <div className="plus-icon"></div>
              </div>
            </div>

            {comments.map((comment) => (
              <div className="user-comment" key={comment.id}>
                <div className="user-comment-logo">
                  <img src={profile} alt="User profile" />
                </div>
                <div className="user-comment-body">
                  <div className="user-comment-header">
                    <strong className="username">
                      {comment.username || "Anonymous"}
                    </strong>
                    <div className="timestamp-container">
                      <span className="comment-time">
                        {formatDate(comment.createdAt)}
                      </span>
                      <button
                        className="reply-button"
                        onClick={() => handleReply(comment.id, comment.username)}
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                  <div className="user-comment-text">
                    <p>{comment.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <hr className="content-divider" />

          <div className="related-topics">
            <h2>Related Topics</h2>
            <div className="article-row">
              <div className="article-card">
                <a
                  href="/news"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="article-image">
                    <img src={anjing} alt="Related article" />
                  </div>
                  <div className="article-info">
                    <div className="article-meta">
                      <span className="article-tag">CV</span>
                      <span className="article-dot">•</span>
                      <span className="article-time">3 minutes ago</span>
                    </div>
                    <h3 className="article-title">Healthy Food for Heart</h3>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Comment box overlay */}
      <div 
        className="comment-box-overlay" 
        id="comment-box-overlay" 
        style={{ display: "none" }}
      >
        <div className="comment-box">
          <div 
            className="comment-back-button" 
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
          {replyingTo && (
            <div className="replying-to-info">
              Replying to comment
              <button 
                onClick={() => { 
                  setReplyingTo(null); 
                  setReplyText(""); 
                  handleAddReply
                }} 
                className="cancel-reply"
              >
                Cancel
              </button>
            </div>
          )}
          <textarea
            className="comment-textarea"
            placeholder={
              replyingTo 
                ? "Write your reply here..." 
                : "Write your comment here..."
            }
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          ></textarea>
          <button 
            className="comment-submit-btn" 
            onClick={handleAddComment}
          >
            {replyingTo ? "REPLY" : "SEND"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default News;