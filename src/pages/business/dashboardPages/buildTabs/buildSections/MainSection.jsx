import React, { useRef } from "react";
import MainTab from "../MainTab.jsx";
import "../Build.css"; // וודא שב־Build.css כבר מיובא ברכיב האב או כאן

export default function MainSection({
  businessDetails,
  handleInputChange,
  handleLogoClick,
  handleLogoChange,
  handleStoryUpload,
  handleSave,
  showViewProfile,
  navigate,
  currentUser,
  handleMainImagesChange,
  renderTopBar
}) {
  const logoRef = useRef();
  const storyRef = useRef();
  const mainImagesRef = useRef();

  const mainImages = businessDetails.mainImages || [];

  return (
    <>
      {/* ==== צד שמאל: הטופס ==== */}
      <div className="form-column">
        {renderTopBar()}
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

        <label>לוגו:</label>
        <input
          type="file"
          style={{ display: "none" }}
          ref={logoRef}
          onChange={handleLogoChange}
          accept="image/*"
        />
        <button onClick={() => logoRef.current.click()}>העלאת לוגו</button>

        <label>סטורי:</label>
        <input
          type="file"
          multiple
          style={{ display: "none" }}
          ref={storyRef}
          onChange={handleStoryUpload}
          accept="image/*,video/*"
        />
        <button onClick={() => storyRef.current.click()}>העלאת סטורי</button>

        {/* ==== תמונות לעמוד הראשי + placeholders ==== */}
        <label>תמונות לעמוד הראשי (עד 5):</label>
        <input
          type="file"
          multiple
          style={{ display: "none" }}
          ref={mainImagesRef}
          onChange={handleMainImagesChange}
          accept="image/*"
        />
        <button onClick={() => mainImagesRef.current.click()}>
          העלאת תמונות לעמוד הראשי
        </button>
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
              onClick={() => mainImagesRef.current.click()}
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
