// AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import styles from "../css/admin-dashboard.module.css";
import Dashboard from "../assets/images/dashboard.png";
import UserIcon from "../assets/images/adminuser.png";
import DokterIcon from "../assets/images/admindokter.png";
import NewsIcon from "../assets/images/totalnews.png";
import { Link, useNavigate } from "react-router-dom";
import LogoDesktop from "../assets/images/Logo.png";
import LogoMobile from "../assets/images/logo-mobile.svg";

const AdminDashboard = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); 

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/check-session", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();
        if (data.status === "admin") {
          setIsAuthorized(true);
        } else {
          navigate("/"); 
        }
      } catch (error) {
        console.error("Error checking session:", error);
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthorized) {
    return null; 
  }

  return (
    <div className={styles.containerAdminDashboard}>
      {/* Sidebar */}
      <aside className={styles.sidebarAdminDashboard}>
        <img
          src={LogoDesktop}
          alt="CardioMind Logo"
          className={`${styles.logo} ${styles.logoFull}`}
        />
        <img
          src={LogoMobile}
          alt="CardioMind Icon"
          className={`${styles.logo} ${styles.logoIcon}`}
        />
        <nav className={styles.navLinks}>
          <Link to="/AdminDashboard" className={`${styles.navItem} ${styles.active}`}>
            <img src={Dashboard} alt="Dashboard Icon" />
            <span>Dashboard</span>
          </Link>
          <Link to="/AdminUser" className={styles.navItem}>
            <img src={UserIcon} alt="User Icon" />
            <span>Users</span>
          </Link>
          <Link to="/AdminDokter" className={styles.navItem}>
            <img src={DokterIcon} alt="Doctor Icon" />
            <span>Doctors</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContentAdmin}>
        <h1 className={styles.pageTitle}>Dashboard</h1>

        <div className={styles.cardsContainer}>
          <div className={styles.card}>
            <div className={styles.cardContent}>
              <div className={styles.cardTitle}>Total Users</div>
              <div className={styles.cardValue}>156</div>
            </div>
            <img src={UserIcon} alt="User Icon" className={styles.cardIcon} />
          </div>

          <div className={styles.card}>
            <div className={styles.cardContent}>
              <div className={styles.cardTitle}>Total Doctors</div>
              <div className={styles.cardValue}>24</div>
            </div>
            <img src={DokterIcon} alt="Doctor Icon" className={styles.cardIcon} />
          </div>

          <div className={styles.card}>
            <div className={styles.cardContent}>
              <div className={styles.cardTitle}>Total News</div>
              <div className={styles.cardValue}>32</div>
            </div>
            <img src={NewsIcon} alt="News Icon" className={styles.cardIcon} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
