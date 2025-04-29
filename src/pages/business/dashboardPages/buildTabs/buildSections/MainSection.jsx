import React, { useState, useEffect, useRef } from "react";
import { dedupeByPreview } from "../../../../../utils/dedupe";
import rawCities from "../../../../../data/cities";
import ALL_CATEGORIES from "../../../../../data/categories";

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
  // autocomplete state
  const [cityQuery, setCityQuery] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [categoryQuery, setCategoryQuery] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const containerRef = useRef();

  // close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = e => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowCityDropdown(false);
        setShowCategoryDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // filter lists
  const filteredCities = CITIES.filter(c => c.toLowerCase().includes(cityQuery.toLowerCase()));
  const filteredCategories = CATEGORIES.filter(c => c.toLowerCase().includes(categoryQuery.toLowerCase()));

  // images
  const mainImages = businessDetails.mainImages || [];
  const uniqueImages = dedupeByPreview(mainImages);
  const limitedMainImages = uniqueImages.slice(0, 5);

  // selection handlers
  const selectCity = c => {
    handleInputChange({ target: { name: "city", value: c } });
    setCityQuery("");
    setShowCityDropdown(false);
  };
  const selectCategory = c => {
    handleInputChange({ target: { name: "category", value: c } });
    setCategoryQuery("");
    setShowCategoryDropdown(false);
  };

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
{/* Category Select */}
<label>קטגוריה: <span style={{ color: "red" }}>*</span></label>
<select
  name="category"
  value={businessDetails.category || ""}
  onChange={handleInputChange}
  size={CATEGORIES.length > 5 ? 5 : CATEGORIES.length}
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
  size={CITIES.length > 5 ? 5 : CITIES.length}
  required
>
  <option value="" disabled>בחר עיר</option>
  {CITIES.map(city => (
    <option key={city} value={city}>{city}</option>
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
