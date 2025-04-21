import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/suicide-predict.css"
import "../css/suicidequestion.css"
import "../css/style.css"
import * as tf from "@tensorflow/tfjs";
import botEllipse from "../assets/images/botEllipse.png";
import topEllipse from "../assets/images/topEllipse.png"

const HasilJantung = () => {
  const [risk, setRisk] = useState("low");
  const [riskText, setRiskText] = useState("Resiko Rendah");
  const [riskDetails, setRiskDetails] = useState("");
  const [profileText, setProfileText] = useState("");

  useEffect(() => {
    const loadModelAndPredict = async () => {
      try {
        const age = parseFloat(sessionStorage.getItem("age")) * 365.25;
        const gender = sessionStorage.getItem("gender") === "male" ? 2 : 1;
        const height = parseFloat(sessionStorage.getItem("height"));
        const weight = parseFloat(sessionStorage.getItem("weight"));
        const ap_hi = parseFloat(sessionStorage.getItem("systolic"));
        const ap_lo = parseFloat(sessionStorage.getItem("diastolic"));
        const cholesterol = parseInt(sessionStorage.getItem("cholesterol"));
        const glucose = parseInt(sessionStorage.getItem("glucose"));
        const smoke = sessionStorage.getItem("smoke") === "yes" ? 1 : 0;
        const alcohol = sessionStorage.getItem("alcohol") === "yes" ? 1 : 0;
        const active = sessionStorage.getItem("active") === "yes" ? 1 : 0;

        const input = [
          age, gender, height, weight, ap_hi, ap_lo,
          cholesterol, glucose, smoke, alcohol, active
        ];

        setProfileText(
          `Umur: ${(age / 365.25).toFixed(0)} tahun | Gender: ${gender === 2 ? "Laki-laki" : "Perempuan"} | Tinggi: ${height} cm | Berat: ${weight} kg`
        );

        const model = await tf.loadLayersModel("../back-end/cardio/model.json"); // pastikan path model benar

        const inputTensor = tf.tensor2d([input]);
        const prediction = model.predict(inputTensor);
        const score = (await prediction.data())[0];

        const isRisk = score >= 0.5;

        setRiskText(isRisk
          ? `Berpotensi Sakit Jantung (${(score * 100).toFixed(2)}%)`
          : `Tidak Berpotensi Sakit Jantung (${(score * 100).toFixed(2)}%)`
        );

        setRiskDetails(isRisk
          ? "Hasil menunjukkan Anda memiliki kemungkinan cukup tinggi mengidap penyakit jantung. Disarankan untuk konsultasi dengan dokter."
          : "Anda tergolong dalam risiko rendah. Tetap jaga gaya hidup sehat!"
        );
      } catch (err) {
        console.error("Prediction error:", err);
        setRiskText("Gagal memuat prediksi.");
        setRiskDetails("Terjadi kesalahan saat memuat model atau data.");
      }
    };

    loadModelAndPredict();
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
            <Link to="/PrediksiJantung" className="recheck-btn">
              Cek Ulang
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HasilJantung;
