// src/pages/business/dashboardPages/buildTabs/buildSections/GallerySection.jsx

import React from "react";
import "../../build/Build.css";
import API from "@api";
import { dedupeByPreview } from "../../../../../utils/dedupe";

export default function GallerySection({
  businessDetails,
  galleryInputRef,
  setBusinessDetails,
  handleDeleteImage,
  renderTopBar
}) {
  const maxItems = 5;
  const gallery  = businessDetails.gallery || [];

  // 1) סינון כפילויות וחתוך למקסימום
  const limitedGallery = dedupeByPreview(gallery).slice(0, maxItems);

  const handleGalleryChange = async e => {
    // 2) בוחרים עד למספר התמונות שנותרו
    const remaining = maxItems - limitedGallery.length;
    const files = Array.from(e.target.files || []).slice(0, remaining);
    if (!files.length) return;
    e.target.value = null;

    // 3) הצגת Blob previews
    const previews = files.map(f => ({ file: f, preview: URL.createObjectURL(f) }));
    setBusinessDetails(prev => ({
      ...prev,
      gallery: [...prev.gallery, ...previews]
    }));

    // 4) שליחה ל־API
    const fd = new FormData();
    files.forEach(f => fd.append("gallery", f));
    try {
      const res = await API.put("/business/my/gallery", fd);
      if (res.status === 200) {
        const wrapped = res.data.gallery.map(url => ({ preview: url }));
        setBusinessDetails(prev => ({
          ...prev,
          gallery: wrapped
        }));
      } else {
        alert("❌ העלאה נכשלה");
      }
    } catch (err) {
      console.error(err);
      alert("❌ שגיאה בהעלאה");
    } finally {
      previews.forEach(p => URL.revokeObjectURL(p.preview));
    }
  };

  return (
    <>
      {renderTopBar && renderTopBar()}
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
          disabled={limitedGallery.length >= maxItems}
        >
          {limitedGallery.length >= maxItems ? "הגעת למקסימום" : "הוספת תמונות"}
        </button>

        <div className="thumbs">
          {limitedGallery.map((img, i) => (
            <div className="thumb" key={img.preview}>
              <img src={img.preview} alt={`gallery-${i}`} />
              <button onClick={() => handleDeleteImage(i)}>🗑️</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
