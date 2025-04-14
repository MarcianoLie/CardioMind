<<<<<<< HEAD
document.addEventListener("DOMContentLoaded", function () {

  const firebaseConfig = {
    apiKey: "AIzaSyBzneED6xnLLmzkeac52Z4EjkKUJh-nVVo",
    authDomain: "cardiomind-950e7.firebaseapp.com",
    projectId: "cardiomind-950e7",
    storageBucket: "cardiomind-950e7.firebasestorage.app",
    messagingSenderId: "311102107184",
    appId: "1:311102107184:web:e622ffa016d8bdb74b47f5",
    measurementId: "G-ZNLND80HSD"
  };

  if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
  } else {
    console.error("Firebase tidak tersedia. Pastikan script Firebase dimuat dengan benar.");
  }
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
    signInBtn.addEventListener("click", async function (e) {
      e.preventDefault();
      console.log("Sign in clicked");

      const name = document.getElementById("fullname").value;
      const placeDob = document.getElementById("place-dob").value;
      const number = document.getElementById("number").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirm-password").value;

      if (password !== confirmPassword) {
        alert("Password dan Konfirmasi tidak cocok");
        return;
      }

      // Pisahkan tempat dan tanggal lahir
      const [birthPlace, birthDate] = placeDob.split(",");

      try {
        const response = await fetch("http://localhost:8080/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name,
            birthPlace: birthPlace?.trim(),
            birthDate: birthDate?.trim(),
            phone: number,
            email,
            password
          })
        });

        const data = await response.json();
        if (data.error) {
          alert("Gagal daftar: " + data.message);
        } else {
          alert("Pendaftaran berhasil!");
          window.location.href = "login.html";
        }
      } catch (error) {
        console.error(error);
        alert("Terjadi kesalahan saat mendaftar");
      }
    });
  }

  // Google login button
  const googleBtn = document.querySelector(".google-btn");
  if (googleBtn) {
    googleBtn.addEventListener("click", async function (e) {
      e.preventDefault();
      console.log("Google login clicked");

      try {
        const provider = new firebase.auth.GoogleAuthProvider();
        // Tambahkan scope jika diperlukan
        provider.addScope('profile');
        provider.addScope('email');

        const result = await firebase.auth().signInWithPopup(provider);
        const user = result.user;
        const idToken = await user.getIdToken();

        // Kirim token ke backend untuk verifikasi dan registrasi
        const response = await fetch("http://localhost:8080/googleAuth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`
          },
          body: JSON.stringify({
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL
          })
        });

        const data = await response.json();
        if (data.error) {
          alert("Gagal daftar dengan Google: " + data.message);
        } else {
          alert("Pendaftaran dengan Google berhasil!");
          window.location.href = "index.html";
        }
      } catch (error) {
        console.error("Error saat login dengan Google:", error);
        alert("Terjadi kesalahan saat mencoba daftar dengan Google: " + error.message);
      }
    });
  }

  const googleBtnLogin = document.querySelector(".google-btn-login");

  if (googleBtnLogin) {
    googleBtnLogin.addEventListener("click", async function (e) {
      e.preventDefault();
      console.log("Google login clicked");

      try {
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');

        const result = await firebase.auth().signInWithPopup(provider);
        const user = result.user;
        const idToken = await user.getIdToken();

        // Ganti endpoint dari googleRegister ke googleLogin
        const response = await fetch("http://localhost:8080/googleAuth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`
          },
          body: JSON.stringify({
            uid: user.uid,
            email: user.email
          })
        });

        const data = await response.json();
        if (data.error) {
          alert("Gagal login dengan Google: " + data.message);
        } else {
          alert("Login dengan Google berhasil!");
          localStorage.setItem("token", data.userToken); // Simpan token bila perlu
          window.location.href = "index.html";
        }
      } catch (error) {
        console.error("Error saat login dengan Google:", error);
        alert("Terjadi kesalahan saat login dengan Google: " + error.message);
      }
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


  //login button
  const loginBtnSubmit = document.querySelector(".login-submit-btn");
  if (loginBtnSubmit) {
    loginBtnSubmit.addEventListener("click", async function (e) {
      e.preventDefault();
      console.log("Login manual clicked");

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const response = await fetch("http://localhost:8080/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        });

        const data = await response.json();

        if (data.error) {
          alert("Gagal login: " + data.message);
        } else {
          alert("Login berhasil!");
          // Simpan token kalau perlu
          localStorage.setItem("token", data.userToken); // atau sessionStorage
          // Redirect ke halaman utama atau dashboard
          window.location.href = "index.html";
        }
      } catch (error) {
        console.error("Error saat login:", error);
        alert("Terjadi kesalahan saat login");
      }
    });
  }


});
=======
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
>>>>>>> frontend
