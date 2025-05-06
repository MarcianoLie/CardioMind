import React, { useState, useEffect } from "react";
import "../css/style.css"
import "../css/news.css"
import tennis from "../assets/images/Slide2.png"
import anjing from "../assets/images/Slide5.png"
import profile from "../assets/images/Profile.png"
import logo from "../assets/images/Logo.png"
import { useParams } from "react-router-dom";

const News = () => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const { newsId } = useParams();

  const handleAddComment = async () => {
    if (commentText.trim()) {
      const payload = {
        comment: commentText,
        newsId: newsId, // pastikan ini sesuai dengan yang dibaca backend
        parentId: replyingTo // null jika komentar baru, id komentar jika balasan
      };

      console.log("Sending comment payload:", payload);

      try {
        const response = await fetch("http://localhost:8080/api/comments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // agar session (userId) dikirim
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        console.log("Server response:", result);

        if (response.ok) {
          // Refresh comments after posting
          fetchComments();
          setCommentText("");
          setReplyingTo(null);
          handleCloseCommentBox();
        } else {
          alert("Gagal menambahkan komentar: " + result.message);
        }
      } catch (error) {
        console.error("Error saat fetch komentar:", error);
      }
    }
  };

  const fetchComments = async () => {
    const newsId = "001"
    try {
      console.log(newsId)
      const response = await fetch(`http://localhost:8080/api/comments/${newsId}`);
      const result = await response.json();
      console.log(result)

      if (response.ok) {
        setComments(result.data); // Asumsi hasilnya dalam bentuk { comments: [...] }
      } else {
        console.error("Gagal mengambil komentar:", result.message);
      }
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil komentar:", error);
    }
  };

  useEffect(() => {
    fetchComments();
    // Set interval setiap 1 detik
    const interval = setInterval(fetchComments, 1000);

    // Bersihkan interval saat komponen unmount
    return () => clearInterval(interval);
  }, []); // Efek hanya dijalankan saat newsId berubah

  const handleReply = (commentId, username) => {
    setReplyingTo(commentId);
    setCommentText(`@${username} `);
    handleOpenCommentBox();
  };

  const handleCloseCommentBox = () => {
    const commentBoxOverlay = document.getElementById("comment-box-overlay");
    commentBoxOverlay.style.display = "none";
    document.body.style.overflow = "auto"; // Restore scrolling
  };

  const handleOpenCommentBox = () => {
    const commentBoxOverlay = document.getElementById("comment-box-overlay");
    commentBoxOverlay.style.display = "flex";
    document.body.style.overflow = "hidden"; // Prevent scrolling behind overlay
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
                src={tennis}
                alt="Olahraga yang baik untuk mencegah penyakit Cardiovascular"
              />
            </div>
            <div className="featured-info">
              <div className="article-meta">
                <span className="article-tag">CV</span>
                <span className="article-dot">•</span>
                <span className="article-time">15 minutes ago</span>
              </div>
              <h1 className="featured-title">
                Olahraga yang baik untuk mencegah penyakit "Cardiovascular"
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

          <div className="article-content">
            <p>
              Penyakit kardiovaskular (CVD) merupakan penyebab utama kematian di
              seluruh dunia. Gaya hidup sehat, termasuk aktivitas fisik yang
              teratur, telah terbukti efektif dalam mencegah dan mengelola berbagai
              penyakit kardiovaskular. Berikut adalah beberapa jenis olahraga yang
              bermanfaat untuk kesehatan jantung:
            </p>

            <p>
              Berjalan adalah bentuk olahraga aerobik yang sederhana namun efektif
              untuk meningkatkan kesehatan kardiovaskular. Penelitian menunjukkan
              bahwa berjalan cepat selama 30 menit per hari dapat menurunkan risiko
              penyakit jantung hingga 19%. Keuntungan berjalan adalah mudah dilakukan,
              tidak memerlukan peralatan khusus, dan dapat dilakukan oleh hampir semua
              orang.
            </p>

            <p>
              Bersepeda, baik di luar ruangan maupun menggunakan sepeda statis,
              merupakan latihan kardiovaskular yang sangat baik. Aktivitas ini
              meningkatkan denyut jantung tanpa memberikan tekanan berlebih pada
              sendi, menjadikannya pilihan ideal bagi mereka yang memiliki masalah
              persendian. Bersepeda secara teratur dapat meningkatkan kebugaran
              kardiorespirasi dan membantu menurunkan tekanan darah.
            </p>

            <p>
              Berenang adalah bentuk latihan kardiovaskular yang melibatkan hampir
              semua otot utama tubuh. Karena dilakukan di air, berenang memberikan
              resistensi alami sambil meminimalkan tekanan pada sendi. Latihan ini
              sangat bermanfaat bagi penderita arthritis atau mereka yang memiliki
              keterbatasan gerak. Berenang secara teratur dapat meningkatkan kadar
              kolesterol HDL ("kolesterol baik") dan mengurangi peradangan, dua faktor
              yang berkontribusi pada kesehatan jantung.
            </p>

            <p>
              Yoga, meskipun sering dianggap sebagai aktivitas intensitas rendah, memiliki
              manfaat kardiovaskular yang signifikan. Praktik yoga telah dikaitkan dengan
              penurunan tekanan darah, peningkatan sensitivitas insulin, dan pengurangan
              stres. Perlu diingat bahwa stres kronis adalah faktor risiko utama untuk
              penyakit kardiovaskular.
            </p>
          </div>

          <hr />

          <div className="comment-section">
            <div className="comment-title">
              <h2>Komentar</h2>
              <div className="add-comment-btn" id="add-comment-btn" onClick={handleOpenCommentBox}>
                <div className="plus-icon"></div>
              </div>
            </div>

            {comments.map((comment, index) => (
              <div className="user-comment" key={index}>
                <div className="user-comment-logo">
                  <img src={profile} alt="User profile" />
                </div>
                <div className="user-comment-body">
                  <div className="user-comment-header">
                    <strong className="username">{comment.username}</strong>
                    <div className="timestamp-container">
                      <span className="comment-time">{comment.createdAt}</span>
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

          <hr />

          <div className="related-topics">
            <h2>Topik Terkait</h2>
            <div className="article-row">
              <div className="article-card">
                <a href="/news" style={{ textDecoration: "none", color: "inherit" }}>
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
              {/* Add more related topics here if needed */}
            </div>
          </div>
        </div>
      </main>

      <div className="comment-box-overlay" id="comment-box-overlay" style={{ display: "none" }}>
        <div className="comment-box">
          <div className="comment-back-button" id="close-comment-box" onClick={handleCloseCommentBox}>
            <svg width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
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
              <button onClick={() => { setReplyingTo(null); setCommentText("") }} className="cancel-reply">
                Cancel
              </button>
            </div>
          )}
          <textarea
            className="comment-textarea"
            placeholder={replyingTo ? "Write your reply here..." : "Tulis komentar Anda di sini..."}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          ></textarea>
          <button className="comment-submit-btn" onClick={handleAddComment}>
            {replyingTo ? "REPLY" : "SEND"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default News;
