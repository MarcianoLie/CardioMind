import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";
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
    profileImage: ''
  });
  
  const profileUploadRef = useRef(null);
  const profileImageRef = useRef(null);
  const profileImagesRef = useRef([]);
  
  // Utility function to capitalize first letter of a string
  function capitalizeFirstLetter(string) {
    if (!string) return string;
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        // Update state
        setProfileData(prev => ({
          ...prev,
          profileImage: event.target.result
        }));
        
        // Store in localStorage to persist across pages
        localStorage.setItem("profileImage", event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const fetchProfile = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/profile", {
        credentials: "include", // agar session (userId) dikirim
      });
      const result = await response.json();
      console.log(result)

      if (response.ok) {
        console.log(result.data);
        // console.log("ini data"+result.user.email);
        setProfileData({
          name: result.user.displayName || '',
          email: result.user.email || '',
          phone: result.user.phone || '',
          dob: result.user.birthDate || '',
          pob: result.user.birthPlace || '',
          profileImage: result.user.profileImage || 'assets/images/Profile.png', // fallback image jika kosong
        });
      } else {
        console.error("Gagal mengambil data:", result.message);
      }
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
    console.log("a")
    // Load profile data from localStorage if available
    const savedName = localStorage.getItem("profileName");
    const savedEmail = localStorage.getItem("profileEmail");
    const savedPhone = localStorage.getItem("profilePhone");
    const savedGender = localStorage.getItem("profileGender");
    const savedDOB = localStorage.getItem("profileDOB");
    const savedProfileImage = localStorage.getItem("profileImage");
    
    setProfileData({
      name: savedName || '',
      email: savedEmail || '',
      phone: savedPhone || '',
      gender: savedGender || '',
      dob: savedDOB || '',
      profileImage: savedProfileImage || 'assets/images/Profile.png'
    });
  }, []);
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      // Format as DD-MM-YYYY
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    }
    return dateString;
  };
  
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const firstName = profileData.name ? profileData.name.split(" ")[0] : 'Azka';

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
              <p className="profile-email">{profileData.email || 'azka@mail.unpad.ac.id'}</p>
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
                  src={profileData.profileImage || {IconProfile}} 
                  alt="User profile picture" 
                  id="profile-image"
                  ref={profileImageRef}
                />
              </div>
            </div>
            
            <div className="profile-details">
              <div className="detail-group">
                <label>Nama</label>
                <p className="detail-value" id="profile-name">
                  {profileData.name || 'Azka Lie'}
                </p>
              </div>
              
              <div className="detail-group">
                <label>Email</label>
                <p className="detail-value" id="profile-email">
                  {profileData.email || 'azka@mail.unpad.ac.id'}
                </p>
              </div>
              
              <div className="detail-group">
                <label>No Telp.</label>
                <p className="detail-value" id="profile-phone">
                  {profileData.phone || '081513989611'}
                </p>
              </div>
              
              <div className="detail-group">
                <label>Tempat Lahir</label>
                <p className="detail-value" id="profile-gender">
                  {profileData.pob || 'Jakarta'}
                </p>
              </div>
              
              <div className="detail-group">
                <label>Tanggal Lahir</label>
                <p className="detail-value" id="profile-dob">
                  {formatDate(profileData.dob) || '17-07-2004'}
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
      />
    </div>
  );
}

export default ProfilePage;