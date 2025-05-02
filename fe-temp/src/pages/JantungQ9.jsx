import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import BotEllipse from "../assets/images/botEllipse.png";
import LeftArrow from "../assets/images/left.png";
import RightArrow from "../assets/images/right.png";
import "../css/style.css";
import "../css/suicide-predict.css";
import "../css/suicidequestion.css";

const JantungQ9 = () => {
  useEffect(() => {
    const options = document.querySelectorAll(".option");
    const nextBtn = document.querySelector(".next-btn");

    // Apply previously saved selection
    const savedAnswer = sessionStorage.getItem("q8_answer");
    if (savedAnswer) {
      options.forEach((option) => {
        if (option.getAttribute("data-value") === savedAnswer) {
          option.classList.add("selected");
        }
      });
    }

    // Handle option clicks
    const handleOptionClick = function () {
      options.forEach((opt) => opt.classList.remove("selected"));
      this.classList.add("selected");
      sessionStorage.setItem("q8_answer", this.getAttribute("data-value"));
    };

    options.forEach((option) =>
      option.addEventListener("click", handleOptionClick)
    );

    // Validate before proceeding
    const validateAndProceed = (e) => {
      if (!sessionStorage.getItem("q8_answer")) {
        e.preventDefault();
        alert("Silakan pilih salah satu jawaban sebelum melanjutkan.");
      }
    };

    nextBtn.addEventListener("click", validateAndProceed);

    // Cleanup on unmount
    return () => {
      options.forEach((option) =>
        option.removeEventListener("click", handleOptionClick)
      );
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
            <div className="progress-bar" style={{ width: "88%" }}></div>
          </div>
          <div className="progress-text">Pertanyaan ke 9/9</div>

          <div className="predict-content">
            <div className="question-container">
              <h2 className="question">
                Apakah Anda sering melakukan kegiatan kardio?
              </h2>

              <div className="answer-options">
                <div className="option" data-value="yes">
                  Iya
                </div>
                <div className="option" data-value="no">
                  Tidak
                </div>
              </div>
              
            </div>

            <div className="nav-buttons">
              <Link to="/JantungQ7" className="prev-btn">
                <img src={LeftArrow} alt="Previous" />
              </Link>
              <Link to="/HasilJantung" className="next-btn">
                <img src={RightArrow} alt="Next" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JantungQ9;
