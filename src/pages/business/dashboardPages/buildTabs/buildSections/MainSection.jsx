import React from "react";
import "../../build/Build.css";
import MainTab from "../MainTab.jsx";
// תיקון: חמש רמות מעלה מ‐buildSections עד ל‐src/utils
import { dedupeByPreview } from "../../../../../utils/dedupe";

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
  handleDeleteImage,
  isSaving
}) {
  // 1) המערך הגולמי
  const mainImages = businessDetails.mainImages || [];

  // 2) הסרת כפילויות (blob vs URL)
  const uniqueImages = dedupeByPreview(mainImages);

  // 3) חיתוך ל־5 תמונות ראשיות
  const limitedMainImages = uniqueImages.slice(0, 5);

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

        <label>קטגוריה:</label>
        <input
          type="text"
          name="category"
          value={businessDetails.category}
          onChange={handleInputChange}
        />

        <label>אימייל:</label>
        <input
          type="email"
          name="email"
          value={businessDetails.email}
          onChange={handleInputChange}
        />

        {/* Logo */}
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

        {/* Main Images */}
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
          {limitedMainImages.map((img, i) => (
            <div key={img.preview} className="gallery-item-wrapper image-wrapper">
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
            </div>
          ))}
          {limitedMainImages.length < 5 && (
            <div
              className="gallery-placeholder clickable"
              onClick={() => mainImagesInputRef.current?.click()}
            >
              +
            </div>
          )}
        </div>

        {/* Actions */}
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

      {/* ----- עמודת התצוגה המקדימה ----- */}
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
    </>
  );
}
