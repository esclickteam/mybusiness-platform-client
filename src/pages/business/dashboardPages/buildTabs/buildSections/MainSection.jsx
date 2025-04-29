// src/pages/business/dashboardPages/buildTabs/buildSections/MainSection.jsx

import React from "react";
import "../../build/Build.css";
// תיקון: חמש רמות מעלה מ‐buildSections עד ל‐src/utils
import { dedupeByPreview } from "../../../../../utils/dedupe";

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
  // 1) המערך הגולמי
  const mainImages = businessDetails.mainImages || [];

  // 2) הסרת כפילויות (blob vs URL)
  const uniqueImages = dedupeByPreview(mainImages);

  // 3) חיתוך ל־5 תמונות ראשיות
  const limitedMainImages = uniqueImages.slice(0, 5);

  return (
    <>
      {/* ----- עמודת הטופס ----- */}
      <div className="form-column">
        <h2>🎨 עיצוב הכרטיס</h2>

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
        />

        <label>תיאור:</label>
        <textarea
          name="description"
          value={businessDetails.description || ""}
          onChange={handleInputChange}
          placeholder="הכנס תיאור קצר של העסק"
        />

        <label>טלפון:</label>
        <input
          type="text"
          name="phone"
          value={businessDetails.phone || ""}
          onChange={handleInputChange}
          placeholder="הכנס טלפון"
        />

        <label>
          קטגוריה: <span style={{ color: "red" }}>*</span>
        </label>
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

        <label>
  עיר: <span style={{ color: "red" }}>*</span>
</label>
<input
  type="text"
  name="city"
  value={businessDetails.city || ""}
  onChange={handleInputChange}
  placeholder="לדוגמה: תל אביב"
  required
/>


        {/* לוגו */}
        <label>לוגו:</label>
        <input
          type="file"
          name="logo"
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
              >
                🗑️
              </button>
            </div>
          ))}
          {limitedMainImages.length < 5 && (
            <div
              className="gallery-placeholder clickable"
              onClick={() => mainImagesInputRef.current?.click()}
            >
              +
            </div>
          )}
        </div>

        {/* כפתור שמירה ו־"צפה בפרופיל" */}
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

      {/* ----- עמודת התצוגה המקדימה ----- */}
      <div className="preview-column">
        {renderTopBar && renderTopBar()}

        <div className="preview-images">
          {limitedMainImages.map((img, i) => (
            <div key={i} className="image-wrapper">
              <img src={img.preview} alt={`תמונה ראשית ${i + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
