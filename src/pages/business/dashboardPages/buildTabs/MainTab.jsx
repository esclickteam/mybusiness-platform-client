// src/pages/business/dashboardPages/buildTabs/MainTab.jsx

import React from "react";
// הנתיב אל Build.css שבתיקיית build (מתוך buildTabs → ../build)
import "../build/Build.css";
import "./MainTab.css";
// הנתיב אל dedupe.js בתיקיית src/utils (4 רמות מעלה מ-buildTabs)
import { dedupeByPreview } from "../../../../utils/dedupe";

export default function MainTab({ businessDetails }) {
  // 1) קבל את המערך הגולמי
  const raw = businessDetails.mainImages || [];

  // 2) נרמל כל פריט למבנה { preview: string }
  const normalized = raw
    .map(item => {
      if (typeof item === "string") {
        return { preview: item };
      }
      if (item && item.preview) {
        return item;
      }
      if (item && item.url) {
        return { preview: item.url };
      }
      return null;
    })
    .filter(Boolean);

  // 3) הסר כפילויות (blob vs URL)
  const unique = dedupeByPreview(normalized);

  // 4) הגבל ל־5 תמונות ראשיות
  const toShow = unique.slice(0, 5);

  // 5) אם אין תמונות – הצג הודעה
  if (toShow.length === 0) {
    return (
      <div className="gallery-preview no-actions">
        <p className="no-images">אין תמונות ראשיות להצגה</p>
      </div>
    );
  }

  // 6) רנדר התמונות הנקיות
  return (
    <div className="gallery-preview no-actions">
      {toShow.map((item, i) => (
        <div key={item.preview} className="gallery-item-wrapper">
          <div className="gallery-item">
            <img
              src={item.preview}
              alt={`תמונה ראשית ${i + 1}`}
              className="gallery-img"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
