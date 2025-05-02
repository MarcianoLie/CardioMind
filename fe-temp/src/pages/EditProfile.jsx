import React from 'react';
import '../css/editprofile.css';
import IconProfile from "../assets/images/icon-profile.svg"

const EditProfilePage = () => {
  return (
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
  );
};

export default EditProfilePage;