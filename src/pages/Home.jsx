import React from "react";
import { Link } from "react-router-dom"; 

function Home() {
  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h1 style={styles.h1}>Welcome to CardioMind</h1>
        <p style={styles.p}>Please login or sign up to continue.</p>
        <div style={styles.buttons}>
          <Link to="/login" style={styles.loginBtn}>
            Login
          </Link>
          <Link to="/signup" style={styles.signupBtn}>
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

//CSS
const styles = {
  body: {
    margin: 0,
    padding: 0,
    fontFamily: '"Plus Jakarta Sans", Arial, sans-serif',
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5"
  },
  container: {
    textAlign: "center"
  },
  h1: {
    color: "#2b7a0b",
    marginBottom: "20px"
  },
  p: {
    marginBottom: "30px",
    color: "#333"
  },
  buttons: {
    display: "flex",
    gap: "20px",
    justifyContent: "center"
  },
  loginBtn: {
    padding: "10px 20px",
    background: "transparent",
    border: "1px solid #000",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    textDecoration: "none",
    color: "#000"
  },
  signupBtn: {
    padding: "10px 20px",
    background: "#2b7a0b",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    textDecoration: "none"
  }
};

export default Home;