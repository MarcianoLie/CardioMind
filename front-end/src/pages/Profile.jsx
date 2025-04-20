import { Link } from "react-router-dom";
import "../css/home.css";
import "../css/style.css";
import "../css/profile.css";
import "../css/editprofile.css";

// Images
import topEllipse from "../assets/images/topEllipse.png";
import botEllipse from "../assets/images/botEllipse.png";
import ProfileIcon from "../assets/images/Profile.png";
import Logo from "../assets/images/Logo.png";
import IconRumah from "../assets/images/icon-rumah.svg";
import IconRiwayat from "../assets/images/icon-riwayat.svg";
import IconPrediksi from "../assets/images/icon-prediksi.svg";
import IconProfile from "../assets/images/icon-profile.svg";

// Component untuk menu navigasi
// Mempertahankan struktur yang sama dengan CSS yang ada
const NavigationMenu = () => {
  return (
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
  );
};

// Component untuk detail profil
const ProfileDetail = ({ label, value }) => {
  return (
    <>
      <div className="detail-label-container">
        <b className="detail-label-text">{label}</b>
      </div>
      <div className="detail-value-container">
        <div className="detail-value-text">{value}</div>
      </div>
    </>
  );
};

// Component utama ProfilePage
const ProfilePage = () => {
  const userInfo = {
    name: "Azka Lie",
    shortName: "Azka",
    email: "azka@mail.unpad.ac.id",
    phone: "081513989611",
    gender: "Laki laki",
    birthDate: "17-07-2004"
  };

  const handleEditProfile = () => {
    // Implementasi fungsi edit profile di sini
    console.log("Edit profile clicked");
  };

  return (
    <div className="container">
      {/* Background Elements */}
      <div className="background">
        <img src={topEllipse} alt="" className="top-ellipse" />
        <img src={botEllipse} alt="" className="bottom-ellipse" />
      </div>
      
      <main>
        {/* Profile Information Section */}
        <div className="profile-container">
          <div className="profile-background"></div>
          
          <div className="profile-info-container">
            <div className="greeting-container">
              <div className="greeting-text">Hi,</div>
            </div>
            <div className="name-container">
              <div className="name-text">{userInfo.shortName}</div>
            </div>
            <div className="email-container">
              <div className="email-text">{userInfo.email}</div>
            </div>
          </div>
          
          <div
            className="edit-profile-button"
            id="frameContainer1"
            onClick={handleEditProfile}
          >
            <div className="button-text">Edit Profile</div>
          </div>
          
          <NavigationMenu />
        </div>
        
        {/* Detailed Profile Card */}
        <div className="edit-profile-wrapper">
          <div className="profile-card-background"></div>
          
          <div className="profile-title-container">
            <b className="profile-title-text">Profile</b>
          </div>
          
          <img className="profile-avatar" alt="Profile" src={IconProfile} />
          
          <div className="profile-details-container">
            <ProfileDetail label="Nama" value={userInfo.name} />
            <ProfileDetail label="Email" value={userInfo.email} />
            <ProfileDetail label="No Telp." value={userInfo.phone} />
            <ProfileDetail label="Jenis Kelamin" value={userInfo.gender} />
            <ProfileDetail label="Tanggal Lahir" value={userInfo.birthDate} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;