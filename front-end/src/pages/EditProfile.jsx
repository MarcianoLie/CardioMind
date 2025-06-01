import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import SavedIcon from "../assets/images/saved.png";
import IconRumah from "../assets/images/icon-rumah.svg";
import IconRiwayat from "../assets/images/icon-riwayat.svg";
import IconPrediksi from "../assets/images/icon-prediksi.svg";
import IconProfile from "../assets/images/icon-profile.svg";
import IconEdit from "../assets/images/pen.png";
import topEllipse from "../assets/images/topEllipse.png";
import botEllipse from "../assets/images/botEllipse.png";

function EditProfile() {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    pob: '',
    dob: '',
    profileImage: ''
  });

  const [showSavedPopup, setShowSavedPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const profileUploadRef = useRef(null);
  const profileImageRef = useRef(null);

  // Utility function to capitalize first letter of a string
  function capitalizeFirstLetter(string) {
    if (!string) return string;
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // Format date for input[type="date"]
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toISOString().split('T')[0];
    } catch (e) {
      console.error("Error formatting date:", e);
      return '';
    }
  };

  // Fetch profile data from API
  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/profile`, {
        credentials: "include",
      });
      const result = await response.json();

      if (response.ok && result.user) {
        setProfileData({
          name: result.user.displayName || '',
          email: result.user.email || '',
          phone: result.user.phone || '',
          dob: formatDateForInput(result.user.birthDate),
          pob: result.user.birthPlace || '',
          profileImage: result.user.profileImage || 'assets/images/Profile.png'
        });
      } else {
        throw new Error(result.message || "Gagal mengambil data profil");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError(error.message);
      // Fallback to localStorage if API fails
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
    const savedpob = localStorage.getItem("profilepob");
    const savedDOB = localStorage.getItem("profileDOB");
    const savedProfileImage = localStorage.getItem("profileImage");

    setProfileData(prev => ({
      ...prev,
      name: prev.name || savedName || '',
      email: prev.email || savedEmail || '',
      phone: prev.phone || savedPhone || '',
      pob: prev.pob || savedpob || '',
      dob: prev.dob || savedDOB || '',
      profileImage: prev.profileImage || savedProfileImage || 'assets/images/Profile.png'
    }));
  };
  const renameJpgToJpeg = (file) => {
    if (file.name.toLowerCase().endsWith('.jpg')) {
      // Buat file baru dengan ekstensi .jpeg dan tipe image/jpeg
      return new File([file], file.name.replace(/\.jpg$/i, '.jpeg'), { type: 'image/jpeg' });
    }
    return file;
  };

  // Handle image upload with compression
  const compressImage = (file, { quality = 0.7, maxWidth = 800 } = {}) => {
    return new Promise((resolve) => {
      const inputFile = renameJpgToJpeg(file);
      const reader = new FileReader();
      reader.readAsDataURL(inputFile);

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              const compressedReader = new FileReader();
              compressedReader.readAsDataURL(blob);
              compressedReader.onloadend = () => {
                const base64Result = compressedReader.result;

                // 🟡 Log hasil MIME type untuk debugging
                console.log("Compressed Image MIME:", base64Result.slice(0, 50));
                console.log("Estimated size KB:", Math.round(base64Result.length * 3 / 4 / 1024));

                // 🔧 (Opsional) Perbaiki jika MIME `image/jpg`
                const fixedBase64 = base64Result.replace(/^data:image\/jpg/, 'data:image/jpeg');

                resolve(fixedBase64);
              };
            },
            'image/jpeg',
            quality
          );
        };
      };
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      alert('Harap pilih file gambar (JPEG, PNG)');
      return;
    }

    try {
      // Kompresi gambar sebelum disimpan
      const compressedImage = await compressImage(file, {
        quality: 0.7,
        maxWidth: 800
      });

      setProfileData(prev => ({
        ...prev,
        profileImage: compressedImage
      }));

      // Simpan ke localStorage
      localStorage.setItem("newProfileImage", compressedImage);
    } catch (error) {
      console.error('Error compressing image:', error);
      alert('Gagal memproses gambar');
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;

    const fieldMapping = {
      'nama': 'name',
      'email': 'email',
      'telp': 'phone',
      'pob': 'pob',
      'dob': 'dob'
    };

    setProfileData(prev => ({
      ...prev,
      [fieldMapping[id]]: value
    }));
  };

  // Save profile data to API
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // Siapkan data tanpa profileImage dulu
      const userNewData = {
        displayName: profileData.name,
        birthPlace: profileData.pob,
        birthDate: profileData.dob,
        phone: profileData.phone
      };

      // Kirim data profil dulu
      const profileResponse = await fetch(`${process.env.BACKEND_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userNewData),
      });

      const profileResult = await profileResponse.json();

      if (!profileResponse.ok) {
        throw new Error(profileResult.message || "Gagal menyimpan profil");
      }

      // Jika ada gambar, upload terpisah
      if (profileData.profileImage && profileData.profileImage.startsWith('data:')) {
        await uploadImage(profileData.profileImage);
      }

      // Simpan ke localStorage
      localStorage.setItem("profileName", profileData.name);
      localStorage.setItem("profileEmail", profileData.email);
      localStorage.setItem("profilePhone", profileData.phone);
      localStorage.setItem("profilepob", profileData.pob);
      localStorage.setItem("profileDOB", profileData.dob);
      localStorage.setItem("profileImage", profileData.profileImage);

      setShowSavedPopup(true);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Terjadi kesalahan saat menyimpan: ' + error.message);
    }
  };
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
          return `${process.env.BACKEND_URL}/api/img/${encodedUrl}`;
        }
        
        // Jika base64 tanpa prefix
        return `data:image/jpeg;base64,${base64Data}`;
      };

  // Fungsi khusus untuk upload gambar
  const uploadImage = async (base64Image) => {
    try {
      // Potong prefix base64 jika ada
      const base64Data = base64Image.split(',')[1] || base64Image;
      localStorage.setItem("profileImage",base64Data)

      const response = await fetch(`${process.env.BACKEND_URL}/api/updateImage`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ profileImage: base64Data }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengunggah gambar");
      }

      return result;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
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

  // Initialize component
  useEffect(() => {
    localStorage.setItem("newProfileImage",null)
    localStorage.setItem("newProfileImage",localStorage.getItem("profileImage"))
    fetchProfile();
  }, []);

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const firstName = profileData.name ? profileData.name.split(" ")[0] : '';

  if (isLoading) {
    return (
      <div className="container">
        <div className="loading-overlay">
          <p>Memuat data profil...</p>
        </div>
      </div>
    );
  }
  console.log(profileData.profileImage)

  return (
    <div className="container">
      <div className="background">
        <img src={topEllipse} alt="" className="top-ellipse" />
        <img src={botEllipse} alt="" className="bottom-ellipse" />
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchProfile}>Coba Lagi</button>
        </div>
      )}

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
                  // src={formatProfileImage(profileData.profileImage)}
                  src={localStorage.getItem("newProfileImage")||formatProfileImage((!profileData.profileImage)
                                        ? profile
                                        : (profileData.profileImage.startsWith('http')
                                            ? profileData.profileImage
                                            : "data:image/jpeg;base64," + profileData.profileImage))}
                  alt="User profile picture"
                  id="profile-image"
                  ref={profileImageRef}
                  onError={(e) => {
                    e.target.src = 'assets/images/Profile.png';
                  }}
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

            <form id="edit-profile-form" onSubmit={handleSave}>
              <div className="form-group">
                <label htmlFor="nama">Nama</label>
                <div className="input-with-edit">
                  <input
                    type="text"
                    id="nama"
                    value={profileData.name}
                    onChange={handleInputChange}
                    required
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
                    readOnly
                  />
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
                    required
                  />
                  <button type="button" className="edit-btn" onClick={handleEditClick}>
                    <img src={IconEdit} alt="Edit" />
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="pob">Tempat Lahir</label>
                <div className="input-with-edit">
                  <input
                    id="pob"
                    name="pob"
                    value={profileData.pob}
                    onChange={handleInputChange}
                  />
                  <button type="button" className="edit-btn" onClick={handleEditClick}>
                    <img src={IconEdit} alt="Edit" />
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="dob">Tanggal Lahir</label>
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

              <button type="submit" id="confirm-btn">Simpan Perubahan</button>
            </form>
          </div>
        </div>
      </main>

      {/* Saved Popup */}
      <div className={`saved-popup ${showSavedPopup ? 'show' : ''}`} id="saved-popup">
        <div className="popup-content">
          <img src={SavedIcon} alt="Saved" />
          <h3>Perubahan Disimpan</h3>
          <button id="thanks-btn" onClick={handleThanksClick}>OK</button>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;