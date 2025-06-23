import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import API from "../../../../api";
import CollabChat from "./CollabChat";
import "./CollabBusinessProfileTabNew.css";

import { useAi } from "../../../../context/AiContext";
import AiModal from "../../../../components/AiModal";

export default function CollabBusinessProfileTab({ socket }) {
  const [profileData, setProfileData] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showBusinessChat, setShowBusinessChat] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [myBusinessId, setMyBusinessId] = useState(null);
  const [myBusinessName, setMyBusinessName] = useState("");

  const { addSuggestion, activeSuggestion, approveSuggestion, rejectSuggestion, closeModal, loading: aiLoading } = useAi();

  useEffect(() => {
    fetchProfile();
    fetchMyBusinessId();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNewRecommendation = (rec) => addSuggestion(rec);

    socket.on("newRecommendation", handleNewRecommendation);

    return () => {
      socket.off("newRecommendation", handleNewRecommendation);
    };
  }, [socket, addSuggestion]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/business/my");
      if (data.business) {
        setProfileData(data.business);
        setLogoPreview(data.business.logo || null);
        setMyBusinessName(data.business.businessName || "עסק שלי");
      }
    } catch {
      alert("שגיאה בטעינת פרטי העסק");
    }
    setLoading(false);
  };

  const fetchMyBusinessId = async () => {
    try {
      const { data } = await API.get("/business-chat/me");
      if (data.myBusinessId) setMyBusinessId(data.myBusinessId);
    } catch {}
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
    return <div className="loading-text">טוען...</div>;
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
      <section className="profile-wrapper">
        <header className="profile-header">
          <h1>📇 פרופיל עסקי</h1>
        </header>

        <article className="profile-card">
          <div className="profile-top">
            <label htmlFor="logo-upload" className="profile-logo-label">
              <img
                src={logoPreview || "https://via.placeholder.com/150?text=לוגו"}
                alt="לוגו העסק"
                className="profile-logo"
              />
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                style={{ display: "none" }}
              />
            </label>

            <div className="profile-main-info">
              <h2 className="profile-business-name">{safeProfile.businessName}</h2>
              <span className="profile-category">{safeProfile.category}</span>
            </div>

            <div className="profile-actions">
              <button
                className="btn-primary"
                onClick={() => setShowEditProfile(true)}
              >
                ✏️ עריכת פרופיל
              </button>
              <button
                className="btn-secondary"
                onClick={() => setShowBusinessChat(true)}
              >
                💬 הודעות עסקיות
              </button>
            </div>
          </div>

          <div className="profile-section">
            <h3>📍 אזור פעילות</h3>
            <p>{safeProfile.area}</p>
          </div>

          <div className="profile-section">
            <h3>📝 על העסק</h3>
            <p>{safeProfile.about}</p>
          </div>

          <div className="profile-section">
            <h3>🤝 שיתופי פעולה רצויים</h3>
            {safeProfile.collabPref ? (
              <ul className="profile-collab-list">
                {safeProfile.collabPref.split("\n").map((line, i) =>
                  line.trim() ? <li key={i}>{line}</li> : null
                )}
              </ul>
            ) : (
              <p>אין שיתופי פעולה מוזנים.</p>
            )}
          </div>

          <div className="profile-section profile-contact">
            <h3>📞 פרטי קשר</h3>
            <p><strong>איש קשר:</strong> {safeProfile.contact}</p>
            <p><strong>טלפון:</strong> {safeProfile.phone}</p>
            <p><strong>אימייל:</strong> {safeProfile.email}</p>
          </div>
        </article>
      </section>

      {/* מודאל עריכת פרופיל */}
      <Modal open={showEditProfile} onClose={() => setShowEditProfile(false)}>
        <Box className="modal-box">
          <h2>עריכת פרופיל עסקי</h2>
          <form onSubmit={handleSaveProfile} className="profile-form">
            <label>שם העסק</label>
            <input name="businessName" defaultValue={safeProfile.businessName} required />

            <label>תחום</label>
            <input name="category" defaultValue={safeProfile.category} required />

            <label>אזור פעילות</label>
            <input name="area" defaultValue={safeProfile.area} required />

            <label>על העסק</label>
            <textarea name="about" defaultValue={safeProfile.about} rows="3" />

            <label>שיתופי פעולה רצויים</label>
            <textarea name="collabPref" defaultValue={safeProfile.collabPref} rows="3" />

            <label>שם איש קשר</label>
            <input name="contact" defaultValue={safeProfile.contact} required />

            <label>טלפון</label>
            <input name="phone" defaultValue={safeProfile.phone} required />

            <label>אימייל</label>
            <input name="email" defaultValue={safeProfile.email} required />

            <div className="modal-buttons">
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? "שומר..." : "💾 שמירה"}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowEditProfile(false)}
                disabled={saving}
              >
                ❌ ביטול
              </button>
            </div>
          </form>
        </Box>
      </Modal>

      {/* מודאל צ'אט עסקי */}
      <Modal
        open={showBusinessChat}
        onClose={() => setShowBusinessChat(false)}
        className="chat-modal"
      >
        <Box className="chat-box">
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

      {/* מודאל AI */}
      <AiModal
        loading={aiLoading}
        activeSuggestion={activeSuggestion}
        approveSuggestion={approveSuggestion}
        rejectSuggestion={rejectSuggestion}
        closeModal={closeModal}
      />
    </>
  );
}
