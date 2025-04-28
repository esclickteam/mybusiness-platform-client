// src/buildTabs/buildSections/GallerySection.jsx

import React from "react";
import "../../build/Build.css";
import API from "@api";                                  // הוספתי import ל־API
import { dedupeByPreview } from "../../utils/dedupe";   // שני שלבים למעלה – buildSections → buildTabs → src → utils

export default function GallerySection({
  businessDetails,
  galleryInputRef,
  setBusinessDetails,
  handleDeleteImage,
  handleEditImage,
  renderTopBar
}) {
  const maxItems = 5;
  const gallery  = businessDetails.gallery || [];

  /* ---- העלאת תמונות ---- */
  const handleGalleryChange = async e => {
    const files = Array.from(e.target.files || []).slice(0, maxItems);
    if (!files.length) return;
    e.target.value = null;

    // 1) הכנת blob-preview
    const previews = files.map(f => ({ file: f, preview: URL.createObjectURL(f) }));

    // 2) עדכון מיידי + סינון כפילויות + חיתוך למקסימום
    setBusinessDetails(prev => ({
      ...prev,
      gallery: dedupeByPreview([ ...prev.gallery, ...previews ]).slice(0, maxItems)
    }));

    // 3) שליחה ל־API
    const fd = new FormData();
    files.forEach(f => fd.append("gallery", f));
    try {
      const res = await API.put("/business/my/gallery", fd);
      if (res.status === 200) {
        // 4) עטיפת ה־URLs שהשרת החזיר
        const wrapped = res.data.gallery.map(url => ({ preview: url }));
        // 5) החלפה מלאה + חיתוך + סינון כפילויות סופית
        setBusinessDetails(prev => ({
          ...prev,
          gallery: dedupeByPreview(wrapped).slice(0, maxItems)
        }));
      } else {
        alert("❌ העלאה נכשלה");
      }
    } catch (err) {
      console.error("שגיאה בהעלאה:", err);
      alert("❌ שגיאה בהעלאה");
    } finally {
      // 6) שחרור זכרון של blob URLs
      previews.forEach(p => URL.revokeObjectURL(p.preview));
    }
  };

  // render
  return (
    <>
      {renderTopBar()}
      <div className="form-column">
        <h3>העלאת תמונות לגלריה</h3>

        <input
          type="file"
          multiple
          accept="image/*"
          style={{ display: "none" }}
          ref={galleryInputRef}
          onChange={handleGalleryChange}
        />

        <button
          onClick={() => galleryInputRef.current?.click()}
          type="button"
          className="save-btn"
          disabled={gallery.length >= maxItems}
        >
          {gallery.length >= maxItems ? "הגעת למקסימום" : "הוספת תמונות"}
        </button>

        <div className="thumbs">
          {gallery.map((img, i) => (
            <div className="thumb" key={img.preview}>
              <img src={img.preview} alt={`gallery-${i}`} />
              <button onClick={() => handleEditImage(i)}>✏️</button>
              <button onClick={() => handleDeleteImage(i)}>🗑️</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
