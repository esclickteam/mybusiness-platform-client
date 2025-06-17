import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import API from "../../../../api";
import CollabChat from "./CollabChat";
import "./CollabBusinessProfileTab.css";

// הוספת ייבוא useAi ו-AiModal
import { useAi } from "../../../../context/AiContext";
import AiModal from "../../../../components/AiModal";

export default function CollabBusinessProfileTab() {
  const [profileData, setProfileData] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showBusinessChat, setShowBusinessChat] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // מזהי עסק לצ'אט
  const [myBusinessId, setMyBusinessId] = useState(null);
  const [myBusinessName, setMyBusinessName] = useState("");

  // שימוש בקונטקסט AI
  const { suggestions, approveSuggestion, rejectSuggestion, activeSuggestion, closeModal, loading: aiLoading } = useAi();

  useEffect(() => {
    fetchProfile();
    fetchMyBusinessId();
    // eslint-disable-next-line
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/business/my");
      if (data.business) {
        setProfileData(data.business);
        setLogoPreview(data.business.logo || null);
        setMyBusinessName(data.business.businessName || "עסק שלי");
      }
    } catch (e) {
      alert("שגיאה בטעינת פרטי העסק");
    }
    setLoading(false);
  };

  // טעינת מזהה עסק מהשרת (נחוץ לצ'אט)
  const fetchMyBusinessId = async () => {
    try {
      const { data } = await API.get("/business-chat/me");
      if (data.myBusinessId) setMyBusinessId(data.myBusinessId);
    } catch (e) {}
  };

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
      description: formData.get("about"),
      collabPref: formData.get("collabPref"),
      contact: formData.get("contact"),
      phone: formData.get("phone"),
      email: formData.get("email"),
    };
    try {
      if (logoFile) {
        const logoFormData = new FormData();
        logoFormData.append("logo", logoFile);
        const logoRes = await API.put("/business/my/logo", logoFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        updatedData.logo = logoRes.data.logo;
      }
      await API.put("/business/profile", updatedData);
      await fetchProfile();
      setShowEditProfile(false);
      setLogoFile(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profileData) {
    return <div style={{ textAlign: "center", margin: "2em" }}>טוען...</div>;
  }

  const safeProfile = {
    businessName: profileData?.businessName || "שם לא זמין",
    category: profileData?.category || "קטגוריה לא זמינה",
    area: profileData?.area || "אזור לא זמין",
    about: profileData?.description || "אין תיאור",
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

      {/* מודאל עריכת פרופיל */}
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

      {/* מודאל לצ'אט עסקי */}
      <Modal
        open={showBusinessChat}
        onClose={() => setShowBusinessChat(false)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{
          width: "100%",
          maxWidth: 900,
          bgcolor: "#fff",
          borderRadius: "16px",
          boxShadow: 6,
          p: 2,
          outline: "none"
        }}>
          {myBusinessId && (
            <CollabChat
              token={API.token || localStorage.getItem("token")}
              myBusinessId={myBusinessId}
              myBusinessName={myBusinessName}
              onClose={() => setShowBusinessChat(false)}
            />
          )}
        </Box>
      </Modal>

      {/* הוספת מודאל AI גלובלי */}
      <AiModal />
    </>
  );
}
