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
  handleDeleteImage,
  handleEditImage,
  isSaving
}) {
  const [editIndex, setEditIndex] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const mainImages = businessDetails.mainImages || [];

  // open popup for editing size
  const openEditPopup = index => {
    setEditIndex(index);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setEditIndex(null);
  };

  return (
    <>
      {/* ----- Form column ----- */}
      <div className="form-column">
        {renderTopBar && renderTopBar()}

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
          accept="image/*"
          multiple
          style={{ display: "none" }}
          ref={mainImagesInputRef}
          onChange={handleMainImagesChange}
        />
        <div className="gallery-preview">
          {mainImages.map((img, i) => (
            <div key={i} className="gallery-item-wrapper image-wrapper">
              <img
                src={img.preview}
                alt={`תמונה ראשית ${i + 1}`}
                className="gallery-img"
              />
              <button
                className="edit-btn"
                onClick={() => openEditPopup(i)}
                type="button"
                title="עריכה"
              >
                ✏️
              </button>
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
          {mainImages.length < 5 && (
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

      {/* ----- Preview column ----- */}
      <div className="preview-column">
        <MainTab businessDetails={businessDetails} />
      </div>

      {/* Edit size popup */}
      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>בחר גודל תמונה</h3>
            <button onClick={() => { handleEditImage(editIndex, 'full'); closePopup(); }}>
              גודל מלא
            </button>
            <button onClick={() => { handleEditImage(editIndex, 'custom'); closePopup(); }}>
              גודל מותאם
            </button>
            <button onClick={closePopup}>ביטול</button>
          </div>
        </div>
      )}
    </>
  );
}
