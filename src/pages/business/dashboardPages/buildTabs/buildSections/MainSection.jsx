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
  mainImagesInputRef
}) {
  const [editIndex, setEditIndex] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const mainImages = businessDetails.mainImages || [];

  // עדכון גודל התמונה
  const updateImageSize = (sizeType) => {
    if (editIndex === null) return;

    setBusinessDetails(prev => {
      const updated = [...prev.mainImages];
      updated[editIndex].size = sizeType;
      return { ...prev, mainImages: updated };
    });

    setIsPopupOpen(false);
    setEditIndex(null);
  };

  // פונקציה למחיקת תמונה
  const handleDeleteImage = (index) => {
    const updatedMainImages = [...businessDetails.mainImages];
    updatedMainImages.splice(index, 1);

    setBusinessDetails(prev => ({ ...prev, mainImages: updatedMainImages }));

    track(
      API.put("/business/my/main-images", { mainImages: updatedMainImages.map(item => item.preview) })
        .then(res => {
          if (res.status === 200) {
            const wrapped = res.data.mainImages.map(url => ({ preview: url }));
            setBusinessDetails(prev => ({ ...prev, mainImages: wrapped }));
          }
        })
        .catch(console.error)
    );
  };

  // פתיחת פופאפ לעריכת גודל התמונה
  const handleEditImage = (index) => {
    setEditIndex(index);
    setIsPopupOpen(true);
  };

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
          name="logo"
          accept="image/*"
          style={{ display: "none" }}
          ref={logoInputRef}
          onChange={() => {/* handled in Build.jsx */}}
        />
        <button onClick={() => logoInputRef.current?.click()} type="button" className="save-btn">
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
          {mainImages.map((img, i) => (
            <div key={i} className="gallery-item-wrapper image-wrapper">
              <img
                src={img.preview}
                alt={`תמונה ראשית ${i + 1}`}
                className="gallery-img"
              />
              {/* כפתור מחיקה עם אימוג'י */}
              <button
                className="delete-btn"
                onClick={() => handleDeleteImage(i)}
                type="button"
                title="מחיקה"
              >
                🗑️
              </button>
              {/* כפתור עריכה עם אימוג'י */}
              <button
                className="edit-btn"
                onClick={() => handleEditImage(i)}
                type="button"
                title="עריכה"
              >
                ✏️
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
        <button onClick={handleSave} className="save-btn" disabled={isSaving}>
          {isSaving ? "שומר..." : "💾 שמור"}
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
        {renderTopBar()}

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

      {/* פופאפ גודל תמונה */}
      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>בחר גודל תמונה</h3>
            <button onClick={() => updateImageSize('full')}>גודל מלא</button>
            <button onClick={() => updateImageSize('custom')}>גודל מותאם</button>
            <button onClick={() => setIsPopupOpen(false)}>ביטול</button>
          </div>
        </div>
      )}
    </>
  );
}