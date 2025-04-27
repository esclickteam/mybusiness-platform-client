import React, { useRef } from "react";
import MainTab from "../buildTabs/MainTab";

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
  const logoRef = useRef(null);
  const storyRef = useRef(null);

  return (
    <>
      <div className="form-column">
        {renderTopBar()}

        <h2>🎨 עיצוב הכרטיס</h2>

        {/* שם */}
        <label>שם העסק:</label>
        <input
          type="text"
          name="name"
          value={businessDetails.name}
          onChange={handleInputChange}
        />

        {/* תיאור */}
        <label>תיאור:</label>
        <textarea
          name="description"
          value={businessDetails.description}
          onChange={handleInputChange}
        />

        {/* טלפון */}
        <label>מספר טלפון:</label>
        <input
          type="text"
          name="phone"
          value={businessDetails.phone}
          onChange={handleInputChange}
          placeholder="050-1234567"
        />

        {/* לוגו */}
        <label>לוגו:</label>
        <input
          type="file"
          style={{ display: "none" }}
          ref={logoRef}
          onChange={handleLogoChange}
          accept="image/*"
        />
        <button onClick={() => logoRef.current.click()} className="upload-logo-btn">
          העלאת לוגו
        </button>

        {/* סטורי */}
        <label>סטורי:</label>
        <input
          type="file"
          multiple
          style={{ display: "none" }}
          ref={storyRef}
          onChange={handleStoryUpload}
          accept="image/*,video/*"
        />
        <button
          type="button"
          onClick={() => storyRef.current.click()}
          className="upload-story-btn"
        >
          העלאת סטורי
        </button>

        {/* שמירה */}
        <button onClick={handleSave} className="save-button">
          💾 שמור
        </button>
        {showViewProfile && (
          <button
            onClick={() => navigate(`/business/${currentUser.businessId}`)}
            className="view-profile-button"
          >
            👀 צפה בפרופיל
          </button>
        )}
      </div>

      <div className="preview-column">
        <MainTab
          businessDetails={businessDetails}
          handleMainImagesChange={handleMainImagesChange}
        />
      </div>
    </>
  );
}
