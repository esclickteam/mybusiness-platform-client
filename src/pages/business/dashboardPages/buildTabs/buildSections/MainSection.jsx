import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import { dedupeByPreview } from "../../../../../utils/dedupe";
import rawCities from "../../../../../data/cities";
import ALL_CATEGORIES from "../../../../../data/categories";

// Prepare sorted, deduped options
const CITIES = Array.from(new Set(rawCities)).sort((a, b) =>
  a.localeCompare(b, "he")
);
const categoryOptions = ALL_CATEGORIES.map(cat => ({ value: cat, label: cat }));
const cityOptions = CITIES.map(city => ({ value: city, label: city }));

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
  // הוספת useState למעקב אחרי מצב טעינת התמונות
  const [isLoading, setIsLoading] = useState(false);  // מצב טעינה

  const containerRef = useRef();

  // dedupe & limit images
  const mainImages = businessDetails.mainImages || [];
  const uniqueImages = dedupeByPreview(mainImages);
  const limitedMainImgs = uniqueImages.slice(0, 5);

  // close react-select menus on outside click
  useEffect(() => {
    const onClickOutside = e => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        // react-select will auto-close
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // wrap onChange to mimic native input event
  const wrapSelectChange = name => option =>
    handleInputChange({
      target: { name, value: option ? option.value : "" }
    });

  const handleMainImagesChange = async e => {
    // 1) בוחרים עד 5 קבצים
    const files = Array.from(e.target.files || []).slice(0, 5);
    if (!files.length) return;
    e.target.value = null;

    // 2) הכנת פריוויו לשלב ההעלאה
    const previews = files.map(f => ({
      preview: URL.createObjectURL(f),
      file: f
    }));

    // 3) **החלפה מלאה** של mainImages לפריוויו בלבד (blob)
    setBusinessDetails(prev => ({
      ...prev,
      mainImages: previews
    }));

    // 4) אתחול טעינה
    setIsLoading(true);  // התחלת טעינה

    // 5) שליחה ל־API
    const fd = new FormData();
    files.forEach(f => fd.append("main-images", f));
    try {
      const res = await API.put("/business/my/main-images", fd);
      if (res.status === 200) {
        // 6) עטיפת ה־URLs שהשרת החזיר ➞ החלפה מלאה + חיתוך ל-5
        const wrapped = res.data.mainImages
          .slice(0, 5)
          .map(url => ({ preview: url }));
        setBusinessDetails(prev => ({
          ...prev,
          mainImages: wrapped
        }));
      } else {
        console.warn("העלאת תמונות נכשלה:", res);
      }
    } catch (err) {
      console.error("שגיאה בהעלאה:", err);
    } finally {
      setIsLoading(false);  // סיום טעינה

      // 7) ניקוי זיכרון של blob-URLs
      previews.forEach(p => URL.revokeObjectURL(p.preview));
    }
  };

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
        <label>
          קטגוריה: <span style={{ color: "red" }}>*</span>
        </label>
        <Select
          options={categoryOptions}
          value={categoryOptions.find(o => o.value === businessDetails.category) || null}
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
          {isLoading && (
            <div className="spinner">🔄</div>  // הצגת ספינר בזמן טעינה
          )}

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

      {/* תצוגה מקדימה */}
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
