import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/style.css";
import "../css/suicide-predict.css";
import "../css/suicidequestion.css";
import BotEllipse from "../assets/images/botEllipse.png";
import LeftArrow from "../assets/images/left.png";
import RightArrow from "../assets/images/right.png";

const JantungQ3 = () => {
    useEffect(() => {
        const ageInput = document.getElementById("age");
        const nextBtn = document.querySelector(".next-btn");

        // Load previously saved value if it exists
        if (sessionStorage.getItem("q3_age")) {
            ageInput.value = sessionStorage.getItem("q3_age");
        }

        // Save input value when it changes
        const saveAge = () => {
            sessionStorage.setItem("q3_age", ageInput.value);
        };
        ageInput.addEventListener("input", saveAge);

        // Add validation to next button
        const validateAndProceed = (e) => {
            const ageValue = ageInput.value.trim();

            // Check if the input is a valid integer and in the range
            if (!ageValue || isNaN(ageValue) || ageValue <= 0) {
                e.preventDefault();
                alert("Silakan masukkan usia yang valid (angka lebih dari 0).");
            }
        };
        nextBtn.addEventListener("click", validateAndProceed);

        // Cleanup listeners on unmount
        return () => {
            ageInput.removeEventListener("input", saveAge);
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
                        <div className="progress-bar" style={{ width: "22%" }}></div>
                    </div>
                    <div className="progress-text">Pertanyaan ke 3/9</div>

                    <div className="predict-content">
                        <div className="question-container">
                            <h2 className="question">Berapa usia kamu</h2>

                            <div className="answer-inputs">
                                {/* Changed type to number for better validation */}
                                <input
                                    type="number"
                                    className="input-field"
                                    id="age"
                                    placeholder="Enter your age"
                                    min="1" // Optional: Limits the value to be greater than 0
                                />
                            </div>
                        </div>

                        <div className="nav-buttons">
                            <Link to="/JantungQ2" className="prev-btn">
                                <img src={LeftArrow} alt="Previous" />
                            </Link>
                            <Link to="/JantungQ4" className="next-btn">
                                <img src={RightArrow} alt="Next" />
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default JantungQ3;