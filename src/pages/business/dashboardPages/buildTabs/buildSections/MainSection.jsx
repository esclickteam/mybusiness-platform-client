// src/pages/business/dashboardPages/buildTabs/buildSections/MainSection.jsx
import React, { useRef } from "react";
import MainTab from "../MainTab.jsx";

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

        <label>לוגו:</label>
        <input
          type="file"
          style={{ display: "none" }}
          ref={logoRef}
          onChange={handleLogoChange}
          accept="image/*"
        />
        <button onClick={() => logoRef.current.click()}>
          העלאת לוגו
        </button>

        <label>סטורי:</label>
        <input
          type="file"
          multiple
          style={{ display: "none" }}
          ref={storyRef}
          onChange={handleStoryUpload}
          accept="image/*,video/*"
        />
        <button onClick={() => storyRef.current.click()}>
          העלאת סטורי
        </button>

        <button onClick={handleSave}>💾 שמור</button>
        {showViewProfile && (
          <button
            onClick={() =>
              navigate(`/business/${currentUser.businessId}`)
            }
          >
            👀 צפה בפרופיל
          </button>
        )}
      </div>

      {/* ==== צד ימין: תצוגה (Preview) ==== */}
      <div className="preview-column">
        {renderTopBar()}

        {/* כאן תיבת התצוגה הראשית */}
        <MainTab
          businessDetails={businessDetails}
          handleMainImagesChange={handleMainImagesChange}
        />
      </div>
    </>
  );
}
