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
      updated[editIndex].size = sizeType; // עדכון הגודל
      return { ...prev, mainImages: updated };
    });

    setIsPopupOpen(false);
    setEditIndex(null);  // איפוס האינדקס לאחר השינוי
  };

  // פונקציה למחיקת תמונה
  const handleDeleteImage = (index) => {
    // מחיקת התמונה מהממשק
    const updatedMainImages = [...businessDetails.mainImages];
    updatedMainImages.splice(index, 1);

    setBusinessDetails(prev => ({
      ...prev,
      mainImages: updatedMainImages
    }));

    // שליחה לשרת
    track(
      API.put("/business/my/main-images", { mainImages: updatedMainImages.map(item => item.preview) })
        .then(res => {
          if (res.status === 200) {
            const wrapped = res.data.mainImages.map(url => ({ preview: url }));
            setBusinessDetails(prev => ({
              ...prev,
              mainImages: wrapped
            }));
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
          onChange={() => {/* handled in TopBar */}}
        />
        <button onClick={() => logoInputRef.current?.click()}>העלאת לוגו</button>

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
              {/* כפתור מחיקה עם SVG */}
              <button className="delete-btn" onClick={() => handleDeleteImage(i)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14H6L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                  <path d="M9 6V4h6v2" />
                </svg>
              </button>
              {/* כפתור עריכה עם SVG */}
              <button className="edit-btn" onClick={() => handleEditImage(i)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                </svg>
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
