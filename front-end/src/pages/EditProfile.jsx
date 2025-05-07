import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import SavedIcon from "../assets/images/saved.png"
import IconRumah from "../assets/images/icon-rumah.svg";
import IconRiwayat from "../assets/images/icon-riwayat.svg";
import IconPrediksi from "../assets/images/icon-prediksi.svg";
import IconProfile from "../assets/images/icon-profile.svg";
import IconEdit from "../assets/images/pen.png";
import topEllipse from "../assets/images/topEllipse.png";
import botEllipse from "../assets/images/botEllipse.png";


function EditProfile() {
  const [profileData, setProfileData] = useState({
    name: 'Azka Lie',
    email: 'azka@mail.unpad.ac.id',
    phone: '081513989611',
    gender: 'Laki-laki',
    dob: '',
    profileImage: 'assets/images/Profile.png'
  });
  
  const [showSavedPopup, setShowSavedPopup] = useState(false);
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
        // Update state with new image
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
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    
    // Map field IDs to state keys
    const fieldMapping = {
      'nama': 'name',
      'email': 'email',
      'telp': 'phone',
      'gender': 'gender',
      'dob': 'dob'
    };
    
    setProfileData(prev => ({
      ...prev,
      [fieldMapping[id]]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save to localStorage for persistence
    localStorage.setItem("profileName", profileData.name);
    localStorage.setItem("profileEmail", profileData.email);
    localStorage.setItem("profilePhone", profileData.phone);
    localStorage.setItem("profileGender", profileData.gender);
    localStorage.setItem("profileDOB", profileData.dob);
    
    // Show success popup
    setShowSavedPopup(true);
    
    // Set timeout to redirect to profile page after showing the popup
    setTimeout(() => {
      window.location.href = "profile.html";
    }, 2000);
  };
  
  // Handle "Thanks!" button click in popup
  const handleThanksClick = () => {
    setShowSavedPopup(false);
    window.location.href = "/profile";
  };
  
  // Handle edit button clicks (focus on the input)
  const handleEditClick = (e) => {
    const input = e.target.closest('.edit-btn').previousElementSibling;
    if (input) {
      input.focus();
      input.select();
    }
  };
  
  // Dropdown toggle handler
  const handleDropdownToggle = (e) => {
    e.preventDefault();
    const dropdownMenu = e.target.nextElementSibling;
    if (dropdownMenu) {
      dropdownMenu.style.display = dropdownMenu.style.display === 'flex' ? 'none' : 'flex';
    }
  };
  
  // Handle logout
  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.setItem("isLoggedIn", "false");
    window.location.href = "/";
  };
  
  useEffect(() => {
    // Load profile data from localStorage if available
    const savedName = localStorage.getItem("profileName");
    const savedEmail = localStorage.getItem("profileEmail");
    const savedPhone = localStorage.getItem("profilePhone");
    const savedGender = localStorage.getItem("profileGender");
    const savedDOB = localStorage.getItem("profileDOB");
    const savedProfileImage = localStorage.getItem("profileImage");
    
    setProfileData(prev => ({
      ...prev,
      name: savedName || prev.name,
      email: savedEmail || prev.email,
      phone: savedPhone || prev.phone,
      gender: savedGender || prev.gender,
      dob: savedDOB || prev.dob,
      profileImage: savedProfileImage || prev.profileImage
    }));
  }, []);
  
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
              <h2>Hi,</h2>
              <h1>{capitalizeFirstLetter(firstName)}</h1>
              <p className="profile-email">{profileData.email}</p>
            </div>
            
            <div className="profile-nav">
              <div className="nav-item">
                <Link to="/">
                  <img src={IconRumah} alt="Home" />
                  <span>Home</span>
                </Link>
              </div>
              <div className="nav-item">
                <Link to="/">
                  <img src={IconRiwayat} alt="Riwayat" />
                  <span>Riwayat</span>
                </Link>
              </div>
              <div className="nav-item">
                <Link to="/">
                  <img src={IconPrediksi} alt="Prediksi" />
                  <span>Prediksi</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right side edit profile section */}
          <div className="edit-profile-section">
            <h2>Profile</h2>
            
            <div className="profile-picture-container">
              <div className="profile-picture">
                <img 
                  src={profileData.profileImage} 
                  alt="User profile picture" 
                  id="profile-image"
                  ref={profileImageRef}
                />
                <label htmlFor="profile-upload" className="upload-overlay">
                  <img src={IconEdit} alt="Edit" className="edit-icon" />
                </label>
                <input 
                  type="file" 
                  id="profile-upload" 
                  accept="image/*" 
                  style={{ display: 'none' }}
                  ref={profileUploadRef}
                  onChange={handleImageUpload}
                />
              </div>
            </div>
            
            <form id="edit-profile-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nama">Nama</label>
                <div className="input-with-edit">
                  <input
                    type="text"
                    id="nama"
                    value={profileData.name}
                    onChange={handleInputChange}
                  />
                  <button type="button" className="edit-btn" onClick={handleEditClick}>
                    <img src={IconEdit} alt="Edit" />
                  </button>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-with-edit">
                  <input
                    type="email"
                    id="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                  />
                  <button type="button" className="edit-btn" onClick={handleEditClick}>
                    <img src={IconEdit} alt="Edit" />
                  </button>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="telp">No Telp.</label>
                <div className="input-with-edit">
                  <input
                    type="tel"
                    id="telp"
                    value={profileData.phone}
                    onChange={handleInputChange}
                  />
                  <button type="button" className="edit-btn" onClick={handleEditClick}>
                    <img src={IconEdit} alt="Edit" />
                  </button>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <div className="input-with-edit">
                  <select
                    id="gender"
                    name="gender"
                    value={profileData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                  <button type="button" className="edit-btn" onClick={handleEditClick}>
                    <img src={IconEdit} alt="Edit" />
                  </button>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="dob">Date of Birth</label>
                <div className="input-with-edit">
                  <input
                    type="date"
                    id="dob"
                    name="dob"
                    value={profileData.dob}
                    onChange={handleInputChange}
                  />
                  <button type="button" className="edit-btn" onClick={handleEditClick}>
                    <img src={IconEdit} alt="Edit" className="edit-icon" />
                  </button>
                </div>
              </div>
              
              <button type="submit" id="confirm-btn">Confirm</button>
            </form>
          </div>
        </div>
      </main>

      {/* Saved Popup */}
      <div className={`saved-popup ${showSavedPopup ? 'show' : ''}`} id="saved-popup">
        <div className="popup-content">
          <img src={SavedIcon} alt="Saved" />
          <h3>Saved</h3>
          <button id="thanks-btn" onClick={handleThanksClick}>Thanks!</button>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;