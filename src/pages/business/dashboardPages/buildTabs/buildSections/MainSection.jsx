import React, { useState } from "react";
import "../../build/Build.css";
import MainTab from "../MainTab.jsx";

export default function MainSection({
  businessDetails,
  handleInputChange,
  handleMainImagesChange,
  handleSave,
  showViewProfile,
  navigate,
  currentUser,
  renderTopBar,
  logoInputRef,
  mainImagesInputRef,
  handleDeleteImage,          // פונקציה למחיקה (Prop מ-Build.jsx)
  handleEditImage,            // פונקציה לעריכה (Prop מ-Build.jsx)
  isSaving
}) {
  const [editIndex, setEditIndex] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const mainImages = businessDetails.mainImages || [];

  // פותח את הפופאפ עם האינדקס לעריכה
  const openEdit = (idx) => {
    setEditIndex(idx);
    setIsPopupOpen(true);
  };
  const closeEdit = () => {
    setEditIndex(null);
    setIsPopupOpen(false);
  };

  // מעביר את הגודל הנבחר חזרה ל-Build.jsx
  const updateImageSize = (sizeType) => {
    if (editIndex === null) return;
    handleEditImage(editIndex, sizeType);
    closeEdit();
  };

  return (
    <>
      {/* ====== עמודת הטופס ====== */}
      <div className="form-column">
        <h2>🎨 עיצוב הכרטיס</h2>

        <label>שם העסק:</label>
        <input
          type="text"
          name="name"
          value={businessDetails.name}
          onChange={handleInputChange}
        />

        <label>תיאור:</label>
        <textarea
          name="description"
          value={businessDetails.description}
          onChange={handleInputChange}
        />

        <label>טלפון:</label>
        <input
          type="text"
          name="phone"
          value={businessDetails.phone}
          onChange={handleInputChange}
        />

        {/* ====== Logo ====== */}
        <label>לוגו:</label>
        <input
          type="file"
          name="logo"
          accept="image/*"
          style={{ display: "none" }}
          ref={logoInputRef}
        />
        <button
          type="button"
          className="save-btn"
          onClick={() => logoInputRef.current?.click()}
        >
          העלאת לוגו
        </button>

        {/* ====== Main Images ====== */}
        <label>תמונות ראשיות:</label>
        <input
          type="file"
          name="main-images"
          multiple
          accept="image/*"
          style={{ display: "none" }}
          ref={mainImagesInputRef}
          onChange={handleMainImagesChange}
        />
        <div className="gallery-preview">
          {mainImages.map((img, i) => (
            <div key={i} className="image-wrapper">
              <img
                src={img.preview}
                alt={`תמונה ראשית ${i + 1}`}
                className="gallery-img"
              />
              <button
                className="delete-btn"
                onClick={() => handleDeleteImage(i)}
                type="button"
                title="מחיקה"
              >
                🗑️
              </button>
              <button
                className="edit-btn"
                onClick={() => openEdit(i)}
                type="button"
                title="עריכה"
              >
                ✏️
              </button>
            </div>
          ))}

          {mainImages.length < 5 && (
            <div
              className="gallery-placeholder clickable"
              onClick={() => mainImagesInputRef.current?.click()}
            >
              +
            </div>
          )}
        </div>

        {/* ====== פעולות שמירה ====== */}
        <button
          className="save-btn"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? "שומר..." : "💾 שמור"}
        </button>

        {showViewProfile && (
          <button
            type="button"
            className="save-btn"
            style={{ marginTop: "0.5rem" }}
            onClick={() => navigate(`/business/${currentUser.businessId}`)}
          >
            👀 צפה בפרופיל
          </button>
        )}
      </div>

      {/* ====== עמודת התצוגה המקדימה ====== */}
      <div className="preview-column">
        {renderTopBar && renderTopBar()}

        <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
          {businessDetails.description && (
            <p className="preview-description">
              <strong>תיאור:</strong> {businessDetails.description}
            </p>
          )}
          {businessDetails.phone && (
            <p className="preview-phone">
              <strong>טלפון:</strong> {businessDetails.phone}
            </p>
          )}
        </div>

        <MainTab businessDetails={businessDetails} />
      </div>

      {/* ====== פופאפ לעריכת גודל תמונה ====== */}
      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>בחר גודל תמונה</h3>
            <button onClick={() => updateImageSize("full")}>גודל מלא</button>
            <button onClick={() => updateImageSize("custom")}>
              גודל מותאם
            </button>
            <button onClick={closeEdit}>ביטול</button>
          </div>
        </div>
      )}
    </>
  );
}
