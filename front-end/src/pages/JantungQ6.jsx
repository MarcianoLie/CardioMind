import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/style.css";
import "../css/suicide-predict.css";
import "../css/suicidequestion.css";
import BotEllipse from "../assets/images/botEllipse.png";
import LeftArrow from "../assets/images/left.png";
import RightArrow from "../assets/images/right.png";

const JantungQ6 = () => {
  useEffect(() => {
    // Simple script to handle form input
    const glucoseInput = document.getElementById("glucose");
    const nextBtn = document.querySelector(".next-btn");

    // Load previously saved value if it exists
    if (sessionStorage.getItem("glucose")) {
      glucoseInput.value = sessionStorage.getItem("glucose");
    }

    // Save input value when it changes
    const saveGlucose = () => {
      sessionStorage.setItem("glucose", glucoseInput.value);
    };
    glucoseInput.addEventListener("input", saveGlucose);

    // Add validation to next button
    const validateAndProceed = (e) => {
      const glucoseValue = parseInt(glucoseInput.value, 10);
      if (isNaN(glucoseValue) || glucoseValue <= 0) {
        e.preventDefault();
        alert("Silakan masukkan kadar gula darah yang valid (angka lebih dari 0).");
      }
    };
    nextBtn.addEventListener("click", validateAndProceed);

    // Cleanup listeners on unmount
    return () => {
      glucoseInput.removeEventListener("input", saveGlucose);
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
            <div className="progress-bar" style={{ width: "55%" }}></div>
          </div>
          <div className="progress-text">Pertanyaan ke 6/9</div>

          <div className="predict-content">
            <div className="question-container">
              <h2 className="question">Berapa kadar gula darah anda?</h2>

              <div className="answer-inputs">
                <input
                  type="number"
                  className="input-field"
                  id="glucose"
                  placeholder="Berapa kadar glukosa darah Anda saat ini (dalam mg/dL)?"
                />
              </div>
            </div>

            <div className="nav-buttons">
              <Link to="/JantungQ5" className="prev-btn">
                <img src={LeftArrow} alt="Previous" />
              </Link>
              <Link to="/JantungQ7" className="next-btn">
                <img src={RightArrow} alt="Next" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JantungQ6;
