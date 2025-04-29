import React, { useState, useEffect, useRef } from "react";
import { dedupeByPreview } from "../../../../../utils/dedupe";
import rawCities from "../../../../../data/cities";
import ALL_CATEGORIES from  "../../../../../data/categories";

// Remove duplicates in cities
const CITIES = Array.from(new Set(rawCities));
// Use categories array
const CATEGORIES = ALL_CATEGORIES;

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
  const containerRef = useRef();

  const mainImages = businessDetails.mainImages || [];
  const uniqueImages = dedupeByPreview(mainImages);
  const limitedMainImages = uniqueImages.slice(0, 5);

  // Handle clicks outside to close any open dropdowns
  useEffect(() => {
    const onClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        // no dropdowns here, using native selects
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <>
      <div className="form-column" ref={containerRef}>
        <h2>🎨 עיצוב הכרטיס</h2>

        {/* Name */}
        <label>שם העסק: <span style={{ color: "red" }}>*</span></label>
        <input
          type="text"
          name="name"
          value={businessDetails.name || ""}
          onChange={handleInputChange}
          placeholder="הכנס שם העסק"
          required
        />

        {/* Description */}
        <label>תיאור:</label>
        <textarea
          name="description"
          value={businessDetails.description || ""}
          onChange={handleInputChange}
          placeholder="הכנס תיאור קצר"
        />

        {/* Phone */}
        <label>טלפון:</label>
        <input
          type="text"
          name="phone"
          value={businessDetails.phone || ""}
          onChange={handleInputChange}
          placeholder="הכנס טלפון"
        />

        {/* Category Select */}
        <label>קטגוריה: <span style={{ color: "red" }}>*</span></label>
        <select
          name="category"
          value={businessDetails.category || ""}
          onChange={handleInputChange}
          required
        >
          <option value="" disabled>בחר קטגוריה</option>
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* City Select */}
        <label>עיר: <span style={{ color: "red" }}>*</span></label>
        <select
          name="city"
          value={businessDetails.city || ""}
          onChange={handleInputChange}
          required
        >
          <option value="" disabled>בחר עיר</option>
          {CITIES.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>

        {/* Logo Upload */}
        <label>לוגו:</label>
        <input
          type="file"
          name="logo"
          accept="image/*"
          style={{ display: "none" }}
          ref={logoInputRef}
        />
        <button type="button" className="save-btn" onClick={() => logoInputRef.current?.click()}>
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
            <div key={i} className="gallery-item-wrapper image-wrapper">
              <img src={img.preview} alt={`תמונה ראשית ${i + 1}`} className="gallery-img" />
              <button className="delete-btn" onClick={() => handleDeleteImage(i)} type="button" title="מחיקה">🗑️</button>
            </div>
          ))}
          {limitedMainImages.length < 5 && (
            <div className="gallery-placeholder clickable" onClick={() => mainImagesInputRef.current?.click()}>+</div>
          )}
        </div>

        {/* Save & View */}
        <button className="save-btn" onClick={handleSave} disabled={isSaving}>
          {isSaving ? "שומר..." : "💾 שמור"}
        </button>
        {showViewProfile && (
          <button type="button" className="save-btn" style={{ marginTop: "0.5rem" }} onClick={() => navigate(`/business/${currentUser.businessId}`)}>👀 צפה בפרופיל</button>
        )}
      </div>

      {/* Preview Column */}
      <div className="preview-column">
        {renderTopBar && renderTopBar()}
        <div className="preview-images">
          {limitedMainImages.map((img, i) => (
            <div key={i} className="image-wrapper"><img src={img.preview} alt={`תמונה ראשית ${i + 1}`} /></div>
          ))}
        </div>
      </div>
    </>
  );
}
