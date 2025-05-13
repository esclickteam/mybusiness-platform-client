import React, { useEffect, useRef } from "react";
import Select from "react-select";
import { dedupeByPreview } from "../../../../../utils/dedupe";
import rawCities from "../../../../../data/cities";
import ALL_CATEGORIES from "../../../../../data/categories";
import ImageLoader from "@components/ImageLoader";

// Prepare sorted, deduped options
const CITIES = Array.from(new Set(rawCities)).sort((a, b) =>
  a.localeCompare(b, "he")
);
const categoryOptions = ALL_CATEGORIES.map(cat => ({ value: cat, label: cat }));
const cityOptions = CITIES.map(city => ({ value: city, label: city }));

export default function MainSection({
  businessDetails = {},
  handleInputChange,
  handleMainImagesChange,
  handleDeleteImage,
  handleLogoChange,
  handleSave,
  showViewProfile,
  navigate,
  currentUser,
  logoInputRef,
  mainImagesInputRef,
  isSaving,
  renderTopBar
}) {
  const containerRef = useRef();

  // Close react-select menus on outside click
  useEffect(() => {
    const onClickOutside = e => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        // react-select auto-closes
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Build preview+ID objects from state arrays
  const wrappedMainImages =
    (businessDetails.mainImages || []).map((url, idx) => ({
      preview: url,
      publicId: (businessDetails.mainImageIds || [])[idx] || null
    }));

  // Deduplicate & limit to 5
  const limitedMainImgs = dedupeByPreview(wrappedMainImages).slice(0, 5);

  // wrap Select onChange to mimic native input event
  const wrapSelectChange = name => option =>
    handleInputChange({ target: { name, value: option ? option.value : "" } });

  const {
    businessName = "",
    description = "",
    phone = "",
    category = "",
    address = {}
  } = businessDetails;
  const { city = "" } = address;

  return (
    <>
      <div className="form-column" ref={containerRef}>
        <h2>🎨 עריכת פרטי העסק</h2>

        {/* שם העסק */}
        <label>
          שם העסק: <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="text"
          name="businessName"
          value={businessName}
          onChange={handleInputChange}
          placeholder="הכנס שם העסק"
          required
          disabled={isSaving}
        />

        {/* תיאור */}
        <label>תיאור:</label>
        <textarea
          name="description"
          value={description}
          onChange={handleInputChange}
          placeholder="הכנס תיאור קצר"
          disabled={isSaving}
        />

        {/* טלפון */}
        <label>טלפון:</label>
        <input
          type="text"
          name="phone"
          value={phone}
          onChange={handleInputChange}
          placeholder="הכנס טלפון"
          disabled={isSaving}
        />

        {/* קטגוריה */}
        <label>
          קטגוריה: <span style={{ color: "red" }}>*</span>
        </label>
        <Select
          options={categoryOptions}
          value={categoryOptions.find(o => o.value === category) || null}
          onChange={wrapSelectChange("category")}
          isDisabled={isSaving}
          placeholder="הקלד קטגוריה"
          isClearable
          menuPlacement="bottom"
          openMenuOnClick={false}
          openMenuOnFocus={false}
          openMenuOnInput
          filterOption={({ label }, input) =>
            label.toLowerCase().startsWith(input.toLowerCase())
          }
          noOptionsMessage={({ inputValue }) =>
            inputValue ? "אין קטגוריות מתאימות" : null
          }
          menuPortalTarget={document.body}
          styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
        />

        {/* עיר */}
        <label>
          עיר: <span style={{ color: "red" }}>*</span>
        </label>
        <Select
          options={cityOptions}
          value={cityOptions.find(o => o.value === city) || null}
          onChange={wrapSelectChange("address.city")}
          isDisabled={isSaving}
          placeholder="הקלד עיר"
          isClearable
          menuPlacement="bottom"
          openMenuOnClick={false}
          openMenuOnFocus={false}
          openMenuOnInput
          filterOption={({ label }, input) =>
            label.toLowerCase().startsWith(input.toLowerCase())
          }
          noOptionsMessage={({ inputValue }) =>
            inputValue ? "אין ערים מתאימות" : null
          }
          menuPortalTarget={document.body}
          styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
        />

        {/* לוגו */}
        <label>לוגו:</label>
        <input
          type="file"
          name="logo"
          accept="image/*"
          style={{ display: "none" }}
          ref={logoInputRef}
          onChange={handleLogoChange}
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
          {limitedMainImgs.map(({ preview, publicId }, i) => (
            <div key={publicId || `preview-${i}`} className="gallery-item-wrapper image-wrapper">
              <ImageLoader src={preview} alt="תמונה ראשית" className="gallery-img" />
              <button
                className="delete-btn"
                onClick={() => handleDeleteImage(publicId)}
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
        <button className="save-btn" onClick={handleSave} disabled={isSaving}>
          {isSaving ? "שומר..." : "💾 שמור שינויים"}
        </button>

        {showViewProfile && (
          <button
            type="button"
            className="save-btn"
            style={{ marginTop: "0.5rem" }}
            onClick={() => navigate(`/business/${businessDetails._id}`)}
            disabled={isSaving}
          >
            👀 צפה בפרופיל
          </button>
        )}
      </div>

      {/* תצוגה מקדימה */}
      <div className="preview-column">
        {renderTopBar?.()}
        <div className="preview-images">
          {limitedMainImgs.map(({ preview }, i) => (
            <div key={i} className="image-wrapper">
              <ImageLoader src={preview} alt="תמונה ראשית" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}