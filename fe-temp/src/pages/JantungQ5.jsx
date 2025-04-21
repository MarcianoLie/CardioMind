import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BotEllipse from "../assets/images/botEllipse.png";
import LeftArrow from "../assets/images/left.png";
import RightArrow from "../assets/images/right.png";
import "../css/style.css";
import "../css/suicide-predict.css";
import "../css/suicidequestion.css";

const JantungQ5 = () => {
  useEffect(() => {
    const systolicInput = document.getElementById("systolic");
    const diastolicInput = document.getElementById("diastolic");
    const nextBtn = document.querySelector(".next-btn");

    // Load previously saved values if they exist
    if (sessionStorage.getItem("q5_systolic")) {
      systolicInput.value = sessionStorage.getItem("q5_systolic");
    }
    if (sessionStorage.getItem("q5_diastolic")) {
      diastolicInput.value = sessionStorage.getItem("q5_diastolic");
    }

    // Save input values when they change
    const saveSystolic = () => {
      sessionStorage.setItem("q5_systolic", systolicInput.value);
    };
    const saveDiastolic = () => {
      sessionStorage.setItem("q5_diastolic", diastolicInput.value);
    };
    systolicInput.addEventListener("input", saveSystolic);
    diastolicInput.addEventListener("input", saveDiastolic);

    // Add validation to next button
    const validateAndProceed = (e) => {
      const systolic = parseInt(systolicInput.value, 10);
      const diastolic = parseInt(diastolicInput.value, 10);

      if (isNaN(systolic) || isNaN(diastolic) || systolic <= 0 || diastolic <= 0) {
        e.preventDefault();
        alert("Silakan masukkan tekanan darah yang valid (angka lebih dari 0).");
      }
    };

    nextBtn.addEventListener("click", validateAndProceed);

    // Cleanup listeners on unmount
    return () => {
      systolicInput.removeEventListener("input", saveSystolic);
      diastolicInput.removeEventListener("input", saveDiastolic);
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
            <div className="progress-bar" style={{ width: "44%" }}></div>
          </div>
          <div className="progress-text">Pertanyaan ke 5/9</div>

          <div className="predict-content">
            <div className="question-container">
              <h2 className="question">Berapa tekanan darah anda?</h2>

              <div className="answer-inputs">
                <input
                  type="number"
                  className="input-field"
                  id="systolic"
                  placeholder="Masukkan tekanan darah sistolik"
                />
                <input
                  type="number"
                  className="input-field"
                  id="diastolic"
                  placeholder="Masukkan tekanan darah diastolik"
                />
              </div>
            </div>

            <div className="nav-buttons">
              <Link to="/JantungQ4" className="prev-btn">
                <img src={LeftArrow} alt="Previous" />
              </Link>
              <Link to="/JantungQ6" className="next-btn">
                <img src={RightArrow} alt="Next" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JantungQ5;
