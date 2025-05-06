import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import { dedupeByPreview } from "../../../../../utils/dedupe";
import rawCities from "../../../../../data/cities";
import ALL_CATEGORIES from "../../../../../data/categories";
import Gallery from "../../../components/Gallery";  // עדכון הנתיב בהתאם

// הכנה של אופציות מסודרות ומסוננות
const CITIES = Array.from(new Set(rawCities)).sort((a, b) =>
  a.localeCompare(b, "he")
);
const categoryOptions = ALL_CATEGORIES.map(cat => ({ value: cat, label: cat }));
const cityOptions = CITIES.map(city => ({ value: city, label: city }));

export default function MainSection({
  businessDetails,
  handleInputChange,
  handleMainImagesChange,  // יש לוודא שהיא מועברת כפרופס
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
  const [isLoading, setIsLoading] = useState(false);  // מצב טעינה
  const containerRef = useRef();

  // סינון ותיחום תמונות
  const mainImages = businessDetails.mainImages || [];
  const uniqueImages = dedupeByPreview(mainImages);
  const limitedMainImgs = uniqueImages.slice(0, 5);

  // סגירת תפריטי react-select כאשר לוחצים מחוץ
  useEffect(() => {
    const onClickOutside = e => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        // react-select ייסגר אוטומטית
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // עטיפת onChange כדי לחקות את האירוע של קלט מקורי
  const wrapSelectChange = name => option =>
    handleInputChange({
      target: { name, value: option ? option.value : "" }
    });

  return (
    <>
      <div className="form-column" ref={containerRef}>
        <h2>🎨 ערוך פרטי העסק</h2>

        {/* שם העסק */}
        <label>
          שם העסק: <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="text"
          name="name"
          value={businessDetails.name || ""}
          onChange={handleInputChange}
          placeholder="הזן את שם העסק"
          required
          disabled={isSaving}
        />

        {/* תיאור */}
        <label>תיאור:</label>
        <textarea
          name="description"
          value={businessDetails.description || ""}
          onChange={handleInputChange}
          placeholder="הזן תיאור קצר"
          disabled={isSaving}
        />

        {/* טלפון */}
        <label>טלפון:</label>
        <input
          type="text"
          name="phone"
          value={businessDetails.phone || ""}
          onChange={handleInputChange}
          placeholder="הזן מספר טלפון"
          disabled={isSaving}
        />

        {/* קטגוריה */}
        <label>
          קטגוריה: <span style={{ color: "red" }}>*</span>
        </label>
        <Select
          options={categoryOptions}
          value={categoryOptions.find(o => o.value === businessDetails.category) || null}
          onChange={wrapSelectChange("category")}
          isDisabled={isSaving}
          placeholder="הזן קטגוריה"
          isClearable
          menuPlacement="bottom"
          openMenuOnClick={false}
          openMenuOnFocus={false}
          openMenuOnInput
          filterOption={({ label }, input) =>
            label.toLowerCase().startsWith(input.toLowerCase())
          }
          noOptionsMessage={({ inputValue }) =>
            inputValue ? "לא נמצאו קטגוריות תואמות" : null
          }
          menuPortalTarget={document.body}
          styles={{
            menuPortal: base => ({ ...base, zIndex: 9999 })
          }}
        />

        {/* עיר */}
        <label>
          עיר: <span style={{ color: "red" }}>*</span>
        </label>
        <Select
          options={cityOptions}
          value={cityOptions.find(o => o.value === businessDetails.city) || null}
          onChange={wrapSelectChange("city")}
          isDisabled={isSaving}
          placeholder="הזן עיר"
          isClearable
          menuPlacement="bottom"
          openMenuOnClick={false}
          openMenuOnFocus={false}
          openMenuOnInput
          filterOption={({ label }, input) =>
            label.toLowerCase().startsWith(input.toLowerCase())
          }
          noOptionsMessage={({ inputValue }) =>
            inputValue ? "לא נמצאו ערים תואמות" : null
          }
          menuPortalTarget={document.body}
          styles={{
            menuPortal: base => ({ ...base, zIndex: 9999 })
          }}
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
          העלה לוגו
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
          onChange={handleMainImagesChange}  // שימוש בפרופס כאן
          disabled={isSaving}
        />

        {/* גלריה */}
        <Gallery
          images={limitedMainImgs}
          onImageDelete={handleDeleteImage}
          isSaving={isSaving}
          onImageSelect={() => mainImagesInputRef.current?.click()}
          isLoading={isLoading}
        />

        {/* כפתור שמירה */}
        <button className="save-btn" onClick={handleSave} disabled={isSaving}>
          {isSaving ? "שומר..." : "💾 שמור שינויים"}
        </button>

        {showViewProfile && (
          <button
            type="button"
            className="save-btn"
            style={{ marginTop: "0.5rem" }}
            onClick={() => navigate(`/business/${currentUser.businessId}`)}
            disabled={isSaving}
          >
            👀 צפה בפרופיל
          </button>
        )}
      </div>

      {/* עמודה תצוגה מקדימה */}
      <div className="preview-column">
        {renderTopBar?.()}
        <div className="preview-images">
          <Gallery
            images={limitedMainImgs}
            onImageDelete={handleDeleteImage}
            isSaving={isSaving}
            onImageSelect={() => mainImagesInputRef.current?.click()}
            isLoading={isLoading}
          />
        </div>
      </div>
    </>
  );
}
