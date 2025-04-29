import React, { useState, useEffect, useRef } from "react";
import { dedupeByPreview } from "../../../../../utils/dedupe";
import ALL_CITIES from "../../../../../data/cities"; // ייבוא כל הערים כייבוא ברירת מחדל // ייבוא כל הערים מתוך הנתיב הנכון
const CITIES = ALL_CITIES; // רק מייבאים ערים
import "../../build/Build.css";

// נשחזר כאן את רשימת הקטגוריות בתוך הקובץ
const CATEGORIES = [
  "אולם אירועים",
  "אינסטלטור",
  "איפור קבוע",
  "בניית אתרים",
  "בית קפה",
  "ברברשופ",
  "גינון / הדברה",
  "גלריה / חנות אומנות",
  "חנות בגדים",
  "חנויות טבע / בריאות",
  "חשמלאי",
  "טכנאי מחשבים",
  "טכנאי מזגנים",
  "טכנאי סלולר",
  "יועץ מס / רואה חשבון",
  "יוגה / פילאטיס",
  "קייטרינג",
  "כתיבת תוכן / קופירייטינג",
  "מאמן אישי / עסקי",
  "מאמן כושר",
  "מטפלת רגשית / NLP",
  "מדריך טיולים",
  "מדיה / פרסום",
  "מומחה שיווק דיגיטלי",
  "מורה למוזיקה / אומנות",
  "מורה פרטי",
  "מטפל/ת הוליסטי",
  "מזון / אוכל ביתי",
  "מניקור-פדיקור",
  "מסגר",
  "מסעדה",
  "מספרה",
  "מעצב גרפי",
  "מעצב פנים",
  "מציל / מדריך שחייה",
  "מכון יופי",
  "מרצה / מנטור",
  "משפחתון / צהרון / גן",
  "מתווך נדל״ן",
  "נהג / שליחויות",
  "נגר",
  "עורך דין",
  "עיצוב גבות",
  "פסיכולוג / יועץ",
  "קוסמטיקאית",
  "רפואה משלימה",
  "צלם / סטודיו צילום",
  "שיפוצניק",
  "שירותים לקהילה / עמותות",
  "תזונאית / דיאטנית"
];

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
  // עיר - autocomplete dropdown
  const [cityQuery, setCityQuery] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const cityRef = useRef();

  // קטגוריה - dropdown רגיל
  const [selectedCat, setSelectedCat] = useState(businessDetails.category || "");

  // סגירת dropdown של העיר בלחיצה מחוץ
  useEffect(() => {
    const onClickOutside = e => {
      if (cityRef.current && !cityRef.current.contains(e.target)) {
        setShowCityDropdown(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // סינון ערים
  const filteredCities = CITIES.filter(c =>
    c.toLowerCase().includes(cityQuery.toLowerCase())
  );

  const selectCity = c => {
    handleInputChange({ target: { name: "city", value: c } });
    setCityQuery("");
    setShowCityDropdown(false);
  };

  // תמונות ראשיות
  const mainImages = businessDetails.mainImages || [];
  const uniqueImages = dedupeByPreview(mainImages);
  const limitedMainImages = uniqueImages.slice(0, 5);

  return (
    <>
      <div className="form-column">
        <h2>🎨 עיצוב הכרטיס</h2>

        {/* שם */}
        <label>שם העסק: <span style={{ color: "red" }}>*</span></label>
        <input
          type="text"
          name="name"
          value={businessDetails.name || ""}
          onChange={handleInputChange}
          placeholder="הכנס שם העסק"
          required
        />

        {/* תיאור */}
        <label>תיאור:</label>
        <textarea
          name="description"
          value={businessDetails.description || ""}
          onChange={handleInputChange}
          placeholder="הכנס תיאור קצר"
        />

        {/* טלפון */}
        <label>טלפון:</label>
        <input
          type="text"
          name="phone"
          value={businessDetails.phone || ""}
          onChange={handleInputChange}
          placeholder="הכנס טלפון"
        />

        {/* קטגוריה */}
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

        {/* עיר - autocomplete */}
        <label>עיר: <span style={{ color: "red" }}>*</span></label>
        <div className="city-select-container" ref={cityRef}>
          <input
            type="text"
            name="city"
            placeholder="בחר עיר"
            value={showCityDropdown ? cityQuery : (businessDetails.city || "")}
            onFocus={() => { setShowCityDropdown(true); setCityQuery(""); }}
            onChange={e => { setCityQuery(e.target.value); setShowCityDropdown(true); }}
            required
          />
          {showCityDropdown && (
            <ul className="city-dropdown">
              {filteredCities.map(c => (
                <li key={c} onClick={() => selectCity(c)}>{c}</li>
              ))}
              {filteredCities.length === 0 && <li className="no-results">לא נמצאו ערים</li>}
            </ul>
          )}
        </div>

        {/* לוגו */}
        <label>לוגו:</label>
        <input type="file" name="logo" accept="image/*" style={{ display: "none" }} ref={logoInputRef} />
        <button type="button" className="save-btn" onClick={() => logoInputRef.current?.click()}>
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

        {/* שמירה וצפייה */}
        <button className="save-btn" onClick={handleSave} disabled={isSaving}>
          {isSaving ? "שומר..." : "💾 שמור"}
        </button>
        {showViewProfile && (
          <button type="button" className="save-btn" style={{ marginTop: "0.5rem" }} onClick={() => navigate(`/business/${currentUser.businessId}`)}>👀 צפה בפרופיל</button>
        )}
      </div>

      {/* תצוגה מקדימה */}
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
