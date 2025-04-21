import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/style.css";
import "../css/suicide-predict.css";
import "../css/suicidequestion.css";
import BotEllipse from "../assets/images/botEllipse.png";
import LeftArrow from "../assets/images/left.png";
import RightArrow from "../assets/images/right.png";

const JantungQ7 = () => {
  useEffect(() => {
    // Simple script to handle form input
    const cholesterolInput = document.getElementById("cholesterol");
    const nextBtn = document.querySelector(".next-btn");

    // Load previously saved value if it exists
    if (sessionStorage.getItem("cholesterol")) {
      cholesterolInput.value = sessionStorage.getItem("cholesterol");
    }

    // Save input value when it changes
    const saveCholesterol = () => {
      sessionStorage.setItem("cholesterol", cholesterolInput.value);
    };
    cholesterolInput.addEventListener("input", saveCholesterol);

    // Add validation to next button
    const validateAndProceed = (e) => {
      const cholesterolValue = parseInt(cholesterolInput.value, 10);

      if (isNaN(cholesterolValue) || cholesterolValue <= 0) {
        e.preventDefault();
        alert("Silakan masukkan kadar kolesterol yang valid (angka lebih dari 0).");
      }
    };
    nextBtn.addEventListener("click", validateAndProceed);

    // Cleanup listeners on unmount
    return () => {
      cholesterolInput.removeEventListener("input", saveCholesterol);
      nextBtn.removeEventListener("click", validateAndProceed);
    };
  }, []);

  return (
    <div className="container">
      <div className="background">
        <img src={BotEllipse} alt="" className="bottom-ellipse" />
      </div>

      <main>
        <div className="suicide-predict-container">
          <div className="progress-container">
            <div className="progress-bar" style={{ width: "66%" }}></div>
          </div>
          <div className="progress-text">Pertanyaan ke 7/9</div>

          <div className="predict-content">
            <div className="question-container">
              <h2 className="question">Berapa kadar kolesterol total Anda saat ini (dalam mg/dL)?</h2>

              <div className="answer-inputs">
                <input
                  type="number"
                  className="input-field"
                  id="cholesterol"
                  placeholder="Enter your cholesterol level"
                />
              </div>
            </div>

            <div className="nav-buttons">
              <Link to="/JantungQ6" className="prev-btn">
                <img src={LeftArrow} alt="Previous" />
              </Link>
              <Link to="/JantungQ8" className="next-btn">
                <img src={RightArrow} alt="Next" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JantungQ7;
