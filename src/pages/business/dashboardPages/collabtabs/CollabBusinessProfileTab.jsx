import React, { useState, useEffect, useCallback, useMemo } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import API from "../../../../api";
import CollabChat from "./CollabChat";
import "./CollabBusinessProfileTab.css";

import { useAi } from "../../../../context/AiContext";
import AiModal from "../../../../components/AiModal";

export default function CollabBusinessProfileTab({ socket }) {
  const [profileData, setProfileData] = useState(null);

  // --- לוגו: preview ו-file מנוהלים כאן ---
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showBusinessChat, setShowBusinessChat] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDeletingLogo, setIsDeletingLogo] = useState(false);

  const [myBusinessId, setMyBusinessId] = useState(null);
  const [myBusinessName, setMyBusinessName] = useState("");

  const {
    addSuggestion,
    activeSuggestion,
    approveSuggestion,
    rejectSuggestion,
    closeModal,
    loading: aiLoading,
  } = useAi();

  // טעינת פרופיל ו־myBusinessId במקביל
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [profileRes, businessIdRes] = await Promise.all([
        API.get("/business/my"),
        API.get("/business-chat/me"),
      ]);

      // תמיכה במבנה response עם business או ישירות
      const businessData =
        profileRes.data.business || profileRes.data || null;

      if (businessData) {
        setProfileData(businessData);

        // עדכון logoPreview עם URL קבוע מהשרת (לא URL זמני)
        if (typeof businessData.logo === "string") {
          setLogoPreview(businessData.logo);
        } else if (businessData.logo && businessData.logo.preview) {
          setLogoPreview(businessData.logo.preview);
        } else {
          setLogoPreview(null);
        }

        setMyBusinessName(businessData.businessName || "עסק שלי");
      }
      if (businessIdRes.data.myBusinessId) {
        setMyBusinessId(businessIdRes.data.myBusinessId);
      }
    } catch (err) {
      alert("שגיאה בטעינת פרטי העסק");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleNewRecommendation = useCallback(
    (rec) => addSuggestion(rec),
    [addSuggestion]
  );

  useEffect(() => {
    if (!socket) return;
    socket.on("newRecommendation", handleNewRecommendation);
    return () => socket.off("newRecommendation", handleNewRecommendation);
  }, [socket, handleNewRecommendation]);

  // שחרור URL של ה־logoPreview כשמשתנה הקובץ או כשהרכיב מתפרק
  useEffect(() => {
    return () => {
      if (logoPreview && logoFile) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview, logoFile]);

  // --- ניהול שינוי לוגו עם יצירת preview זמני ---
  const handleLogoChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (file) {
        // שחרור preview קודם אם היה
        if (logoPreview && logoFile) {
          URL.revokeObjectURL(logoPreview);
        }
        setLogoFile(file);
        setLogoPreview(URL.createObjectURL(file)); // preview זמני להצגה מיידית
      }
    },
    [logoPreview, logoFile]
  );

  // --- מחיקת לוגו עם עדכון ממשק ושליפת נתונים מחדש ---
  const handleDeleteLogo = useCallback(async () => {
    if (saving || isDeletingLogo) return;
    if (!window.confirm("אתה בטוח שברצונך למחוק את הלוגו?")) return;

    try {
      setIsDeletingLogo(true);

      const response = await API.delete("/business/my/logo");

      if (response.status !== 200 && response.status !== 204) {
        alert("שגיאה במחיקת הלוגו");
        setIsDeletingLogo(false);
        return;
      }

      // ניקוי הלוגו בממשק
      setLogoPreview(null);
      setLogoFile(null);

      // עדכון פרופיל עם ה-URL החדש
      await fetchData();

      alert("הלוגו נמחק בהצלחה");
    } catch (err) {
      alert("שגיאה במחיקת הלוגו");
      console.error(err);
    } finally {
      setIsDeletingLogo(false);
    }
  }, [saving, isDeletingLogo, fetchData]);

  // --- שמירת פרופיל כולל העלאת לוגו ---
  const handleSaveProfile = useCallback(
    async (e) => {
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
        console.log("🚀 מתחילים שמירת פרופיל...");
        if (logoFile) {
          console.log("📤 מעלה לוגו חדש:", logoFile);
          const logoFormData = new FormData();
          logoFormData.append("logo", logoFile);
          const logoRes = await API.put("/business/my/logo", logoFormData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          console.log("🟢 תשובת השרת לאחר העלאת הלוגו:", logoRes);

          if (logoRes.status === 200) {
            updatedData.logo = logoRes.data.logo;
            setLogoPreview(logoRes.data.logo);
            setLogoFile(null);
            console.log("✅ הלוגו עודכן בהצלחה ל-URL:", logoRes.data.logo);
          } else {
            console.warn("⚠️ העלאת לוגו נכשלה:", logoRes);
          }
        } else {
          console.log("אין לוגו חדש להעלות.");
        }

        const profileRes = await API.put("/business/profile", updatedData);
        console.log("🟢 תשובת השרת לאחר שמירת הפרופיל:", profileRes);

        if (profileRes.status === 200) {
          await fetchData();
          setShowEditProfile(false);
          console.log("✅ שמירת הפרופיל הושלמה בהצלחה");
        } else {
          console.warn("⚠️ שמירת פרופיל נכשלה:", profileRes);
          alert("שגיאה בשמירת הפרופיל");
        }
      } catch (err) {
        console.error("❌ שגיאה בשמירת הפרופיל:", err);
        alert("שגיאה בשמירת הפרופיל");
      } finally {
        setSaving(false);
      }
    },
    [logoFile, fetchData]
  );

  const collabPrefLines = useMemo(() => {
    if (!profileData?.collabPref) return [];
    return profileData.collabPref
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }, [profileData]);

  if (loading || !profileData) return <div className="loading-text">טוען...</div>;

  const safeProfile = {
    businessName: profileData.businessName || "שם לא זמין",
    category: profileData.category || "קטגוריה לא זמינה",
    area: profileData.area || "אזור לא זמין",
    about: profileData.description || "אין תיאור",
    collabPref: collabPrefLines,
    contact: profileData.contact || "-",
    phone: profileData.phone || "-",
    email: profileData.email || "-",
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
              {logoPreview && (
                <button
                  className="btn-danger"
                  onClick={handleDeleteLogo}
                  disabled={saving || isDeletingLogo}
                  title="מחק לוגו"
                >
                  {isDeletingLogo ? "מוחק..." : "❌ מחק לוגו"}
                </button>
              )}
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
            {safeProfile.collabPref.length > 0 ? (
              <ul className="profile-collab-list">
                {safeProfile.collabPref.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            ) : (
              <p>אין שיתופי פעולה מוזנים.</p>
            )}
          </div>

          <div className="profile-section profile-contact">
            <h3>📞 פרטי קשר</h3>
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
            <textarea name="collabPref" defaultValue={profileData.collabPref || ""} rows="3" />

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
            <div className="collab-chat-root">
              <CollabChat
                token={API.token || localStorage.getItem("token")}
                myBusinessId={myBusinessId}
                myBusinessName={myBusinessName}
                onClose={() => setShowBusinessChat(false)}
              />
            </div>
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
