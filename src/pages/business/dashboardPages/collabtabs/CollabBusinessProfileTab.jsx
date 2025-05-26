import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import "./CollabBusinessProfileTab.css";

export default function CollabBusinessProfileTab({
  initialProfileData,
  initialProfileImage,
  setShowBusinessChat,
}) {
  const [profileData, setProfileData] = useState(initialProfileData);
  const [logoPreview, setLogoPreview] = useState(initialProfileImage);
  const [logoFile, setLogoFile] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData(e.target);
    const updatedData = {
      businessName: formData.get("businessName"),
      category: formData.get("category"),
      area: formData.get("area"),
      about: formData.get("about"),
      collabPref: formData.get("collabPref"),
      contact: formData.get("contact"),
      phone: formData.get("phone"),
      email: formData.get("email"),
    };

    try {
      // אם יש לוגו חדש, טען אותו קודם
      if (logoFile) {
        const logoFormData = new FormData();
        logoFormData.append("logo", logoFile);

        const logoRes = await fetch("/api/business/my/logo", {
          method: "PUT",
          body: logoFormData,
          credentials: "include",
        });
        if (!logoRes.ok) throw new Error("שגיאה בהעלאת הלוגו");
        const logoJson = await logoRes.json();

        // עדכון הלוגו בנתונים
        updatedData.logo = logoJson.logo;
      }

      // שמירת שאר הנתונים בפרופיל
      const res = await fetch("/api/business/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error("שגיאה בעדכון הפרופיל");

      const json = await res.json();

      // עדכון הסטייט המקומי עם הנתונים המעודכנים מהשרת
      setProfileData((prev) => ({
        ...prev,
        ...updatedData,
      }));

      setShowEditProfile(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
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
              <button
                className="collab-form-button"
                onClick={() => setShowEditProfile(true)}
              >
                ✏️ עריכת פרופיל
              </button>
              <button
                className="collab-form-button"
                onClick={() => setShowBusinessChat(true)}
              >
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
            <p>
              <strong>איש קשר:</strong> {profileData.contact}
            </p>
            <p>
              <strong>טלפון:</strong> {profileData.phone}
            </p>
            <p>
              <strong>אימייל:</strong> {profileData.email}
            </p>
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
          <h3 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            עריכת פרופיל עסקי
          </h3>

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
              <p style={{ fontSize: "0.9rem", color: "#666" }}>
                לחץ על הלוגו כדי לשנות
              </p>
            </div>

            <div>
              <label>שם העסק</label>
              <input
                name="businessName"
                defaultValue={profileData.businessName}
                required
              />
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
              <textarea
                name="collabPref"
                defaultValue={profileData.collabPref}
                rows="3"
              />
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
              <button
                type="submit"
                className="collab-form-button"
                disabled={saving}
              >
                {saving ? "שומר..." : "💾 שמירה"}
              </button>
              <button
                type="button"
                className="collab-form-button secondary"
                onClick={() => setShowEditProfile(false)}
                disabled={saving}
              >
                ❌ ביטול
              </button>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
}
