import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/style.css";
import "../css/suicide-predict.css";
import "../css/suicidequestion.css";
import topEllipse from "../assets/images/topEllipse.png";
import botEllipse from "../assets/images/botEllipse.png";

const HasilBunuhDiri = () => {
  const [predictionResult, setPredictionResult] = useState(null); // State to hold the prediction result

  useEffect(() => {
    // Retrieve the prediction result from sessionStorage
    const savedPrediction = sessionStorage.getItem("suicidePredictionResult");
    if (savedPrediction) {
      setPredictionResult(parseFloat(savedPrediction)); // Parse and set the prediction result
    }
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
            <h2 className="risk-level">Hasil Prediksi</h2>
            {predictionResult !== null && (
              <div className="prediction-result">
                <p>Skor Risiko: {predictionResult.toFixed(4)}</p>
              </div>
            )}
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
