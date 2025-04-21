import { useState, useEffect, useRef } from "react";
import "../css/style.css";
import "../css/home.css";
import { Link } from "react-router-dom";
import topEllipse from "../assets/images/topEllipse.png";
import botEllipse from "../assets/images/botEllipse.png";
import Profile from "../assets/images/Profile.png";
import Logo from "../assets/images/Logo.png";
import hospital from "../assets/images/hospital.png";
import personSolid from "../assets/images/person-solid 1.png";
import MbaDokter from "../assets/images/MbaDokter.png";
import scrollSolid from "../assets/images/scroll-solid 1.png";
import love from "../assets/images/love.png";
import left from "../assets/images/left.png";
import right from "../assets/images/right.png";
import Slide1 from "../assets/images/Slide1.png";
import Slide2 from "../assets/images/Slide2.png";
import Slide3 from "../assets/images/Slide3.png";
import Slide4 from "../assets/images/Slide4.png";
import Slide5 from "../assets/images/Slide5.png";

function Homepage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isVerySmall, setIsVerySmall] = useState(window.innerWidth < 480);
  const slideInterval = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const totalSlides = 5;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const startSlideShow = () => {
    pauseSlideShow();
    slideInterval.current = setInterval(nextSlide, 5000);
  };

  const pauseSlideShow = () => {
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
    }
  };

  const checkScreenSize = () => {
    setIsMobile(window.innerWidth < 768);
    setIsVerySmall(window.innerWidth < 480);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    const swipeThreshold = 50;

    if (touchEndX.current < touchStartX.current - swipeThreshold) {
      nextSlide();
    } else if (touchEndX.current > touchStartX.current + swipeThreshold) {
      prevSlide();
    }
    startSlideShow();
  };

  const getSlideClass = (slideIndex) => {
    const diff = (slideIndex - currentIndex + totalSlides) % totalSlides;

    if (slideIndex === currentIndex) return "active";
    if (diff === 1) return "next-1";
    if (diff === totalSlides - 1) return "prev-1";
    if (diff === 2) return "next-2";
    if (diff === totalSlides - 2) return "prev-2";
    return "";
  };

  const getSlideZIndex = (slideIndex) => {
    if (slideIndex === currentIndex) return 10;
    const diff = (slideIndex - currentIndex + totalSlides) % totalSlides;
    if (diff === 1 || diff === totalSlides - 1) return 5;
    return 1;
  };

  useEffect(() => {
    startSlideShow();
    window.addEventListener("resize", checkScreenSize);
    window.addEventListener("orientationchange", () => {
      setTimeout(checkScreenSize, 200);
    });

    return () => {
      pauseSlideShow();
      window.removeEventListener("resize", checkScreenSize);
      window.removeEventListener("orientationchange", checkScreenSize);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        prevSlide();
        startSlideShow();
      } else if (e.key === "ArrowRight") {
        nextSlide();
        startSlideShow();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="container">
      <div className="background">
        <img src={topEllipse} alt="" className="top-ellipse" />
        <img src={botEllipse} alt="" className="bottom-ellipse" />
      </div>

      <main>
        <div className="home-content">
          <div className="solution-text">
            <h1>Solusi Pertolongan Pertama</h1>
            <p>
              Tanya dokter, prediksi penyakit, dan info kesehatan jantung dan
              stress
            </p>
          </div>

          <div className="service-boxes">
            <a href="/health-info" className="service-box">
              <img src={hospital} alt="Kesehatan Icon" />
              <h3>Info Kesehatan</h3>
            </a>
            <a href="/PrediksiBunuhDiri" className="service-box">
              <img src={personSolid} alt="Stress Icon" />
              <h3>Prediksi Tingkat Bunuh Diri</h3>
            </a>
            <div className="center-image-container">
              <img src={MbaDokter} alt="Mba Dokter" className="center-image" />
            </div>
            <a href="/prediction-history" className="service-box">
              <img src={scrollSolid} alt="Prediksi Icon" />
              <h3>Riwayat Prediksi</h3>
            </a>
            <a href="/PrediksiJantung" className="service-box">
              <img src={love} alt="Cardiovascular Icon" />
              <h3>Prediksi Kesehatan Jantung</h3>
            </a>
          </div>
        </div>
      </main>

      {/* Slider section */}
      <div className="slider-section">
        <h2 className="slider-heading">Cardio Insight</h2>
        <div className="slider-container">
          <div className="slider-mask"></div>
          <div className="slider-content">
            <div
              className="slides-wrapper"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Static slides matching original structure */}
              <div
                className={`slide ${getSlideClass(3)}`}
                data-index="3"
                style={{ zIndex: getSlideZIndex(3) }}
              >
                <img src={Slide4} alt="Slide 4" />
              </div>
              <div
                className={`slide ${getSlideClass(4)}`}
                data-index="4"
                style={{ zIndex: getSlideZIndex(4) }}
              >
                <img src={Slide5} alt="Slide 5" />
              </div>
              <div
                className={`slide ${getSlideClass(0)}`}
                data-index="0"
                style={{ zIndex: getSlideZIndex(0) }}
              >
                <img src={Slide1} alt="Slide 1" />
              </div>
              <div
                className={`slide ${getSlideClass(1)}`}
                data-index="1"
                style={{ zIndex: getSlideZIndex(1) }}
              >
                <img src={Slide2} alt="Slide 2" />
              </div>
              <div
                className={`slide ${getSlideClass(2)}`}
                data-index="2"
                style={{ zIndex: getSlideZIndex(2) }}
              >
                <img src={Slide3} alt="Slide 3" />
              </div>
            </div>
          </div>
          <div className="slider-navigation">
            <button
              className="slider-button prev-button"
              aria-label="Previous slide"
              onClick={() => {
                prevSlide();
                startSlideShow();
              }}
            >
              <img src={left} alt="Previous" />
            </button>
            <div className="slider-dots">
              {[0, 1, 2, 3, 4].map((index) => (
                <div
                  key={index}
                  className={`dot ${currentIndex === index ? "active" : ""}`}
                  data-index={index}
                  role="button"
                  aria-label={`Go to slide ${index + 1}`}
                  onClick={() => {
                    goToSlide(index);
                    startSlideShow();
                  }}
                  style={{
                    backgroundColor:
                      currentIndex === index ? "#fff" : "#0c240c",
                    width:
                      currentIndex === index
                        ? isVerySmall
                          ? "12px"
                          : isMobile
                          ? "14px"
                          : "16px"
                        : isVerySmall
                        ? "8px"
                        : isMobile
                        ? "10px"
                        : "12px",
                    height:
                      currentIndex === index
                        ? isVerySmall
                          ? "12px"
                          : isMobile
                          ? "14px"
                          : "16px"
                        : isVerySmall
                        ? "8px"
                        : isMobile
                        ? "10px"
                        : "12px",
                  }}
                ></div>
              ))}
            </div>
            <button
              className="slider-button next-button"
              aria-label="Next slide"
              onClick={() => {
                nextSlide();
                startSlideShow();
              }}
            >
              <img src={right} alt="Next" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;