import React, { useState, useEffect } from "react";
import { useParams,useNavigate  } from "react-router-dom";
import DOMPurify from 'dompurify';
import "../css/style.css";
import "../css/news.css";
import "../css/article-content.css";
import tennis from "../assets/images/Slide2.png";
import anjing from "../assets/images/Slide5.png";
import profile from "../assets/images/Profile.png";
import logo from "../assets/images/Logo.png";

const News = () => {
  const navigate = useNavigate();
  const [newsData, setNewsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { newsId } = useParams();

  // User profile state
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    profileImage: ''
  });

  // Comment state variables
  const [comments, setComments] = useState([]);
  const [replies, setReplies] = useState({});
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState({});
  const [showReplyInput, setShowReplyInput] = useState({});
  const [showReplies, setShowReplies] = useState({});

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

  // Fetch user profile data
  const fetchUserProfile = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/profile", {
        credentials: "include", // Include session cookies
      });
      const result = await response.json();

      if (response.ok) {
        setUserData({
          name: result.user.displayName || null,
          email: result.user.email || '',
          profileImage: (!result.user.profileImage)
                      ? profile
                      : (result.user.profileImage.startsWith('http')
                          ? result.user.profileImage
                          : "data:image/jpeg;base64," + result.user.profileImage)
        });
      } else {
        console.error("Failed to fetch user profile:", result.message);
        // Use localStorage as fallback
        const savedName = localStorage.getItem("profileName");
        setUserData({
          name: savedName || null,
          email: localStorage.getItem("profileEmail") || '',
          profileImage: localStorage.getItem("profileImage") || profile
        });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      // Use localStorage as fallback
      setUserData({
        name: localStorage.getItem("profileName") || null,
        email: localStorage.getItem("profileEmail") || '',
        profileImage: localStorage.getItem("profileImage") || profile
      });
    }
  };

  // Fetch comments from backend
  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/comments/${newsId}`);
      const result = await response.json();
      console.log("comment :",result)

      if (response.ok) {
        const newComments = result.data || [];
        // Cek apakah newComments berbeda dengan comments lama sebelum setState
        setComments(prevComments => {
          // Bisa pakai JSON.stringify sederhana, tapi untuk data besar atau nested, sebaiknya pakai deep equality check
          if (JSON.stringify(prevComments) !== JSON.stringify(newComments)) {
            return newComments;
          } else {
            return prevComments; // tidak diubah
          }
        });
      } else {
        console.error("Failed to fetch comments:", result.message);
        // Fallback to localStorage if API fails
        const savedComments = localStorage.getItem(`comments-${newsId}`);
        if (savedComments) {
          setComments(JSON.parse(savedComments));
        }
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      // Fallback to localStorage if API fails
      const savedComments = localStorage.getItem(`comments-${newsId}`);
      if (savedComments) {
        setComments(JSON.parse(savedComments));
      }
    }
  };
  const formatProfileImage = (base64Data) => {
      if (!base64Data || base64Data=='') return profile;
      
      // Jika sudah memiliki prefix data:image
      if (base64Data.startsWith('data:image')) {
        return base64Data;
      }
      
      // Jika sudah URL lengkap (http://)
      if (base64Data.startsWith('http')) {
        const encodedUrl = encodeURIComponent(base64Data);
        return `http://localhost:8080/api/img/${encodedUrl}`;
      }
      
      // Jika base64 tanpa prefix
      return `data:image/jpeg;base64,${base64Data}`;
    };
  // Fetch replies from backend
  const fetchReplies = async (commentId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/reply/${commentId}`);
      const result = await response.json();

      if (response.ok) {
        setReplies(prev => ({
          ...prev,
          [commentId]: result.data || [],
        }));
        console.log(`Replies for ${commentId}:`, result.data);
      } else {
        console.error("Failed to fetch replies:", result.message);
        // Fallback to localStorage if API fails
        const savedComments = localStorage.getItem(`replies-${newsId}`);
        if (savedComments) {
          setComments(JSON.parse(savedComments));
        }
      }
    } catch (error) {
      console.error("Error fetching reply:", error);
      // Fallback to localStorage if API fails
      const savedComments = localStorage.getItem(`reply-${newsId}`);
      if (savedComments) {
        setComments(JSON.parse(savedComments));
      }
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch berita
        const newsResponse = await fetch(`http://localhost:8080/api/news/${newsId}`);
        const newsResult = await newsResponse.json();
        if (newsResponse.ok) {
          setNewsData(newsResult.data);
        } else {
          setError(newsResult.message || "Failed to fetch news data");
        }

        // Fetch profil user
        fetchUserProfile();

        // Fetch komentar
        const commentResponse = await fetch(`http://localhost:8080/api/comments/${newsId}`);
        const commentResult = await commentResponse.json();
        if (commentResponse.ok) {
          setComments(commentResult.data || []);
          // console.log("komen ada")
          // console.log("komen ada")
        }
        
      } catch (error) {
        setError("Error while fetching data");
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    
    // console.log("fetch all data")
    fetchAllData();

    const interval = setInterval(() => {
      fetchComments();
    }, 10000); // 10 detik

    return () => clearInterval(interval);
  }, [newsId]);

  // Save comments to localStorage as backup
  useEffect(() => {
    if (comments.length > 0) {
      localStorage.setItem(`comments-${newsId}`, JSON.stringify(comments));
    }
  }, [comments, newsId]);
  useEffect(() => {
    console.log('Replies updated:', replies);
    console.log('apakah ada:', replies['682a6b6c55f0d79cff660c57']);
  }, [replies]);
  useEffect(() => {
    if (comments.length === 0) return;

    console.log("a");

    comments.forEach((comment) => {
      fetchReplies(comment._id); // <-- pastikan pakai _id kalau dari MongoDB
    });

    console.log("b");
  }, [comments]); // dijalankan setiap `comments` berubah


  // Toggle visibility of replies for a comment
  const toggleRepliesVisibility = (commentId) => {
    setShowReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  // Add a new comment
  const handleAddComment = async (e) => {
    e.preventDefault();

    if (commentText.trim() === "") {
      alert("Please enter your comment");
      return;
    }
    if (!userData?.name) {
      navigate('/login');
    }

    const commentData = {
      comment: commentText,
      newsId: newsId,
    };

    try {
      console.log(commentData.comment+" "+commentData.newsId)
      const response = await fetch("http://localhost:8080/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(commentData),
      });

      const result = await response.json();

      if (response.ok) {
        fetchComments(); // Refresh comments from server
        setCommentText("");
      } else {
        // alert("Failed to add comment: " + result.message);

        // Fallback: add comment locally if API fails
        const newComment = {
          id: Date.now().toString(),
          username: userData.name,
          text: commentText,
          timestamp: new Date().toISOString(),
          replies: []
        };

        setComments(prevComments => [newComment, ...prevComments]);
        setCommentText("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);

      // Fallback: add comment locally if API fails
      const newComment = {
        id: Date.now().toString(),
        username: userData.name,
        text: commentText,
        timestamp: new Date().toISOString(),
        replies: []
      };

      setComments(prevComments => [newComment, ...prevComments]);
      setCommentText("");
    }
  };

  // Add a reply to a comment
  const handleAddReply = async (commentId) => {
    if (!replyText[commentId] || replyText[commentId].trim() === "") {
      alert("Please enter your reply");
      return;
    }

    const replyData = {
      reply: replyText[commentId],
      commentId: commentId,
    };

    try {
      console.log("Data:"+replyData.reply+" dan "+replyData.commentId)
      const response = await fetch("http://localhost:8080/api/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(replyData),
      });

      const result = await response.json();

      if (response.ok) {
        fetchComments(); // Refresh comments from server
        fetchReplies(commentId);
        // setReplyText(prev => ({ ...prev, [commentId]: "" }));
        setShowReplyInput(prev => ({ ...prev, [commentId]: false }));
        // // Show replies after adding a new reply
        // setShowReplies(prev => ({ ...prev, [commentId]: true }));
      } else {
        alert("Failed to add reply: " + result.message);

        // Fallback: add reply locally if API fails
        const newReply = {
          id: Date.now().toString(),
          username: userData.name,
          text: replyText[commentId],
          timestamp: new Date().toISOString(),
        };

        const updatedComments = comments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: [...comment.replies, newReply]
            };
          }
          return comment;
        });

        setComments(updatedComments);
        setReplyText(prev => ({ ...prev, [commentId]: "" }));
        setShowReplyInput(prev => ({ ...prev, [commentId]: false }));
        // Show replies after adding a new reply
        setShowReplies(prev => ({ ...prev, [commentId]: true }));
      }
    } catch (error) {
      console.error("Error adding reply:", error);

      // Fallback: add reply locally if API fails
      const newReply = {
        id: Date.now().toString(),
        username: userData.name,
        text: replyText[commentId],
        timestamp: new Date().toISOString(),
      };

      const updatedComments = comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...comment.replies, newReply]
          };
        }
        return comment;
      });

      setComments(updatedComments);
      setReplyText(prev => ({ ...prev, [commentId]: "" }));
      setShowReplyInput(prev => ({ ...prev, [commentId]: false }));
      // Show replies after adding a new reply
      setShowReplies(prev => ({ ...prev, [commentId]: true }));
    }
  };

  // Toggle reply input field visibility
  const toggleReplyInput = (commentId) => {
    if (!userData?.name) {
      navigate('/login');
    }
    setShowReplyInput(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  // Handle reply text change
  const handleReplyTextChange = (commentId, text) => {
    setReplyText(prev => ({
      ...prev,
      [commentId]: text
    }));
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

  // Get top-level comments (comments without parents)
  const topLevelComments = comments.filter(comment => !comment.parentId);

  // Get replies for a specific comment
  const getRepliesForComment = (commentId) => {
    return comments.filter(comment => comment.parentId === commentId);
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

          {/* Comment Section */}
          <div className="comment-section">
            <h2>Comments</h2>

            {/* Comment Form */}
            <div className="comment-form">
              <div className="user-info">
                <div className="user-avatar">
                  <img src={(userData.name)?formatProfileImage(userData.profileImage) : profile} alt="Your profile" />
                </div>
                <div className="user-name">
                  {userData?.name ? (
                    <>Commenting as <strong>{userData.name}</strong></>
                  ) : (
                    <a href="/login">Login to Comment</a>
                  )}
                </div>

              </div>

              <div className="form-group">
                <textarea
                  id="comment"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write your comment here..."
                />
              </div>

              <button
                className="submit-button"
                onClick={handleAddComment}
              >
                Post Comment
              </button>
            </div>

            {/* Comments List */}
            <div className="comments-list">
              {comments.length > 0 ? (
                comments.map(comment => {
                  // const replies = getRepliesForComment(comment._id);
                  const replyCount = replies.length;

                  return (
                    <div className="comment-thread" key={comment._id}>
                      <div className="comment">
                        <div className="comment-avatar">
                          <img src={formatProfileImage(comment.profileImage)||profile} alt={comment.username} />
                        </div>
                        <div className="comment-content">
                          <div className="comment-header">
                            <h3 className="comment-username">{comment.username}</h3>
                            <span className="comment-date">{formatDate(comment.timestamp || comment.createdAt)}</span>
                          </div>
                          <div className="comment-text">
                            {comment.text || comment.comment}
                          </div>
                          <div className="comment-actions">
                            <button
                              className="reply-button"
                              onClick={() => toggleReplyInput(comment._id)}
                            >
                              Reply
                            </button>

                            {/* Reply count and toggle button */}
                            {replies[comment._id] && replies[comment._id].length > 0 && (
                              <button
                                className="toggle-replies-button"
                                onClick={() => toggleRepliesVisibility(comment._id)}
                              >
                                <span className="reply-toggle-icon">
                                  {showReplies[comment._id] ? '▼' : '►'}
                                </span>
                                {replies[comment._id].length} {replies[comment._id].length === 1 ? 'reply' : 'replies'}
                              </button>
                            )}

                          </div>

                          {/* Reply input area */}
                          {showReplyInput[comment._id] && (
                            <div className="reply-form">
                              <div className="user-info small">
                                <div className="user-avatar small">
                                  <img src={(userData.name)?formatProfileImage(userData.profileImage) : profile} alt="Your profile" />
                                </div>
                                <div className="user-name">
                                  Replying as <strong>{userData.name}</strong>
                                </div>
                              </div>
                              <textarea
                                placeholder="Write your reply..."
                                value={replyText[comment._id] || ''}
                                onChange={(e) => handleReplyTextChange(comment._id, e.target.value)}
                              />
                              <button
                                className="submit-reply-button"
                                onClick={() => handleAddReply(comment._id)}
                              >
                                Post Reply
                              </button>
                            </div>
                          )}
                          {/* Replies list with toggle visibility */}
                          {console.log('Replies:', replies[comment._id], ' with:', comment._id)}
                          {console.log('Replies:', replies)}
                          {replies[comment._id] && showReplies[comment._id] && (
                            <div className="replies-list">
                              {replies[comment._id].map(reply => (
                                <div className="reply" key={reply._id}>
                                  <div className="comment-avatar">
                                    <img src={formatProfileImage(reply.profileImage)||profile} alt={reply.username} />
                                  </div>
                                  <div className="comment-content">
                                    <div className="comment-header">
                                      <h3 className="comment-username">{reply.username}</h3>
                                      <span className="comment-date">{formatDate(reply.timestamp || reply.createdAt)}</span>
                                    </div>
                                    <div className="comment-text">
                                      {reply.reply || reply.comment}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="no-comments">No comments yet. Be the first to comment!</p>
              )}
            </div>
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
    </div>
  );
};

export default News;