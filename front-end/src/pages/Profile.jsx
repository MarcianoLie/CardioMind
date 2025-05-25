import React, { useEffect, useState, useRef } from 'react';
import { Link } from "react-router-dom";
import "../css/userprofile.css"
import topEllipse from "../assets/images/topEllipse.png";
import botEllipse from "../assets/images/botEllipse.png";
import IconRumah from "../assets/images/icon-rumah.svg";
import IconRiwayat from "../assets/images/icon-riwayat.svg";
import IconPrediksi from "../assets/images/icon-prediksi.svg";
import IconProfile from "../assets/images/icon-profile.svg";

function ProfilePage() {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    dob: '',
    pob: '',
    profileImage: ''
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const profileUploadRef = useRef(null);
  const profileImageRef = useRef(null);

  function capitalizeFirstLetter(string) {
    if (!string) return string;
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // Convert base64 without prefix to data URL
  const formatProfileImage = (base64Data) => {
        if (!base64Data) return profile;
        
        // Jika sudah memiliki prefix data:image
        if (base64Data.startsWith('data:image')) {
          return base64Data;
        }
        
        // Jika sudah URL lengkap (http://)
        if (base64Data.startsWith('http')) {
          const encodedUrl = encodeURIComponent(base64Data);
          return `http://localhost:8080/api/img/${encodedUrl}`;
        }
        
        // Jika base64 tanpa prefix
        return `data:image/jpeg;base64,${base64Data}`;
      };

  // Handle image upload with base64 conversion
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      alert('Harap pilih file gambar (JPEG, PNG)');
      return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
      // Simpan sebagai base64 tanpa prefix
      const base64Data = event.target.result.split(',')[1];
      
      setProfileData(prev => ({
        ...prev,
        profileImage: base64Data
      }));
      
      localStorage.setItem("profileImage", base64Data);
    };
    reader.readAsDataURL(file);
  };

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8080/api/profile", {
        credentials: "include",
      });
      const result = await response.json();

      if (response.ok) {
        setProfileData({
          name: result.user.displayName || '',
          email: result.user.email || '',
          phone: result.user.phone || '',
          dob: result.user.birthDate || '',
          pob: result.user.birthPlace || '',
          gender: result.user.gender || '',
          profileImage: result.user.profileImage || ''
        });
      } else {
        throw new Error(result.message || "Gagal mengambil data profil");
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
      // Fallback ke localStorage jika API error
      loadFromLocalStorage();
    } finally {
      setIsLoading(false);
    }
  };

  // Load data from localStorage as fallback
  const loadFromLocalStorage = () => {
    const savedName = localStorage.getItem("profileName");
    const savedEmail = localStorage.getItem("profileEmail");
    const savedPhone = localStorage.getItem("profilePhone");
    const savedGender = localStorage.getItem("profileGender");
    const savedDOB = localStorage.getItem("profileDOB");
    const savedProfileImage = localStorage.getItem("profileImage");

    setProfileData(prev => ({
      ...prev,
      name: savedName || prev.name || '',
      email: savedEmail || prev.email || '',
      phone: savedPhone || prev.phone || '',
      gender: savedGender || prev.gender || '',
      dob: savedDOB || prev.dob || '',
      pob: prev.pob || '',
      profileImage: savedProfileImage || prev.profileImage || ''
    }));
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString;
    }
  };

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const firstName = profileData.name ? profileData.name.split(" ")[0] : '';

  if (isLoading) {
    return (
      <div className="container">
        <div className="loading-overlay">
          <p>Memuat profil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchProfile}>Coba Lagi</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="background">
        <img src={topEllipse} alt="" className="top-ellipse" />
        <img src={botEllipse} alt="" className="bottom-ellipse" />
      </div>
      
      <main>
        <div className="profile-section">
          {/* Left side card with basic info and icons */}
          <div className="profile-card">
            <div className="profile-header">
              <h2>Hai!,</h2>
              <h1>{capitalizeFirstLetter(firstName)}</h1>
              <p className="profile-email">{profileData.email || 'email@contoh.com'}</p>
              <Link to="/editprofile" className="edit-profile-link">Edit Profile</Link>
            </div>
            
            <div className="profile-nav">
              <div className="nav-item">
                <Link to="/">
                  <img src={IconRumah} alt="Home" />
                  <span>Home</span>
                </Link>
              </div>
              <div className="nav-item">
                <Link to="#">
                  <img src={IconRiwayat} alt="Riwayat" />
                  <span>Riwayat</span>
                </Link>
              </div>
              <div className="nav-item">
                <Link to="/home">
                  <img src={IconPrediksi} alt="Prediksi" />
                  <span>Prediksi</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right side profile section */}
          <div className="edit-profile-section">
            <h2>Profile</h2>
            
            <div className="profile-picture-container">
              <div className="profile-picture">
                <img 
                  src={formatProfileImage(profileData.profileImage)} 
                  alt="User profile" 
                  id="profile-image"
                  ref={profileImageRef}
                  onError={(e) => {
                    e.target.src = IconProfile;
                  }}
                />
              </div>
            </div>
            
            <div className="profile-details">
              <div className="detail-group">
                <label>Nama</label>
                <p className="detail-value" id="profile-name">
                  {profileData.name || '-'}
                </p>
              </div>
              
              <div className="detail-group">
                <label>Email</label>
                <p className="detail-value" id="profile-email">
                  {profileData.email || '-'}
                </p>
              </div>
              
              <div className="detail-group">
                <label>No Telp.</label>
                <p className="detail-value" id="profile-phone">
                  {profileData.phone || '-'}
                </p>
              </div>
              
              <div className="detail-group">
                <label>Tempat Lahir</label>
                <p className="detail-value" id="profile-pob">
                  {profileData.pob || '-'}
                </p>
              </div>
              
              <div className="detail-group">
                <label>Tanggal Lahir</label>
                <p className="detail-value" id="profile-dob">
                  {formatDate(profileData.dob) || '-'}
                </p>
              </div>
              
              <Link to="/editprofile" id="edit-btn">Edit Profile</Link>
            </div>
          </div>
        </div>
      </main>
      
      {/* Hidden file upload input for profile image */}
      <input 
        type="file" 
        id="profile-upload" 
        style={{ display: 'none' }} 
        ref={profileUploadRef}
        onChange={handleImageUpload}
        accept="image/*"
      />
    </div>
  );
}

export default ProfilePage;