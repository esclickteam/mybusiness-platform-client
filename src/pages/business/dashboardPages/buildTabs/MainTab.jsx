// src/buildTabs/MainTab.jsx

import React from "react";
import "../build/Build.css";
import "./MainTab.css";
import { dedupeByPreview } from "../utils/dedupe";

export default function MainTab({ businessDetails }) {
  // 1) קבלת המערך
  const mainImages = businessDetails.mainImages || [];

  // 2) נורמליזציה: כל רשומה תיהיה אובייקט עם שדה `preview`
  const normalized = mainImages.map(item => {
    if (!item) return null;
    if (typeof item === "string") return { preview: item };
    if (item.preview) return item;
    return { preview: item.url || "" };
  }).filter(Boolean);

  // 3) הסרת כפילויות (blob + URL)
  const unique = dedupeByPreview(normalized);

  // 4) הגבלה ל-5 פריטים
  const imagesToShow = unique.slice(0, 5);

  // 5) אם אין תמונות – הצגת טקסט ריק
  if (imagesToShow.length === 0) {
    return (
      <div className="gallery-preview no-actions">
        <p className="no-images">אין תמונות ראשיות להצגה</p>
      </div>
    );
  }

  // 6) רינדור התמונות
  return (
    <div className="gallery-preview no-actions">
      {imagesToShow.map((item, i) => (
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
