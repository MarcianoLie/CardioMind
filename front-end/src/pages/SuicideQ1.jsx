import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as tf from "@tensorflow/tfjs";
import BotEllipse from "../assets/images/botEllipse.png";
import LeftArrow from "../assets/images/left.png";
import "../css/style.css";
import "../css/suicide-predict.css";
import "../css/suicidequestion.css";

const SuicideQ1 = () => {
  const navigate = useNavigate();
  const [suicideMessage, setSuicideMessage] = useState("");
  const [model, setModel] = useState(null);
  const [wordIndex, setWordIndex] = useState({});
  const [predictionResult, setPredictionResult] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);


  useEffect(() => {
    if (!sessionStorage.getItem("surveyStarted")) {
      navigate("/PrediksiBunuhDiri");
    }

    if (sessionStorage.getItem("suicideMessage")) {
      setSuicideMessage(sessionStorage.getItem("suicideMessage"));
    }

    // Load model and word index
    const loadResources = async () => {
      try {
        console.log("Attempting to load model from: /suicide/model.json");
        const loadedModel = await tf.loadGraphModel("/suicide/model.json");
        console.log("Model loaded successfully");

        console.log("Attempting to load word index from: /suicide/word_index.json");
        const wordIndexRes = await fetch("/suicide/word_index.json");

        if (!wordIndexRes.ok) {
          throw new Error(`HTTP error when fetching word index: ${wordIndexRes.status}`);
        }

        const wordIndexJson = await wordIndexRes.json();
        console.log("Word index loaded successfully");

        setModel(loadedModel);
        setWordIndex(wordIndexJson);
        setIsLoaded(true);
        console.log("All resources loaded successfully");
      } catch (error) {
        console.error("Error loading model or word index:", error);

        // More detailed error message based on the type of error
        if (error.message.includes("fetch")) {
          alert("Network error: Could not fetch model files. Please check your internet connection.");
        } else if (error.message.includes("JSON")) {
          alert("Format error: The model files appear to be corrupted or in an incorrect format.");
        } else {
          alert("Gagal memuat model prediksi. Error: " + error.message);
        }
      }
    };


    loadResources();
  }, [navigate]);

  const tokenize = (text, wordIndexMap, maxLen = 100) => {
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(" ")
      .filter((w) => w !== "");

    let tokens = words.map((word) => wordIndexMap[word] || wordIndexMap["<OOV>"] || 1);

    if (tokens.length < maxLen) {
      tokens = [...tokens, ...Array(maxLen - tokens.length).fill(0)];
    } else {
      tokens = tokens.slice(0, maxLen);
    }

    return tf.tensor2d([tokens]);
  };

  const handleSuicideMessage = (e) => {
    setSuicideMessage(e.target.value);
    sessionStorage.setItem("suicideMessage", e.target.value);
  };

  const handleCalculateClick = async () => {
    if (!suicideMessage.trim()) {
      alert("Please enter a message before continuing.");
      return;
    }

    if (!isLoaded || !model || !Object.keys(wordIndex).length) {
      alert("Model atau kamus kata belum selesai dimuat. Mohon tunggu sebentar...");
      return;
    }


    const inputTensor = tokenize(suicideMessage, wordIndex);
    const prediction = model.predict(inputTensor);
    const predictionValue = (await prediction.data())[0];
    prediction.dispose();
    inputTensor.dispose();

    setPredictionResult(predictionValue);

    // Simpan ke session dan lanjut ke halaman hasil
    sessionStorage.setItem("suicidePredictionResult", predictionValue);
    const riskCategory = predictionValue >= 0.5 ? "Berpotensi Bunuh Diri" : "Tidak Berpotensi Bunuh Diri";

    try {
      await fetch("http://localhost:8080/api/suicideHistory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", 
        body: JSON.stringify({
          message: suicideMessage,
          predictionResult: riskCategory,
        }),
      });
      console.log("History tersimpan untuk user login.");
    } catch (error) {
      console.error("Gagal menyimpan history:", error);
    }

    navigate("/HasilBunuhDiri");
  };

  return (
    <div className="container">
      <div className="background">
        <img src={BotEllipse} alt="Background" className="bottom-ellipse" />
      </div>

      <main>
        <div className="suicide-predict-container">
          <div className="progress-container">
            <div className="progress-bar" style={{ width: "10%" }}></div>
          </div>
          <div className="progress-text">Make sure the text is in English!</div>

          <div className="predict-content">
            <div className="question-container">
              <h2 className="question">Please input your message below:</h2>

              <div className="input-container">
                <input
                  type="text"
                  className="blood-pressure-input"
                  id="suicideMessage"
                  value={suicideMessage}
                  onChange={handleSuicideMessage}
                  placeholder="Enter your message"
                />
              </div>
            </div>

            <button className="calculate-btn" id="calculate" onClick={handleCalculateClick} disabled={!isLoaded}>
              {isLoaded ? "Calculate" : "Loading..."}
            </button>

            {!isLoaded && (
              <p className="loading-text">Loading model... Please wait.</p>)
            }

            <div className="nav-buttons">
              <a href="/PrediksiBunuhDiri" className="prev-btn">
                <img src={LeftArrow} alt="Previous" />
              </a>
            </div>

            {predictionResult !== null && (
              <p className="prediction-output">
                Predicted Risk Score: {predictionResult.toFixed(4)}
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SuicideQ1;