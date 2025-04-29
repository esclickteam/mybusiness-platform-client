// src/pages/business/dashboardPages/buildTabs/buildSections/MainSection.jsx
import React, { useEffect, useRef, useMemo } from "react";
import Select from "react-select";
import { dedupeByPreview } from "../../../../../utils/dedupe";
import rawCities from "../../../../../data/cities";
import ALL_CATEGORIES from "../../../../../data/categories";

// Prepare options just once
const CITIES = Array.from(new Set(rawCities)).sort((a, b) => a.localeCompare(b, "he"));
const categoryOptions = ALL_CATEGORIES.map(cat => ({ value: cat, label: cat }));
const cityOptions    = CITIES.map(city => ({ value: city, label: city }));

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

  // Deduplicate & limit
  const mainImages     = businessDetails.mainImages || [];
  const uniqueImages   = dedupeByPreview(mainImages);
  const limitedMainImgs = uniqueImages.slice(0, 5);

  // Close react-select menus if clicked outside
  useEffect(() => {
    const onClickOutside = e => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        // react-select menus auto-close
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Wrap react-select onChange so it calls the same handler shape as native inputs
  const wrapSelectChange = name => option => {
    handleInputChange({
      target: { name, value: option ? option.value : "" }
    });
  };

  return (
    <>
      <div className="form-column" ref={containerRef}>
        <h2>🎨 עריכת פרטי העסק</h2>

        {/* שם העסק */}
        <label>שם העסק: <span style={{ color: "red" }}>*</span></label>
        <input
          type="text"
          name="name"
          value={businessDetails.name || ""}
          onChange={handleInputChange}
          placeholder="הכנס שם העסק"
          required
          disabled={isSaving}
        />

        {/* תיאור */}
        <label>תיאור:</label>
        <textarea
          name="description"
          value={businessDetails.description || ""}
          onChange={handleInputChange}
          placeholder="הכנס תיאור קצר"
          disabled={isSaving}
        />

        {/* טלפון */}
        <label>טלפון:</label>
        <input
          type="text"
          name="phone"
          value={businessDetails.phone || ""}
          onChange={handleInputChange}
          placeholder="הכנס טלפון"
          disabled={isSaving}
        />

        {/* קטגוריה */}
        <label>קטגוריה: <span style={{ color: "red" }}>*</span></label>
        <Select
          options={categoryOptions}
          value={categoryOptions.find(o => o.value === businessDetails.category) || null}
          onChange={wrapSelectChange("category")}
          isDisabled={isSaving}
          placeholder="הקלד או בחר קטגוריה"
          isClearable
          menuPlacement="bottom"
        />

        {/* עיר */}
        <label>עיר: <span style={{ color: "red" }}>*</span></label>
        <Select
          options={cityOptions}
          value={cityOptions.find(o => o.value === businessDetails.city) || null}
          onChange={wrapSelectChange("city")}
          isDisabled={isSaving}
          placeholder="הקלד או בחר עיר"
          isClearable
          menuPlacement="bottom"
        />

        {/* לוגו */}
        <label>לוגו:</label>
        <input
          type="file"
          name="logo"
          accept="image/*"
          style={{ display: "none" }}
          ref={logoInputRef}
          disabled={isSaving}
        />
        <button
          type="button"
          className="save-btn"
          onClick={() => logoInputRef.current?.click()}
          disabled={isSaving}
        >
          העלאת לוגו
        </button>

        {/* תמונות ראשיות */}
        <label>תמונות ראשיות:</label>
        <input
          type="file"
          name="main-images"
          multiple
          accept="image/*"
          style={{ display: "none" }}
          ref={mainImagesInputRef}
          onChange={handleMainImagesChange}
          disabled={isSaving}
        />
        <div className="gallery-preview">
          {limitedMainImgs.map((img, i) => (
            <div key={i} className="gallery-item-wrapper image-wrapper">
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
                disabled={isSaving}
              >
                🗑️
              </button>
            </div>
          ))}
          {limitedMainImgs.length < 5 && (
            <div
              className="gallery-placeholder clickable"
              onClick={() => mainImagesInputRef.current?.click()}
            >
              +
            </div>
          )}
        </div>

        {/* שמירה */}
        <button
          className="save-btn"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? "שומר..." : "💾 שמור ושמור שינויים"}
        </button>

        {showViewProfile && (
          <button
            type="button"
            className="save-btn"
            style={{ marginTop: "0.5rem" }}
            onClick={() =>
              navigate(`/business/${currentUser.businessId}`)
            }
            disabled={isSaving}
          >
            👀 צפה בפרופיל
          </button>
        )}
      </div>

      {/* תצוגת תצוגה מקדימה */}
      <div className="preview-column">
        {renderTopBar?.()}
        <div className="preview-images">
          {limitedMainImgs.map((img, i) => (
            <div key={i} className="image-wrapper">
              <img src={img.preview} alt={`תמונה ראשית ${i + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
