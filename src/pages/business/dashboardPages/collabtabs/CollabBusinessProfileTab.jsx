import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import "./CollabBusinessProfileTab.css";

export default function CollabBusinessProfileTab({
  profileData,
  profileImage,
  setShowEditProfile,
  setShowBusinessChat,
  handleSaveProfile,
  showEditProfile
}) {
  const [logoPreview, setLogoPreview] = useState(profileImage);
  const [logoFile, setLogoFile] = useState(null); // אם תרצה לשמור לשרת

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  return (
    <>
      <div className="collab-section">
        <h3 className="collab-title">📇 פרופיל עסקי</h3>

        <div className="business-profile-card">
          <div className="business-header">
            <label htmlFor="logo-upload" style={{ cursor: "pointer" }}>
              <img
                src={logoPreview || "https://via.placeholder.com/150"}
                alt="לוגו העסק"
                className="business-logo"
              />
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleLogoChange}
              />
            </label>

            <div className="business-header-text">
              <h2 className="business-name">{profileData.businessName}</h2>
              <p className="business-category">{profileData.category}</p>
            </div>

            <div className="flex gap-2">
              <button className="collab-form-button" onClick={() => setShowEditProfile(true)}>
                ✏️ עריכת פרופיל
              </button>
              <button className="collab-form-button" onClick={() => setShowBusinessChat(true)}>
                💬 הודעות עסקיות
              </button>
            </div>
          </div>

          <div className="business-section">
            <h4>📍 אזור פעילות:</h4>
            <p>{profileData.area}</p>
          </div>

          <div className="business-section">
            <h4>📝 על העסק:</h4>
            <p>{profileData.about}</p>
          </div>

          <div className="business-section">
            <h4>🤝 שיתופי פעולה רצויים:</h4>
            <ul>
              {profileData.collabPref?.split("\n").map((line, index) => (
                <li key={index}>{line}</li>
              ))}
            </ul>
          </div>

          <div className="business-section">
            <h4>📞 פרטי קשר:</h4>
            <p><strong>איש קשר:</strong> {profileData.contact}</p>
            <p><strong>טלפון:</strong> {profileData.phone}</p>
            <p><strong>אימייל:</strong> {profileData.email}</p>
          </div>
        </div>
      </div>

      <Modal open={showEditProfile} onClose={() => setShowEditProfile(false)}>
        <Box
          sx={{
            direction: "rtl",
            backgroundColor: "#fff",
            padding: "2rem",
            borderRadius: "1rem",
            maxWidth: "500px",
            width: "90%",
            maxHeight: "90vh",
            overflowY: "auto",
            margin: "5% auto",
            boxShadow: 5,
          }}
        >
          <h3 style={{ textAlign: "center", marginBottom: "1.5rem" }}>עריכת פרופיל עסקי</h3>

          <form onSubmit={handleSaveProfile} className="styled-form">
            <div style={{ textAlign: "center" }}>
              <label htmlFor="logo-upload-modal" style={{ cursor: "pointer" }}>
                <img
                  src={logoPreview || "https://via.placeholder.com/150"}
                  alt="לוגו העסק"
                  className="business-logo"
                  style={{ marginBottom: "1rem" }}
                />
              </label>
              <input
                id="logo-upload-modal"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleLogoChange}
              />
              <p style={{ fontSize: "0.9rem", color: "#666" }}>לחץ על הלוגו כדי לשנות</p>
            </div>

            <div>
              <label>שם העסק</label>
              <input name="businessName" defaultValue={profileData.businessName} required />
            </div>

            <div>
              <label>תחום</label>
              <input name="category" defaultValue={profileData.category} required />
            </div>

            <div>
              <label>אזור פעילות</label>
              <input name="area" defaultValue={profileData.area} required />
            </div>

            <div>
              <label>על העסק</label>
              <textarea name="about" defaultValue={profileData.about} rows="3" />
            </div>

            <div>
              <label>שיתופי פעולה רצויים</label>
              <textarea name="collabPref" defaultValue={profileData.collabPref} rows="3" />
            </div>

            <div>
              <label>שם איש קשר</label>
              <input name="contact" defaultValue={profileData.contact} required />
            </div>

            <div>
              <label>טלפון</label>
              <input name="phone" defaultValue={profileData.phone} required />
            </div>

            <div>
              <label>אימייל</label>
              <input name="email" defaultValue={profileData.email} required />
            </div>

            <div className="modal-buttons">
              <button type="submit" className="collab-form-button">💾 שמירה</button>
              <button type="button" className="collab-form-button secondary" onClick={() => setShowEditProfile(false)}>❌ ביטול</button>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
}
