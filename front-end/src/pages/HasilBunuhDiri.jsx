import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/style.css";
import "../css/suicide-predict.css";
import "../css/suicidequestion.css";
import topEllipse from "../assets/images/topEllipse.png";
import botEllipse from "../assets/images/botEllipse.png";

const HasilBunuhDiri = () => {
  const [risk, setRisk] = useState("low");
  const [riskText, setRiskText] = useState("");
  const [riskDetails, setRiskDetails] = useState("");

  useEffect(() => {
    const score = parseFloat(sessionStorage.getItem("suicidePredictionResult") || "0");

    if (score >= 0.5) {
      setRisk("high");
      setRiskText("Berpotensi Bunuh Diri");
      setRiskDetails("Hasil prediksi menunjukkan bahwa penulis teks memiliki potensi untuk melakukan bunuh diri. Kami menyarankan untuk segera berkonsultasi dengan profesional atau tenaga medis.");
    } else {
      setRisk("low");
      setRiskText("Tidak Berpotensi Bunuh Diri");
      setRiskDetails("Hasil prediksi menunjukkan bahwa penulis teks tidak memiliki potensi untuk melakukan bunuh diri. Tetap jaga kesehatan mentalmu dan tetap terhubung dengan orang-orang terdekat.");
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
            <h2 className={`risk-level risk-${risk}`}>{riskText}</h2>
            <p className="risk-description">{riskDetails}</p>
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
