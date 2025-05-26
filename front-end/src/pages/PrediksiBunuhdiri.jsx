import React from "react";
import { useNavigate } from "react-router-dom";
import TopEllipse from "../assets/images/topEllipse.png";
import BotEllipse from "../assets/images/botEllipse.png";
import Stress from "../assets/images/stress.png";
import "../css/style.css";
import "../css/suicide-predict.css";

const PrediksiBunuhDiri = () => {
  const navigate = useNavigate();

  const handleStartSurvey = () => {
    sessionStorage.setItem("surveyStarted", "true");
    navigate("/suicideq1");
  };

  return (
    <div className="container">
      <div className="background">
        <img src={TopEllipse} alt="" className="top-ellipse" />
        <img src={BotEllipse} alt="" className="bottom-ellipse" />
      </div>
      <main>
        <div className="suicide-predict-container">
          <div className="predict-content">
            <div className="predict-image">
              <img
                src={Stress}
                alt="Person feeling stressed"
                width="384"
                height="283"
              />
            </div>

            <h1 className="predict-title">Tingkat Resiko Bunuh Diri</h1>

            <p className="predict-description">
              Risiko bunuh diri dapat dipengaruhi oleh berbagai faktor
              psikologis dan sosial. Dengan menganalisis teks dari tweet, sistem
              ini memberikan gambaran awal mengenai tingkat risiko Anda.
              Prediksi ini bertujuan sebagai langkah awal untuk mengenali pola
              emosi dalam tulisan, bukan untuk diagnosis medis.
            </p>

            <button onClick={handleStartSurvey} className="start-btn">
              Mulai
            </button>

            <div className="reference">
              <h3>Referensi</h3>
              <p>
                https://www.kaggle.com/datasets/aunanya875/suicidal-tweet-detection-dataset
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrediksiBunuhDiri;
