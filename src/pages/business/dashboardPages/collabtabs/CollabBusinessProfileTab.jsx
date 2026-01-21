import React, { useState, useEffect, useCallback, useMemo } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import API from "../../../../api";
import CollabChat from "./CollabChat";
import "./CollabBusinessProfileTab.css";

import { useAi } from "../../../../context/AiContext";
import AiModal from "../../../../components/AiModal";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function CollabBusinessProfileTab({ socket }) {
  const [profileData, setProfileData] = useState(null);

  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showBusinessChat, setShowBusinessChat] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDeletingLogo, setIsDeletingLogo] = useState(false);
  const [phone, setPhone] = useState("");

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

  /* ===================== DATA LOAD ===================== */
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [profileRes, businessIdRes] = await Promise.all([
        API.get("/business/my"),
        API.get("/business-chat/me"),
      ]);

      const businessData =
        profileRes.data.business || profileRes.data || null;

      if (businessData) {
        setProfileData(businessData);

        if (businessData.phone) setPhone(businessData.phone);

        if (typeof businessData.logo === "string") {
          setLogoPreview(businessData.logo);
        } else if (businessData.logo?.preview) {
          setLogoPreview(businessData.logo.preview);
        } else {
          setLogoPreview(null);
        }

        setMyBusinessName(businessData.businessName || "My Business");
      }

      if (businessIdRes.data.myBusinessId) {
        setMyBusinessId(businessIdRes.data.myBusinessId);
      }
    } catch (err) {
      alert("Error loading business details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ===================== SOCKET ===================== */
  const handleNewRecommendation = useCallback(
    (rec) => addSuggestion(rec),
    [addSuggestion]
  );

  useEffect(() => {
    if (!socket) return;
    socket.on("newRecommendation", handleNewRecommendation);
    return () => socket.off("newRecommendation", handleNewRecommendation);
  }, [socket, handleNewRecommendation]);

  /* ===================== LOGO ===================== */
  useEffect(() => {
    return () => {
      if (logoPreview && logoFile) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview, logoFile]);

  const handleLogoChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (logoPreview && logoFile) {
        URL.revokeObjectURL(logoPreview);
      }

      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    },
    [logoPreview, logoFile]
  );

  const handleDeleteLogo = useCallback(async () => {
    if (saving || isDeletingLogo) return;
    if (!window.confirm("Are you sure you want to delete the logo?")) return;

    try {
      setIsDeletingLogo(true);
      const res = await API.delete("/business/my/logo");

      if (res.status !== 200 && res.status !== 204) {
        alert("Error deleting logo");
        return;
      }

      setLogoPreview(null);
      setLogoFile(null);
      await fetchData();
    } catch (err) {
      alert("Error deleting logo");
      console.error(err);
    } finally {
      setIsDeletingLogo(false);
    }
  }, [saving, isDeletingLogo, fetchData]);

  /* ===================== SAVE ===================== */
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
        phone,
        email: formData.get("email"),
      };

      try {
        if (logoFile) {
          const logoFD = new FormData();
          logoFD.append("logo", logoFile);
          const logoRes = await API.put("/business/my/logo", logoFD, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          if (logoRes.status === 200) {
            updatedData.logo = logoRes.data.logo;
            setLogoPreview(logoRes.data.logo);
            setLogoFile(null);
          }
        }

        const profileRes = await API.put("/business/profile", updatedData);
        if (profileRes.status === 200) {
          await fetchData();
          setShowEditProfile(false);
        } else {
          alert("Error saving profile");
        }
      } catch (err) {
        console.error(err);
        alert("Error saving profile");
      } finally {
        setSaving(false);
      }
    },
    [logoFile, fetchData, phone]
  );

  /* ===================== UI HELPERS ===================== */
  const collabPrefLines = useMemo(() => {
    if (!profileData?.collabPref) return [];
    return profileData.collabPref
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
  }, [profileData]);

  if (loading || !profileData) {
    return (
      <section className="profile-wrapper">
        <div className="profile-card skeleton">
          <div className="skeleton-logo" />
          <div className="skeleton-line w-60" />
          <div className="skeleton-line w-40" />
          <div className="skeleton-block" />
        </div>
      </section>
    );
  }

  const safeProfile = {
    businessName: profileData.businessName || "—",
    category: profileData.category || "—",
    area: profileData.area || "—",
    about: profileData.description || "—",
    collabPref: collabPrefLines,
    contact: profileData.contact || "—",
    phone: profileData.phone || "—",
    email: profileData.email || "—",
  };

  /* ===================== RENDER ===================== */
  return (
    <>
      <section className="profile-wrapper">
        <header className="profile-header">
          <h1>Business Profile</h1>
        </header>

        <article className="profile-card">
          <div className="profile-top">
            <label htmlFor="logo-upload" className="profile-logo-label">
              <img
                src={logoPreview || "https://via.placeholder.com/150?text=Logo"}
                alt="Business logo"
                className="profile-logo"
              />
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                hidden
              />
            </label>

            <div className="profile-main-info">
              <h2>{safeProfile.businessName}</h2>
              <span className="profile-category">{safeProfile.category}</span>
            </div>

            <div className="profile-actions">
              <button
                className="btn-primary"
                onClick={() => {
                  setPhone(profileData?.phone || "");
                  setShowEditProfile(true);
                }}
              >
                ✏️ Edit Profile
              </button>

              <button
                className="btn-secondary"
                onClick={() => setShowBusinessChat(true)}
              >
                💬 Business Messages
              </button>

              {logoPreview && (
                <button
                  className="btn-danger"
                  onClick={handleDeleteLogo}
                  disabled={saving || isDeletingLogo}
                >
                  {isDeletingLogo ? "Deleting..." : "❌ Delete Logo"}
                </button>
              )}
            </div>
          </div>

          <div className="profile-section">
            <h3>📍 Operating Area</h3>
            <p>{safeProfile.area}</p>
          </div>

          <div className="profile-section">
            <h3>📝 About</h3>
            <p>{safeProfile.about}</p>
          </div>

          <div className="profile-section">
            <h3>🤝 Preferred Collaborations</h3>
            {safeProfile.collabPref.length ? (
              <ul>
                {safeProfile.collabPref.map((l, i) => (
                  <li key={i}>{l}</li>
                ))}
              </ul>
            ) : (
              <p>No collaborations listed.</p>
            )}
          </div>

          <div className="profile-section profile-contact">
            <h3>📞 Contact</h3>
            <p><strong>Name:</strong> {safeProfile.contact}</p>
            <p><strong>Phone:</strong> {safeProfile.phone}</p>
            <p><strong>Email:</strong> {safeProfile.email}</p>
          </div>
        </article>
      </section>

      {/* EDIT MODAL */}
      <Modal open={showEditProfile} onClose={() => setShowEditProfile(false)}>
        <Box className="modal-box">
          <h2>Edit Business Profile</h2>

          <form onSubmit={handleSaveProfile} className="profile-form">
            <input name="businessName" defaultValue={safeProfile.businessName} required />
            <input name="category" defaultValue={safeProfile.category} required />
            <input name="area" defaultValue={safeProfile.area} required />
            <textarea name="about" defaultValue={safeProfile.about} rows={3} />
            <textarea name="collabPref" defaultValue={profileData.collabPref || ""} rows={3} />
            <input name="contact" defaultValue={safeProfile.contact} required />

            <PhoneInput
              country="us"
              value={phone}
              onChange={(v) => setPhone(v)}
              inputProps={{ required: true }}
            />

            <input name="email" defaultValue={safeProfile.email} required />

            <div className="modal-buttons">
              <button className="btn-primary" disabled={saving}>
                {saving ? "Saving..." : "💾 Save"}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowEditProfile(false)}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </form>
        </Box>
      </Modal>

      {/* CHAT */}
      <Modal open={showBusinessChat} onClose={() => setShowBusinessChat(false)}>
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

      {/* AI */}
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
