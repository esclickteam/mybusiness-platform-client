// src/pages/business/dashboardPages/buildTabs/buildSections/MainSection.jsx
import React from "react";
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
  mainImagesInputRef
}) {
  const mainImages = businessDetails.mainImages || [];

  return (
    <>
      {/* ----- עמודת הטופס ----- */}
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

        {/* Logo */}
        <label>לוגו:</label>
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          ref={logoInputRef}
          onChange={() => {/* handled in TopBar */}}
        />
        <button onClick={() => logoInputRef.current?.click()}>
          העלאת לוגו
        </button>

        {/* Main Images */}
        <label>תמונות ראשיות:</label>
        <input
          type="file"
          multiple
          accept="image/*"
          style={{ display: "none" }}
          ref={mainImagesInputRef}
          onChange={handleMainImagesChange}
        />
        <div className="gallery-preview">
          {mainImages.map((img, i) => (
            <div key={i} className="gallery-item-wrapper">
              <img src={img.preview} alt={`main-${i}`} className="gallery-img" />
            </div>
          ))}
          {Array.from({ length: 5 - mainImages.length }).map((_, i) => (
            <div
              key={i}
              className="gallery-placeholder clickable"
              onClick={() => mainImagesInputRef.current?.click()}
            >
              +
            </div>
          ))}
        </div>

        {/* Actions */}
        <button onClick={handleSave} className="save-btn">
          💾 שמור
        </button>
        {showViewProfile && (
          <button
            onClick={() => navigate(`/business/${currentUser.businessId}`)}
            className="save-btn"
            style={{ marginTop: "0.5rem" }}
          >
            👀 צפה בפרופיל
          </button>
        )}
      </div>

      {/* ----- עמודת התצוגה המקדימה ----- */}
      <div className="preview-column">
        {/* Top bar: לוגו, שם, דירוג, טאבס (ללא סטורי) */}
        {renderTopBar()}

        {/* תיאור וטלפון בתצוגה מקדימה */}
        <div className="preview-details" style={{ padding: "0 1rem", textAlign: "right" }}>
          {businessDetails.description && (
            <p className="preview-description">{businessDetails.description}</p>
          )}
          {businessDetails.phone && (
            <p className="preview-phone">📞 {businessDetails.phone}</p>
          )}
        </div>

        {/* MainTab – רק גלריה וביקורות */}
        <MainTab businessDetails={businessDetails} />
      </div>
    </>
  );
}
