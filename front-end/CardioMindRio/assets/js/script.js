document.addEventListener("DOMContentLoaded", function () {
  // Password toggle functionality
  const passwordToggles = document.querySelectorAll(".password-toggle");

  passwordToggles.forEach((toggle) => {
    toggle.addEventListener("click", function () {
      // Find the parent container and then the input field
      const container = this.closest(".password-container");
      const passwordInput = container.querySelector(
        'input[type="password"], input[type="text"]'
      );

      if (passwordInput) {
        // Toggle between password and text type
        passwordInput.type =
          passwordInput.type === "password" ? "text" : "password";
      }
    });
  });

  // Sign in button
  const signInBtn = document.querySelector(".signin-btn");
  if (signInBtn) {
    signInBtn.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("Sign in clicked");
      // Add authentication logic here
    });
  }

  // Google login button
  const googleBtn = document.querySelector(".google-btn");
  if (googleBtn) {
    googleBtn.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("Google login clicked");
      // Add Google authentication logic here
    });
  }

  // Create account link
  const createAccountLink = document.querySelector(".signup-link a");
  if (createAccountLink) {
    createAccountLink.addEventListener("click", function (e) {
      if (window.location.href.includes("login.html")) {
        // We're already using links with proper hrefs, so we don't need to prevent default
        console.log("Navigating to signup page");
      }
    });
  }

  // Header login/signup buttons
  const loginBtn = document.querySelector(".login-btn");
  if (loginBtn) {
    loginBtn.addEventListener("click", function () {
      // Already on login page, scroll to form
      document
        .querySelector(".login-container")
        .scrollIntoView({ behavior: "smooth" });
    });
  }

  const signupBtn = document.querySelector(".signup-btn");
  if (signupBtn) {
    signupBtn.addEventListener("click", function () {
      // Redirect to signup or show signup form
      console.log("Signup button clicked");
    });
  }
});
