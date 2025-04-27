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
  // אלה הפרופס שהעברנו מ-Build.jsx
  logoInputRef,
  storyInputRef,
  mainImagesInputRef
}) {
  const mainImages = businessDetails.mainImages || [];

  return (
    <>
      {/* ==== צד שמאל: הטופס ==== */}
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

        {/* ==== העלאת לוגו ==== */}
        <label>לוגו:</label>
        <input
          type="file"
          style={{ display: "none" }}
          ref={logoInputRef}
          onChange={handleLogoChange}
          accept="image/*"
        />
        <button onClick={() => logoInputRef.current?.click()}>
          העלאת לוגו
        </button>

        {/* ==== העלאת סטורי ==== */}
        <label>סטורי:</label>
        <input
          type="file"
          multiple
          style={{ display: "none" }}
          ref={storyInputRef}
          onChange={handleStoryUpload}
          accept="image/*,video/*"
        />
        <button onClick={() => storyInputRef.current?.click()}>
          העלאת סטורי
        </button>

        {/* ==== העלאת תמונות ראשיות ==== */}
        <label>תמונות ראשיות:</label>
        <input
          type="file"
          multiple
          style={{ display: "none" }}
          ref={mainImagesInputRef}
          onChange={handleMainImagesChange}
          accept="image/*"
        />
        <div className="gallery-preview">
          {mainImages.map((img, i) => (
            <div key={i} className="gallery-item-wrapper">
              <img
                src={img.preview || img}
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

        {/* ==== כפתורי פעולה ==== */}
        <button onClick={handleSave} className="save-btn">
          💾 שמור
        </button>
        {showViewProfile && (
          <button
            onClick={() => navigate(`/business/${currentUser.businessId}`)}
          >
            👀 צפה בפרופיל
          </button>
        )}
      </div>

      {/* ==== צד ימין: תצוגה (Preview) ==== */}
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
