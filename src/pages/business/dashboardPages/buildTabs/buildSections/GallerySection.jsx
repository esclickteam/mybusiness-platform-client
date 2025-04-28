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
  // הסרת כפילויות וחתוך למקסימום
  const dedupedGallery = dedupeByPreview(gallery);
  const limitedGallery = dedupedGallery.slice(0, maxItems);

  const handleGalleryChange = async e => {
    const files = Array.from(e.target.files || []).slice(0, maxItems - gallery.length);
    if (!files.length) return;
    e.target.value = null;

    // 1) Blob previews
    const previews = files.map(f => ({ file: f, preview: URL.createObjectURL(f) }));
    setBusinessDetails(prev => ({
      ...prev,
      gallery: dedupeByPreview([...prev.gallery, ...previews]).slice(0, maxItems)
    }));

    // 2) Upload to API
    const fd = new FormData();
    files.forEach(f => fd.append("gallery", f));
    try {
      const res = await API.put("/business/my/gallery", fd);
      if (res.status === 200) {
        const wrapped = res.data.gallery.map(url => ({ preview: url }));
        setBusinessDetails(prev => ({
          ...prev,
          gallery: dedupeByPreview(wrapped).slice(0, maxItems)
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
          disabled={gallery.length >= maxItems}
        >
          {gallery.length >= maxItems ? "הגעת למקסימום" : "הוספת תמונות"}
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
