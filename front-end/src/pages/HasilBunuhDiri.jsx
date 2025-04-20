import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as tf from "@tensorflow/tfjs";
import "../css/style.css";
import "../css/suicide-predict.css";
import "../css/suicidequestion.css";
import topEllipse from "../assets/images/topEllipse.png";
import botEllipse from "../assets/images/botEllipse.png";

const HasilBunuhDiri = () => {
  const [risk, setRisk] = useState("low");
  const [riskText, setRiskText] = useState("Resiko Rendah");
  const [riskDetails, setRiskDetails] = useState("");
  const [profileText, setProfileText] = useState("");

  useEffect(() => {
    const score = parseFloat(sessionStorage.getItem("suicidePredictionResult") || "0");

    const gender = sessionStorage.getItem("q1_answer") || "male";
    const age = sessionStorage.getItem("q3_age") || "32";

    const ageNum = parseInt(age, 10);
    let ageRange = "55+ tahun";
    if (ageNum < 18) ageRange = "di bawah 18 tahun";
    else if (ageNum < 25) ageRange = "18 – 24 tahun";
    else if (ageNum < 35) ageRange = "25 – 34 tahun";
    else if (ageNum < 45) ageRange = "35 – 44 tahun";
    else if (ageNum < 55) ageRange = "45 – 54 tahun";

    const genderText = gender === "male" ? "Laki-laki" : "Perempuan";
    setProfileText(`Level risiko ${genderText}, ${ageRange}`);

    let riskLabel = "low";
    let riskLabelText = "Resiko Rendah";
    let riskLabelDetails = `Biasanya, ${genderText.toLowerCase()} sehat usia ${ageRange} berisiko 3% dibandingkan dengan risikomu.`;

    if (score > 0.7) {
      riskLabel = "high";
      riskLabelText = "Resiko Tinggi";
      riskLabelDetails = `Biasanya, ${genderText.toLowerCase()} sehat usia ${ageRange} berisiko 35% dibandingkan dengan risikomu.`;
    } else if (score > 0.3) {
      riskLabel = "medium";
      riskLabelText = "Resiko Sedang";
      riskLabelDetails = `Biasanya, ${genderText.toLowerCase()} sehat usia ${ageRange} berisiko 15% dibandingkan dengan risikomu.`;
    }

    setRisk(riskLabel);
    setRiskText(riskLabelText);
    setRiskDetails(riskLabelDetails);
  }, []);


  return (
    <div className="container">
      <div className="background">
        <img src={topEllipse} alt="Ellipse atas" className="top-ellipse" />
        <img src={botEllipse} alt="Ellipse bawah" className="bottom-ellipse" />
      </div>

      <main>
        <div className="suicide-predict-container results-container">
          <div className="progress-container">
            <div className="progress-bar" style={{ width: "100%" }} />
          </div>
          <div className="progress-text">Selesai</div>

          <div className="results-card">
            <div className="results-info" id="user-profile">
              {profileText}
            </div>
            <h2 className={`risk-level risk-${risk}`}>{riskText}</h2>
            <p className="risk-description" id="risk-details">
              {riskDetails}
            </p>
            <Link to="/PrediksiBunuhDiri" className="recheck-btn">
              Cek Ulang
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HasilBunuhDiri;
