import React from "react";
import "../../build/Build.css";

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
  const mainImages = businessDetails.mainImages || [];
  // הגבלה ל-5 תמונות ראשיות בלבד
  const limitedMainImages = mainImages.slice(0, 5);

  return (
    <>
      {/* ----- עמודת הטופס (עריכה) ----- */}
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

        {/* Main Images Upload */}
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

        {/* Main Images Preview */}
        <h3 className="section-title">תמונות ראשיות</h3>
        <div
          className="gallery-scroll-container"
          style={{
            display: 'flex',
            gap: '1rem',
            overflowX: 'auto',
            padding: '1rem 0'
          }}
        >
          {limitedMainImages.length > 0 ? (
            limitedMainImages.map((img, i) => (
              <div
                key={i}
                className="gallery-item-wrapper"
                style={{ position: 'relative', minWidth: '150px' }}
              >
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
                  style={{ position: 'absolute', top: 4, right: 4 }}
                >
                  🗑️
                </button>
              </div>
            ))
          ) : (
            <p className="no-data">אין תמונות ראשיות</p>
          )}
        </div>
      </div>
    </>
  );
}
