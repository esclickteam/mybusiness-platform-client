// src/pages/business/dashboardPages/buildTabs/buildSections/MainSection.jsx
import React from "react";
import "../../build/Build.css";
import MainTab from "../MainTab.jsx";

export default function MainSection({
  businessDetails,
  handleInputChange,
  handleStoryUpload,
  handleMainImagesChange,
  handleSave,
  showViewProfile,
  navigate,
  currentUser,
  renderTopBar,
  logoInputRef,
  storyInputRef,
  mainImagesInputRef
}) {
  const mainImages = businessDetails.mainImages || [];
  const story      = businessDetails.story || [];

  return (
    <>
      {/* ----- form column ----- */}
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
          onChange={() => {/* handled in top bar */}}
        />
        <button onClick={() => logoInputRef.current?.click()}>
          העלאת לוגו
        </button>

        {/* Story */}
        <label>סטורי:</label>
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          style={{ display: "none" }}
          ref={storyInputRef}
          onChange={handleStoryUpload}
        />
        <button onClick={() => storyInputRef.current?.click()}>
          העלאת סטורי
        </button>

        <div className="gallery-preview">
          {story.map((item, i) => (
            <div key={i} className="gallery-item-wrapper">
              {item.preview.match(/\.(mp4|webm)$/i) ? (
                <video src={item.preview} controls className="gallery-img" />
              ) : (
                <img src={item.preview} alt={`story-${i}`} className="gallery-img" />
              )}
            </div>
          ))}
        </div>

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

      {/* ----- preview column ----- */}
      <div className="preview-column">
        {renderTopBar()}

        {/* תיאור וטלפון בתצוגה מקדימה */}
        <div className="preview-details" style={{ padding: "0 1rem", textAlign: "right" }}>
          {businessDetails.description && (
            <p className="preview-description">
              {businessDetails.description}
            </p>
          )}
          {businessDetails.phone && (
            <p className="preview-phone">
              📞 {businessDetails.phone}
            </p>
          )}
        </div>

        {/* MainTab – רק הכרטיס עצמו, ללא סטורי או כפתור שמירה */}
        <MainTab businessDetails={businessDetails} />
      </div>
    </>
  );
}
