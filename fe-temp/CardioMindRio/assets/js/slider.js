// Enhanced multi-slide carousel functionality
document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  const prevBtn = document.querySelector(".prev-button");
  const nextBtn = document.querySelector(".next-button");
  const sliderNavigation = document.querySelector(".slider-navigation");
  const totalSlides = slides.length;

  let currentIndex = 0;
  let slideInterval;
  let isMobile = window.innerWidth < 768;
  let isVerySmall = window.innerWidth < 480;

  // Function to update slide positions
  function updateSlides() {
    // Reset all slides
    slides.forEach((slide) => {
      slide.classList.remove("active", "prev-1", "prev-2", "next-1", "next-2");
      slide.style.zIndex = "0";
    });

    // Set active slide
    const activeSlide = document.querySelector(
      `.slide[data-index="${currentIndex}"]`
    );
    activeSlide.classList.add("active");
    activeSlide.style.zIndex = "10";

    // Calculate previous slides
    const prev1Index = (currentIndex - 1 + totalSlides) % totalSlides;
    const prev2Index = (currentIndex - 2 + totalSlides) % totalSlides;

    // Calculate next slides
    const next1Index = (currentIndex + 1) % totalSlides;
    const next2Index = (currentIndex + 2) % totalSlides;

    // Set prev slides
    const prev1Slide = document.querySelector(
      `.slide[data-index="${prev1Index}"]`
    );
    prev1Slide.classList.add("prev-1");
    prev1Slide.style.zIndex = "5";

    // Only show prev-2 and next-2 slides on desktop
    if (!isMobile) {
      const prev2Slide = document.querySelector(
        `.slide[data-index="${prev2Index}"]`
      );
      prev2Slide.classList.add("prev-2");
      prev2Slide.style.zIndex = "1";

      const next2Slide = document.querySelector(
        `.slide[data-index="${next2Index}"]`
      );
      next2Slide.classList.add("next-2");
      next2Slide.style.zIndex = "1";
    }

    // Set next slides
    const next1Slide = document.querySelector(
      `.slide[data-index="${next1Index}"]`
    );
    next1Slide.classList.add("next-1");
    next1Slide.style.zIndex = "5";

    // Update dots - first reset all
    dots.forEach((dot) => {
      dot.style.backgroundColor = "#0c240c";
      dot.style.width = isVerySmall ? "8px" : isMobile ? "10px" : "12px";
      dot.style.height = isVerySmall ? "8px" : isMobile ? "10px" : "12px";
      dot.classList.remove("active");
    });

    // Set active dot
    const activeDot = document.querySelector(
      `.dot[data-index="${currentIndex}"]`
    );
    activeDot.style.backgroundColor = "#fff";
    activeDot.style.width = isVerySmall ? "12px" : isMobile ? "14px" : "16px";
    activeDot.style.height = isVerySmall ? "12px" : isMobile ? "14px" : "16px";
    activeDot.classList.add("active");

    // Ensure navigation is visible
    ensureNavigationVisible();
  }

  // Make sure the navigation stays visible
  function ensureNavigationVisible() {
    // Add a small delay to ensure DOM updates have occurred
    setTimeout(() => {
      const sliderSection = document.querySelector(".slider-section");
      const sliderSectionHeight = sliderSection.offsetHeight;
      const sliderContent = document.querySelector(".slider-content");
      const sliderContentBottom =
        sliderContent.offsetTop + sliderContent.offsetHeight;

      // If we're on mobile, ensure navigation is properly positioned
      if (isMobile) {
        sliderNavigation.style.display = "flex";
        // Ensure navigation is positioned below the content
        if (window.innerWidth <= 576) {
          sliderNavigation.style.position = "absolute";
          sliderNavigation.style.bottom = "15px";
          sliderNavigation.style.left = "50%";
          sliderNavigation.style.transform = "translateX(-50%)";
        }
      } else {
        sliderNavigation.style.position = "relative";
        sliderNavigation.style.transform = "none";
        sliderNavigation.style.left = "auto";
        sliderNavigation.style.bottom = "auto";
      }
    }, 50);
  }

  // Function to go to next slide
  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlides();
  }

  // Function to go to previous slide
  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateSlides();
  }

  // Function to go to a specific slide
  function goToSlide(index) {
    currentIndex = parseInt(index);
    updateSlides();
  }

  // Start automatic sliding
  function startSlideShow() {
    slideInterval = setInterval(nextSlide, 5000);
  }

  // Stop automatic sliding
  function pauseSlideShow() {
    clearInterval(slideInterval);
  }

  // Resume automatic sliding
  function resumeSlideShow() {
    pauseSlideShow();
    startSlideShow();
  }

  // Check device screen size
  function checkScreenSize() {
    isMobile = window.innerWidth < 768;
    isVerySmall = window.innerWidth < 480;
    updateSlides();
    ensureNavigationVisible();
  }

  // Event listeners
  prevBtn.addEventListener("click", function () {
    prevSlide();
    resumeSlideShow();
  });

  nextBtn.addEventListener("click", function () {
    nextSlide();
    resumeSlideShow();
  });

  // Allow clicking on dots to change slides
  dots.forEach((dot) => {
    dot.addEventListener("click", function () {
      goToSlide(this.getAttribute("data-index"));
      resumeSlideShow();
    });
  });

  // Handle swipe gestures for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  const slider = document.querySelector(".slider-content");

  slider.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  slider.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      // Swipe left
      nextSlide();
      resumeSlideShow();
    } else if (touchEndX > touchStartX + swipeThreshold) {
      // Swipe right
      prevSlide();
      resumeSlideShow();
    }
  }

  // Handle keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      prevSlide();
      resumeSlideShow();
    } else if (e.key === "ArrowRight") {
      nextSlide();
      resumeSlideShow();
    }
  });

  // Handle window resize
  window.addEventListener("resize", checkScreenSize);

  // Handle orientation change for mobile devices
  window.addEventListener("orientationchange", () => {
    setTimeout(checkScreenSize, 200); // Add delay for orientation to complete
  });

  // Initialize
  checkScreenSize();
  startSlideShow();
});
