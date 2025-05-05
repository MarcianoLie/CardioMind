import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/suicide-predict.css"
import "../css/suicidequestion.css"
import "../css/style.css"
import * as tf from "@tensorflow/tfjs";
import botEllipse from "../assets/images/botEllipse.png";
import topEllipse from "../assets/images/topEllipse.png";
import axios from "axios"; 

const HasilJantung = () => {
  const [risk, setRisk] = useState("low");
  const [riskText, setRiskText] = useState("Resiko Rendah");
  const [riskDetails, setRiskDetails] = useState("");
  const [profileText, setProfileText] = useState("");

  useEffect(() => {
    const loadModelAndPredict = async () => {
      try {
        const age = parseFloat(sessionStorage.getItem("age")) * 365.25;
        const gender = sessionStorage.getItem("gender") === "male" ? 1 : 0;
        const height = parseFloat(sessionStorage.getItem("height"));
        const weight = parseFloat(sessionStorage.getItem("weight"));
        const ap_hi = parseFloat(sessionStorage.getItem("systolic"));
        const ap_lo = parseFloat(sessionStorage.getItem("diastolic"));
        const cholesterol = parseInt(sessionStorage.getItem("cholesterol"));
        const glucose = parseInt(sessionStorage.getItem("glucose"));
        const smoke = sessionStorage.getItem("smoke") === "yes" ? 1 : 0;
        const alcohol = sessionStorage.getItem("alcohol") === "yes" ? 1 : 0;
        const active = sessionStorage.getItem("active") === "yes" ? 1 : 0;

        const means = {
          age: 19468.865814, height: 164.359229, weight: 74.205690, ap_hi: 128.817286, ap_lo: 96.630414
        };
        const stds = {
          age: 2467.251667, height: 8.210126, weight: 14.395757, ap_hi: 154.011419, ap_lo: 188.472530
        };

        const raw = [
          age, gender, height, weight, ap_hi, ap_lo,
          cholesterol, glucose, smoke, alcohol, active
        ];

        const normalized = [
          (age - means.age) / stds.age,
          gender,
          (height - means.height) / stds.height,
          (weight - means.weight) / stds.weight,
          (ap_hi - means.ap_hi) / stds.ap_hi,
          (ap_lo - means.ap_lo) / stds.ap_lo,
          cholesterol<200?0:cholesterol<240?1:2,
          glucose<70?0:glucose<100?1:2,
          smoke,
          alcohol,
          active
        ];
        

        console.log(raw);
        console.log(normalized);

        setProfileText(
          `Umur: ${(age / 365.25).toFixed(0)} tahun | Gender: ${gender === 1 ? "Laki-laki" : "Perempuan"} | Tinggi: ${height} cm | Berat: ${weight} kg`
        );

        const model = await tf.loadGraphModel("/cardio/model.json"); // pastikan path model benar

        const inputTensor = tf.tensor2d([normalized]);
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
        try {
          const response = await axios.post("http://localhost:8080/api/postcardiohistory", {
            age, gender, height, weight, ap_hi, ap_lo,
            cholesterol, glucose, smoke, alcohol, active, score
          });
        
          const data = response.data;
        
          if (data.error) {
            console.error("Gagal record: " + data.message);
          } else {
            console.log("Record berhasil!");
          }
        } catch (error) {
          console.error("Gagal mengirim data ke server:", error.response?.data || error.message);
        }
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
