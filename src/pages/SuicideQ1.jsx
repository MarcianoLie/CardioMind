import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BotEllipse from "../assets/images/botEllipse.png";
import LeftArrow from "../assets/images/left.png"
import "../css/style.css";
import "../css/suicide-predict.css";
import "../css/suicidequestion.css"

const SuicideQ1 = () => {
  const navigate = useNavigate();
  const [suicideMessage, setSuicideMessage] = useState("");

  useEffect(() => {
    // Mengecek apakah survey sudah dimulai
    if (!sessionStorage.getItem("surveyStarted")) {
      // Jika belum dimulai, arahkan ke halaman "PrediksiJantung"
      navigate("/PrediksiJantung");
    }

    // Load previously saved value if it exists
    if (sessionStorage.getItem("suicideMessage")) {
      setSuicideMessage(sessionStorage.getItem("suicideMessage"));
    }
  }, [navigate]);

  const handleSuicideMessage = (e) => {
    setSuicideMessage(e.target.value);
    sessionStorage.setItem("suicideMessage", e.target.value);
  };

  const handleCalculateClick = (e) => {
    if (!suicideMessage.trim()) {
      e.preventDefault();
      alert("Please enter a message before continuing.");
      return;
    }
    // Navigate to the results page after the input is valid
    navigate("/HasilBunuhDiri");
  };

  return (
    <div className="container">
      <div className="background">
        <img src={BotEllipse} alt="Background" className="bottom-ellipse" />
      </div>

      <main>
        <div className="suicide-predict-container">
          <div className="progress-container">
            <div className="progress-bar" style={{ width: "10%" }}></div>
          </div>
          <div className="progress-text">Make sure the text is in English!</div>

          <div className="predict-content">
            <div className="question-container">
              <h2 className="question">Please input your message below:</h2>

              <div className="input-container">
                <input
                  type="text"
                  className="blood-pressure-input"
                  id="suicideMessage"
                  value={suicideMessage}
                  onChange={handleSuicideMessage}
                  placeholder="Enter your message"
                />
              </div>
            </div>

            <button
              className="calculate-btn"
              id="calculate"
              onClick={handleCalculateClick}
            >
              Calculate
            </button>

            <div className="nav-buttons">
              <a href="/PrediksiJantung" className="prev-btn">
                <img src={LeftArrow} alt="Previous" />
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SuicideQ1;

