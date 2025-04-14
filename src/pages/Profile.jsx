import { Link } from "react-router-dom";
import topEllipse from "../assets/images/topEllipse.png";
import botEllipse from "../assets/images/botEllipse.png";
import ProfileIcon from "../assets/images/Profile.png";
import Logo from "../assets/images/Logo.png";
import IconRumah from "../assets/images/icon-rumah.svg";
import IconRiwayat from "../assets/images/icon-riwayat.svg";
import IconPrediksi from "../assets/images/icon-prediksi.svg";
import IconProfile from "../assets/images/icon-profile.svg";
import "../css/home.css";
import "../css/style.css";
import "../css/profile.css";
import "../css/editprofile.css"

const ProfilePage = () => {
  return (
    <div className="container">
      <div className="background">
        <img src={topEllipse} alt="" className="top-ellipse" />
        <img src={botEllipse} alt="" className="bottom-ellipse" />
      </div>
      <header>
        <div className="left-header">
          <div className="profile">
            <img src={ProfileIcon} alt="Profile" className="profile-img" />
          </div>
          <nav>
            <ul>
              <li>
                <Link to="/info">Info Kesehatan</Link>
              </li>
              <li>
                <Link to="/prediksi">Prediksi</Link>
              </li>
              <li>
                <Link to="/riwayat">Riwayat</Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="logo-center">
          <Link to="/">
            <img src={Logo} alt="CardioMind Logo" />
          </Link>
        </div>

        <div className="auth-buttons">
          <Link to="/login" className="login-btn">
            Login
          </Link>
          <Link to="/signup" className="signup-btn">
            Sign up
          </Link>
        </div>
      </header>
      <main>
        <div className="profile-container">
          <div className="profile-background"></div>
          <div className="profile-info-container">
            <div className="greeting-container">
              <div className="greeting-text">Hi,</div>
            </div>
            <div className="name-container">
              <div className="name-text">Azka</div>
            </div>
            <div className="email-container">
              <div className="email-text">azka@mail.unpad.ac.id</div>
            </div>
          </div>
          <div
            className="edit-profile-button"
            id="frameContainer1"
            onClick={() => {
              // Add your code here
            }}
          >
            <div className="button-text">Edit Profile</div>
          </div>
          <div className="nav-menu-container">
            <div className="home-menu-item">
              <img className="home-icon" alt="" src={IconRumah} />
              <div className="menu-label-container">
                <div className="menu-label-text">Home</div>
              </div>
            </div>
            <div className="history-menu-item">
              <img className="history-icon" alt="" src={IconRiwayat} />
              <div className="menu-label-container">
                <div className="menu-label-text">Riwayat</div>
              </div>
            </div>
            <div className="prediction-menu-item">
              <img className="prediction-icon" alt="" src={IconPrediksi} />
              <div className="prediction-label-container">
                <div className="menu-label-text">Prediksi</div>
              </div>
            </div>
          </div>
        </div>
        <div className="edit-profile-wrapper">
          <div className="profile-card-background"></div>
          <div className="profile-title-container">
            <b className="profile-title-text">Profile</b>
          </div>
          <img className="profile-avatar" alt="" src={IconProfile} />
          <div className="profile-details-container">
            <div className="detail-label-container">
              <b className="detail-label-text">Nama</b>
            </div>
            <div className="detail-value-container">
              <div className="detail-value-text">Azka Lie</div>
            </div>
            <div className="detail-label-container">
              <b className="detail-label-text">Email</b>
            </div>
            <div className="detail-value-container">
              <div className="detail-value-text">azka@mail.unpad.ac.id</div>
            </div>
            <div className="detail-label-container">
              <b className="detail-label-text">No Telp.</b>
            </div>
            <div className="detail-value-container">
              <div className="detail-value-text">081513989611</div>
            </div>
            <div className="detail-label-container">
              <b className="detail-label-text">Jenis Kelamin</b>
            </div>
            <div className="detail-value-container">
              <div className="detail-value-text">Laki laki</div>
            </div>
            <div className="detail-label-container">
              <b className="detail-label-text">Tanggal Lahir</b>
            </div>
            <div className="detail-value-container">
              <div className="detail-value-text">17-07-2004</div>
            </div>
          </div>
        </div>
      </main>
      <footer>
        <div className="footer-content">
          <p>© CardioMind, 2025 All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default ProfilePage;
