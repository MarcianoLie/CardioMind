import React, { useEffect, useState } from "react";
 import { Link } from "react-router-dom";
 import "../css/suicide-predict.css"
 import "../css/suicidequestion.css"
 import "../css/style.css"
 import botEllipse from "../assets/images/botEllipse.png";
 import topEllipse from "../assets/images/topEllipse.png"
 
 const HasilJantung = () => {
   const [risk, setRisk] = useState("low");
   const [riskText, setRiskText] = useState("Resiko Rendah");
   const [riskDetails, setRiskDetails] = useState("");
   const [profileText, setProfileText] = useState("");
 
   useEffect(() => {
     // Ambil jawaban dari sessionStorage
     const gender = sessionStorage.getItem("q1_answer") || "male";
     const age = sessionStorage.getItem("q3_age") || "32";
     const smoker = sessionStorage.getItem("q4_answer") || "no";
     const suicidalThoughts = sessionStorage.getItem("suicidalThoughts") || "no";
 
     // Tentukan rentang usia
     const ageNum = parseInt(age, 10);
     let ageRange;
     if (ageNum < 18) {
       ageRange = "di bawah 18 tahun";
     } else if (ageNum < 25) {
       ageRange = "18 – 24 tahun";
     } else if (ageNum < 35) {
       ageRange = "25 – 34 tahun";
     } else if (ageNum < 45) {
       ageRange = "35 – 44 tahun";
     } else if (ageNum < 55) {
       ageRange = "45 – 54 tahun";
     } else {
       ageRange = "55+ tahun";
     }
 
     // Buat teks profil
     const genderText = gender === "male" ? "Laki-laki" : "Perempuan";
     setProfileText(`Level risiko ${genderText}, ${ageRange}`);
 
     // Hitung level risiko
     let newRisk = "low";
     let newRiskText = "Resiko Rendah";
     let newRiskDetails = `Biasanya, ${genderText.toLowerCase()} sehat usia ${ageRange} berisiko 3% dibandingkan dengan risikomu.`;
 
     if (suicidalThoughts === "yes") {
       newRisk = "high";
       newRiskText = "Resiko Tinggi";
       newRiskDetails = `Biasanya, ${genderText.toLowerCase()} sehat usia ${ageRange} berisiko 35% dibandingkan dengan risikomu.`;
     } else if (smoker === "yes") {
       newRisk = "medium";
       newRiskText = "Resiko Sedang";
       newRiskDetails = `Biasanya, ${genderText.toLowerCase()} sehat usia ${ageRange} berisiko 15% dibandingkan dengan risikomu.`;
     }
 
     setRisk(newRisk);
     setRiskText(newRiskText);
     setRiskDetails(newRiskDetails);
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