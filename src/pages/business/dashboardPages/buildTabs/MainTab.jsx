// src/pages/business/dashboardPages/buildTabs/MainTab.jsx

import React from "react";
import "../build/Build.css";              // נתיב מתוקן אל Build.css שבתיקיית build
import "./MainTab.css";                   // סגנונות ספציפיים ל־MainTab
import { dedupeByPreview } from "../../../../utils/dedupe";  // ארבע רמות מעלה לתיקיית src/utils

export default function MainTab({ businessDetails }) {
  // 1) קבלת המערך הגולמי
  const raw = businessDetails.mainImages || [];

  // 2) נורמליזציה לכל פריט למבנה { preview: string }
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

  // 3) הסרת כפילויות (blob vs URL)
  const unique = dedupeByPreview(normalized);

  // 4) הגבלת התצוגה לחמש תמונות ראשיות
  const toShow = unique.slice(0, 5);

  // 5) אם אין תמונות להצגה, להציג טקסט חלופי
  if (toShow.length === 0) {
    return (
      <div className="gallery-preview no-actions">
        <p className="no-images">אין תמונות ראשיות להצגה</p>
      </div>
    );
  }

  // 6) רינדור התמונות
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
