// src/pages/business/dashboardPages/buildTabs/buildSections/GallerySection.jsx

import React from "react";

export default function GallerySection({
  businessDetails,
  setBusinessDetails,
  galleryInputRef,
  handleGalleryChange,
  renderTopBar
}) {
  const gallery = businessDetails.gallery || [];

  return (
    <>
      {/* צד שמאל: טופס העלאה */}
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
        <button onClick={() => galleryInputRef.current?.click()}>
          הוספת תמונות
        </button>

        <div className="gallery-preview no-actions">
          {gallery.map((item, i) => (
            <div key={i} className="gallery-item-wrapper">
              <img
                src={item.preview}
                alt={`gallery-${i}`}
                className="gallery-img"
              />
            </div>
          ))}
        </div>
      </div>

      {/* צד ימין: Preview כולל Top Bar */}
      <div className="preview-column">
        {renderTopBar()}
        <h3 className="section-title">הגלריה שלנו</h3>
        <div className="gallery-preview no-actions">
          {gallery.map((item, i) => (
            <div key={i} className="gallery-item-wrapper">
              <img
                src={item.preview}
                alt={`gallery-${i}`}
                className="gallery-img"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
