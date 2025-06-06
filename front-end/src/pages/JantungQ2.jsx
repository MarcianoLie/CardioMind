import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import BotEllipse from "../assets/images/botEllipse.png";
import LeftArrow from "../assets/images/left.png";
import RightArrow from "../assets/images/right.png";
import "../css/style.css";
import "../css/suicide-predict.css";
import "../css/suicidequestion.css";

const JantungQ2 = () => {
  const [weight, setWeight] = useState(sessionStorage.getItem("weight") || "");
  const [height, setHeight] = useState(sessionStorage.getItem("height") || "");
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.setItem("weight", weight);
    sessionStorage.setItem("height", height);

    // Validation for weight and height
    const validateAndProceed = (e) => {
      const weightVal = parseInt(weight, 10);
      const heightVal = parseInt(height, 10);

      if (
        isNaN(weightVal) || weightVal < 1 || weightVal > 600 || 
        isNaN(heightVal) || heightVal <= 50
      ) {
        e.preventDefault();
        alert("Silakan isi berat (1-600 kg) dan tinggi (lebih dari 50 cm) anda dengan benar.");
      }
    };

    const nextBtn = document.querySelector(".next-btn");
    if (nextBtn) {
      nextBtn.addEventListener("click", validateAndProceed);
    }

    // Cleanup listeners on unmount
    return () => {
      if (nextBtn) {
        nextBtn.removeEventListener("click", validateAndProceed);
      }
    };
  }, [weight, height]);

  return (
    <div className="container">
      <div className="background">
        <img src={BotEllipse} alt="" className="bottom-ellipse" />
      </div>

      <main>
        <div className="suicide-predict-container">
          <div className="progress-container">
            <div className="progress-bar" style={{ width: "11%" }}></div>
          </div>
          <div className="progress-text">Pertanyaan ke 2/9</div>

          <div className="predict-content">
            <div className="question-container">
              <h2 className="question">Berapa berat dan tinggi anda?</h2>

              <div className="answer-inputs">
                <input
                  type="number"
                  className="input-field"
                  id="weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Enter your weight"
                />
                <input
                  type="number"
                  className="input-field"
                  id="height"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="Enter your height"
                />
              </div>
            </div>

            <div className="nav-buttons">
              <Link to="/JantungQ1" className="prev-btn">
                <img src={LeftArrow} alt="Previous" />
              </Link>
              <Link to="/JantungQ3" className="next-btn">
                <img src={RightArrow} alt="Next" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JantungQ2;
