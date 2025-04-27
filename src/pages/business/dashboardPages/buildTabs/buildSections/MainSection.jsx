// src/pages/business/dashboardPages/buildTabs/buildSections/MainSection.jsx

import React from "react";
import "../../build/Build.css";
import MainTab from "../MainTab.jsx";

export default function MainSection({
  businessDetails,
  handleInputChange,
  handleLogoClick,
  handleLogoChange,
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
  const story      = businessDetails.story      || [];

  return (
    <>
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

        {/* לוגו */}
        <label>לוגו:</label>
        <button onClick={() => logoInputRef.current?.click()}>
          העלאת לוגו
        </button>

        {/* סטורי */}
        <label>סטורי:</label>
        <button onClick={() => storyInputRef.current?.click()}>
          העלאת סטורי
        </button>
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          style={{ display: "none" }}
          ref={storyInputRef}
          onChange={handleStoryUpload}
        />
        <div className="gallery-preview">
          {story.map((item, i) => (
            <div key={i} className="gallery-item-wrapper">
              {item.preview.match(/\.(mp4|webm)$/) ? (
                <video
                  src={item.preview}
                  controls
                  className="gallery-img"
                />
              ) : (
                <img
                  src={item.preview}
                  alt={`story-${i}`}
                  className="gallery-img"
                />
              )}
            </div>
          ))}
        </div>

        {/* תמונות ראשיות */}
        <label>תמונות ראשיות:</label>
        <button onClick={() => mainImagesInputRef.current?.click()}>
          העלאת תמונות
        </button>
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
              <img
                src={img.preview}
                alt={`main-${i}`}
                className="gallery-img"
              />
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

      <div className="preview-column">
        {renderTopBar()}
        <MainTab
          businessDetails={businessDetails}
          handleMainImagesChange={handleMainImagesChange}
        />
      </div>
    </>
  );
}
