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
  const [suicideMessages, setSuicideMessages] = useState(["", "", "", "", ""]);
  const [model, setModel] = useState(null);
  const [wordIndex, setWordIndex] = useState({});
  const [predictionResult, setPredictionResult] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem("surveyStarted")) {
      navigate("/PrediksiBunuhDiri");
    }

    // Ambil pesan yang tersimpan sebelumnya
    if (sessionStorage.getItem("suicideMessage")) {
      try {
        const savedMessages = JSON.parse(sessionStorage.getItem("suicideMessage"));
        if (Array.isArray(savedMessages) && savedMessages.length === 5) {
          setSuicideMessages(savedMessages);
        }
      } catch (e) {
        console.error("Failed to parse saved messages", e);
      }
    }

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
        alert("Gagal memuat model prediksi. Error: " + error.message);
      }
    };

    loadResources();
  }, [navigate]);

  const handleSuicideMessageChange = (index, value) => {
    const updatedMessages = [...suicideMessages];
    updatedMessages[index] = value;
    setSuicideMessages(updatedMessages);
    sessionStorage.setItem("suicideMessage", JSON.stringify(updatedMessages));
  };

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

  const handleCalculateClick = async () => {
    const validMessages = suicideMessages.filter((msg) => msg.trim() !== "");
    if (validMessages.length === 0) {
      alert("Please enter at least one message.");
      return;
    }

    if (!isLoaded || !model || Object.keys(wordIndex).length === 0) {
      alert("Model atau kamus kata belum selesai dimuat. Mohon tunggu sebentar...");
      return;
    }

    let sum = 0;

    for (const msg of validMessages) {
      const inputTensor = tokenize(msg, wordIndex);
      const prediction = model.predict(inputTensor);
      const value = (await prediction.data())[0];
      prediction.dispose();
      inputTensor.dispose();

      sum += value;
    }

    const avgPrediction = sum / validMessages.length;
    setPredictionResult(avgPrediction);

    const riskCategory = avgPrediction >= 0.5 ? "Berpotensi Bunuh Diri" : "Tidak Berpotensi Bunuh Diri";

    // Simpan ke sessionStorage
    sessionStorage.setItem("suicideMessage", JSON.stringify(suicideMessages));
    sessionStorage.setItem("suicidePredictionResult", avgPrediction);

    try {
      await fetch("http://localhost:8080/api/suicideHistory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          message: suicideMessages.join(" || "), // Gabungkan array jadi satu string
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
              <h2 className="question">Please input your 5 messages below:</h2>

              <div className="input-container">
                {suicideMessages.map((msg, index) => (
                  <input
                    key={index}
                    type="text"
                    className="blood-pressure-input"
                    value={msg}
                    onChange={(e) => handleSuicideMessageChange(index, e.target.value)}
                    placeholder={`Enter message ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <button className="calculate-btn" id="calculate" onClick={handleCalculateClick} disabled={!isLoaded}>
              {isLoaded ? "Calculate" : "Loading..."}
            </button>

            {!isLoaded && <p className="loading-text">Loading model... Please wait.</p>}

            <div className="nav-buttons">
              <a href="/PrediksiBunuhDiri" className="prev-btn">
                <img src={LeftArrow} alt="Previous" />
              </a>
            </div>

            {predictionResult !== null && (
              <p className="prediction-output">
                Average Predicted Risk Score: {predictionResult.toFixed(4)}
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SuicideQ1;
