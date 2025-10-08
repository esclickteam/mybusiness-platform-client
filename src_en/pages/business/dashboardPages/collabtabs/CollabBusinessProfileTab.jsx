```javascript
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

  // --- Logo: preview and file are managed here ---
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

  // Loading profile and myBusinessId simultaneously
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [profileRes, businessIdRes] = await Promise.all([
        API.get("/business/my"),
        API.get("/business-chat/me"),
      ]);

      // Support for response structure with business or directly
      const businessData =
        profileRes.data.business || profileRes.data || null;

      if (businessData) {
        setProfileData(businessData);

        // Update logoPreview with a fixed URL from the server (not a temporary URL)
        if (typeof businessData.logo === "string") {
          setLogoPreview(businessData.logo);
        } else if (businessData.logo && businessData.logo.preview) {
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

  const handleNewRecommendation = useCallback(
    (rec) => addSuggestion(rec),
    [addSuggestion]
  );

  useEffect(() => {
    if (!socket) return;
    socket.on("newRecommendation", handleNewRecommendation);
    return () => socket.off("newRecommendation", handleNewRecommendation);
  }, [socket, handleNewRecommendation]);

  // Releasing the URL of the logoPreview when the file changes or when the component unmounts
  useEffect(() => {
    return () => {
      if (logoPreview && logoFile) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview, logoFile]);

  // --- Managing logo change with temporary preview creation ---
  const handleLogoChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (file) {
        // Releasing previous preview if it existed
        if (logoPreview && logoFile) {
          URL.revokeObjectURL(logoPreview);
        }
        setLogoFile(file);
        setLogoPreview(URL.createObjectURL(file)); // temporary preview for immediate display
      }
    },
    [logoPreview, logoFile]
  );

  // --- Deleting logo with interface update and data retrieval ---
  const handleDeleteLogo = useCallback(async () => {
    if (saving || isDeletingLogo) return;
    if (!window.confirm("Are you sure you want to delete the logo?")) return;

    try {
      setIsDeletingLogo(true);

      const response = await API.delete("/business/my/logo");

      if (response.status !== 200 && response.status !== 204) {
        alert("Error deleting the logo");
        setIsDeletingLogo(false);
        return;
      }

      // Clearing the logo in the interface
      setLogoPreview(null);
      setLogoFile(null);

      // Updating profile with the new URL
      await fetchData();

      alert("The logo was successfully deleted");
    } catch (err) {
      alert("Error deleting the logo");
      console.error(err);
    } finally {
      setIsDeletingLogo(false);
    }
  }, [saving, isDeletingLogo, fetchData]);

  // --- Saving profile including logo upload ---
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
        console.log("🚀 Starting profile save...");
        if (logoFile) {
          console.log("📤 Uploading new logo:", logoFile);
          const logoFormData = new FormData();
          logoFormData.append("logo", logoFile);
          const logoRes = await API.put("/business/my/logo", logoFormData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          console.log("🟢 Server response after logo upload:", logoRes);

          if (logoRes.status === 200) {
            updatedData.logo = logoRes.data.logo;
            setLogoPreview(logoRes.data.logo);
            setLogoFile(null);
            console.log("✅ The logo was successfully updated to URL:", logoRes.data.logo);
          } else {
            console.warn("⚠️ Logo upload failed:", logoRes);
          }
        } else {
          console.log("No new logo to upload.");
        }

        const profileRes = await API.put("/business/profile", updatedData);
        console.log("🟢 Server response after profile save:", profileRes);

        if (profileRes.status === 200) {
          await fetchData();
          setShowEditProfile(false);
          console.log("✅ Profile save completed successfully");
        } else {
          console.warn("⚠️ Profile save failed:", profileRes);
          alert("Error saving the profile");
        }
      } catch (err) {
        console.error("❌ Error saving the profile:", err);
        alert("Error saving the profile");
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

  if (loading || !profileData) return <div className="loading-text">Loading...</div>;

  const safeProfile = {
    businessName: profileData.businessName || "Name not available",
    category: profileData.category || "Category not available",
    area: profileData.area || "Area not available",
    about: profileData.description || "No description",
    collabPref: collabPrefLines,
    contact: profileData.contact || "-",
    phone: profileData.phone || "-",
    email: profileData.email || "-",
  };

  return (
    <>
      <section className="profile-wrapper">
        <header className="profile-header">
          <h1>📇 Business Profile</h1>
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
                  title="Delete Logo"
                >
                  {isDeletingLogo ? "Deleting..." : "❌ Delete Logo"}
                </button>
              )}
            </div>
          </div>

          <div className="profile-section">
            <h3>📍 Area of Activity</h3>
            <p>{safeProfile.area}</p>
          </div>

          <div className="profile-section">
            <h3>📝 About the Business</h3>
            <p>{safeProfile.about}</p>
          </div>

          <div className="profile-section">
            <h3>🤝 Desired Collaborations</h3>
            {safeProfile.collabPref.length > 0 ? (
              <ul className="profile-collab-list">
                {safeProfile.collabPref.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            ) : (
              <p>No collaborations entered.</p>
            )}
          </div>

          <div className="profile-section profile-contact">
            <h3>📞 Contact Details</h3>
            <p>
              <strong>Contact Person:</strong> {safeProfile.contact}
            </p>
            <p>
              <strong>Phone:</strong> {safeProfile.phone}
            </p>
            <p>
              <strong>Email:</strong> {safeProfile.email}
            </p>
          </div>
        </article>
      </section>

      {/* Profile Edit Modal */}
      <Modal open={showEditProfile} onClose={() => setShowEditProfile(false)}>
        <Box className="modal-box">
          <h2>Edit Business Profile</h2>
          <form onSubmit={handleSaveProfile} className="profile-form">
            <label>Business Name</label>
            <input name="businessName" defaultValue={safeProfile.businessName} required />

            <label>Field</label>
            <input name="category" defaultValue={safeProfile.category} required />

            <label>Area of Activity</label>
            <input name="area" defaultValue={safeProfile.area} required />

            <label>About the Business</label>
            <textarea name="about" defaultValue={safeProfile.about} rows="3" />

            <label>Desired Collaborations</label>
            <textarea name="collabPref" defaultValue={profileData.collabPref || ""} rows="3" />

            <label>Contact Person Name</label>
            <input name="contact" defaultValue={safeProfile.contact} required />

            <label>Phone</label>
            <input name="phone" defaultValue={safeProfile.phone} required />

            <label>Email</label>
            <input name="email" defaultValue={safeProfile.email} required />

            <div className="modal-buttons">
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? "Saving..." : "💾 Save"}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowEditProfile(false)}
                disabled={saving}
              >
                ❌ Cancel
              </button>
            </div>
          </form>
        </Box>
      </Modal>

      {/* Business Chat Modal */}
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

      {/* AI Modal */}
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
```