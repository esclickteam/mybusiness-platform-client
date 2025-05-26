import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import "./CollabBusinessProfileTab.css";

export default function CollabBusinessProfileTab({ setShowBusinessChat }) {
  const [profileData, setProfileData] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. טוען את הפרופיל מהשרת
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/business/my", { credentials: "include" });
      const data = await res.json();
      if (data.business) {
        setProfileData(data.business);
        setLogoPreview(data.business.logo || null);
      }
    } catch (e) {
      alert("שגיאה בטעינת פרטי העסק");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // 2. שינוי לוגו
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  // 3. שמירת הפרופיל
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
      // עדכון לוגו (אם שונה)
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
        updatedData.logo = logoJson.logo;
      }

      // עדכון נתונים כלליים
      const res = await fetch("/api/business/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error("שגיאה בעדכון הפרופיל");

      // שליפה מחדש מהשרת כדי להבטיח נתונים עדכניים
      await fetchProfile();
      setShowEditProfile(false);
      setLogoFile(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  // 4. מצב טעינה או חוסר נתונים
  if (loading || !profileData) {
    return <div style={{ textAlign: "center", margin: "2em" }}>טוען...</div>;
  }

  // 5. ערכי ברירת מחדל
  const safeProfile = {
    businessName: profileData?.businessName || "שם לא זמין",
    category: profileData?.category || "קטגוריה לא זמינה",
    area: profileData?.area || "אזור לא זמין",
    about: profileData?.about || "אין תיאור",
    collabPref: profileData?.collabPref || "",
    contact: profileData?.contact || "-",
    phone: profileData?.phone || "-",
    email: profileData?.email || "-",
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
              <h2 className="business-name">{safeProfile.businessName}</h2>
              <p className="business-category">{safeProfile.category}</p>
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
            <p>{safeProfile.area}</p>
          </div>
          <div className="business-section">
            <h4>📝 על העסק:</h4>
            <p>{safeProfile.about}</p>
          </div>
          <div className="business-section">
            <h4>🤝 שיתופי פעולה רצויים:</h4>
            <ul>
              {safeProfile.collabPref.split("\n").map((line, index) => (
                <li key={index}>{line}</li>
              ))}
            </ul>
          </div>
          <div className="business-section">
            <h4>📞 פרטי קשר:</h4>
            <p>
              <strong>איש קשר:</strong> {safeProfile.contact}
            </p>
            <p>
              <strong>טלפון:</strong> {safeProfile.phone}
            </p>
            <p>
              <strong>אימייל:</strong> {safeProfile.email}
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
                defaultValue={safeProfile.businessName}
                required
              />
            </div>
            <div>
              <label>תחום</label>
              <input name="category" defaultValue={safeProfile.category} required />
            </div>
            <div>
              <label>אזור פעילות</label>
              <input name="area" defaultValue={safeProfile.area} required />
            </div>
            <div>
              <label>על העסק</label>
              <textarea name="about" defaultValue={safeProfile.about} rows="3" />
            </div>
            <div>
              <label>שיתופי פעולה רצויים</label>
              <textarea
                name="collabPref"
                defaultValue={safeProfile.collabPref}
                rows="3"
              />
            </div>
            <div>
              <label>שם איש קשר</label>
              <input name="contact" defaultValue={safeProfile.contact} required />
            </div>
            <div>
              <label>טלפון</label>
              <input name="phone" defaultValue={safeProfile.phone} required />
            </div>
            <div>
              <label>אימייל</label>
              <input name="email" defaultValue={safeProfile.email} required />
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
