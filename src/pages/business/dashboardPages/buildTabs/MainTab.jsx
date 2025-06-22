import React from "react";
// CSS של ה־Build (מתיקיית build המקבילה ל־buildTabs)
import "../build/Build.css";
// CSS ספציפי ל־MainTab
import "./MainTab.css";
// נתיב נכון אל ה-utils: ארבע רמות מעלה מ-buildTabs → src/utils
import { dedupeByPreview } from "../../../../utils/dedupe";

export default function MainTab({ businessDetails }) {
  // 1) קח את מערך התמונות לבד
  const raw = businessDetails.mainImages || [];

  // 2) נרמל כל פריט למבנה { preview }
  const normalized = raw
    .map(item => {
      if (typeof item === "string") return { preview: item };
      if (item && item.preview) return item;
      if (item && item.url) return { preview: item.url };
      return null;
    })
    .filter(Boolean);

  // 3) הסר כפילויות blob vs URL
  const unique = dedupeByPreview(normalized);

  // 4) וחתוך ל-5 פריטים
  const toShow = unique.slice(0, 6);

  // 5) אם אין תמונות – הצג הודעה
  if (toShow.length === 0) {
    return (
      <div className="main-images-grid empty">
        <p className="no-images">אין תמונות להצגה</p>
      </div>
    );
  }

  // 6) רנדר התמונות במבנה 3 בשורה
  return (
    <div className="main-images-grid">
      {toShow.map((item, i) => (
        <div key={item.preview} className="grid-item">
          <img
            src={item.preview}
            alt={`תמונה ראשית ${i + 1}`}
            className="grid-img"
          />
        </div>
      ))}
    </div>
  );
}
