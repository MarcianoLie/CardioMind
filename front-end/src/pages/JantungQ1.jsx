import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import BotEllipse from "../assets/images/botEllipse.png";
import LeftArrow from "../assets/images/left.png";
import RightArrow from "../assets/images/right.png";
import "../css/style.css";
import "../css/suicide-predict.css";
import "../css/suicidequestion.css";

const JantungQ1 = () => {
  useEffect(() => {
    // Simple script to handle option selection
    const options = document.querySelectorAll(".option");
    const nextBtn = document.querySelector(".next-btn");

    // Check if there's a saved answer and apply selected class
    const savedAnswer = sessionStorage.getItem("gender");
    if (savedAnswer) {
      options.forEach((option) => {
        if (option.getAttribute("data-value") === savedAnswer) {
          option.classList.add("selected");
        }
      });
    }

    options.forEach((option) => {
      option.addEventListener("click", function () {
        // Remove selected class from all options
        options.forEach((opt) => opt.classList.remove("selected"));

        // Add selected class to clicked option
        this.classList.add("selected");

        // Store the selection in sessionStorage
        sessionStorage.setItem("gender", this.getAttribute("data-value"));
      });
    });

    // Add validation to next button
    nextBtn.addEventListener("click", function (e) {
      if (!sessionStorage.getItem("gender")) {
        e.preventDefault();
        alert("Silakan pilih salah satu jawaban sebelum melanjutkan.");
      }
    });
  }, []);

  return (
    <div className="container">
      <div className="background">
        <img src={BotEllipse} alt="" className="bottom-ellipse" />
      </div>

      <main>
        <div className="suicide-predict-container">
          <div className="progress-container">
            <div className="progress-bar" style={{ width: "0%" }}></div>
          </div>
          <div className="progress-text">Pertanyaan ke 1/9</div>

          <div className="predict-content">
            <div className="question-container">
              <h2 className="question">Jenis kelamin anda?</h2>

              <div className="answer-options">
                <div className="option" data-value="male">
                  Laki laki
                </div>
                <div className="option" data-value="female">
                  Perempuan
                </div>
              </div>
            </div>

            <div className="nav-buttons">
              <Link to="/PrediksiJantung" className="prev-btn">
                <img src={LeftArrow} alt="Previous" />
              </Link>
              <Link to="/JantungQ2" className="next-btn">
                <img src={RightArrow} alt="Next" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JantungQ1;
