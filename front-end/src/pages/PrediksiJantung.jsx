import React from "react";
import { useNavigate } from "react-router-dom";
import TopEllipse from "../assets/images/topEllipse.png";
import BotEllipse from "../assets/images/botEllipse.png";
import Jantung from "../assets/images/jantung.png";
import "../css/style.css";
import "../css/suicide-predict.css";

const PrediksiJantung = () => {
  const navigate = useNavigate();

  const handleStartSurvey = () => {
    sessionStorage.setItem("surveyStarted", "true");
    navigate("/JantungQ1");
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
                src={Jantung}
                alt="Ilustrasi Jantung"
                width="384"
                height="283"
              />
            </div>

            <h1 className="predict-title">Tingkat Resiko Penyakit Jantung</h1>

            <p className="predict-description">
              Penyakit jantung disebut sebagai penyumbang kematian terbesar di
              dunia. Penyakit ini didukung oleh faktor risiko seperti
              kolesterol, tekanan darah tinggi, merokok, obesitas, dan Diabetes.
              Hitung risiko untuk pencegahan dini.
            </p>

            <button onClick={handleStartSurvey} className="start-btn">
              Mulai
            </button>

            <div className="reference">
              <h3>Referensi</h3>
              <p>
                https://www.kaggle.com/datasets/sulianova/cardiovascular-disease-dataset
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrediksiJantung;
