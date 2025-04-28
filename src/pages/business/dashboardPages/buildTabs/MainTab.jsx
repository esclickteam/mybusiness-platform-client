// src/pages/business/dashboardPages/buildTabs/MainTab.jsx

import React from "react";
import "../../build/Build.css";
import "./MainTab.css";
import { dedupeByPreview } from "../../../../utils/dedupe";

export default function MainTab({ businessDetails }) {
  // 1) כלל המערך
  const raw = businessDetails.mainImages || [];

  // 2) נורמליזציה לכל אובייקט: { preview: string }
  const normalized = raw
    .map(item => {
      if (typeof item === "string") return { preview: item };
      if (item && item.preview) return item;
      return item && item.url ? { preview: item.url } : null;
    })
    .filter(Boolean);

  // 3) הסרת כפילויות (blob vs URL)
  const unique = dedupeByPreview(normalized);

  // 4) הגבלה ל־5
  const toShow = unique.slice(0, 5);

  if (toShow.length === 0) {
    return (
      <div className="gallery-preview no-actions">
        <p className="no-images">אין תמונות ראשיות להצגה</p>
      </div>
    );
  }

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
