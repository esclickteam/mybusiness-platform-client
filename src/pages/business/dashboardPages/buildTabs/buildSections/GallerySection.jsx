import React, { useEffect, useRef } from "react";
import ImageLoader from "@components/ImageLoader";
import { dedupeByPreview } from "../../../../../utils/dedupe";
import "./GallerySection.css"; // ייבוא קובץ ה-CSS

export default function GallerySection({
  businessDetails,
  galleryInputRef,
  handleGalleryChange,
  handleDeleteImage,
  isSaving,
  renderTopBar
}) {
  const containerRef = useRef();

  useEffect(() => {
    const onClickOutside = e => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        // No extra cleanup needed
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const wrapped = (businessDetails.gallery || []).map((url, idx) => ({
    preview: url,
    publicId: (businessDetails.galleryImageIds || [])[idx] || null
  }));
  const uniqueImages = dedupeByPreview(wrapped);

  return (
    <>
      {/* צד שמאל: העלאת תמונות + תצוגת תמונות עם כפתורי מחיקה */}
      <div className="form-column" ref={containerRef}>
        <h3>העלאת תמונות לגלריה</h3>
        <input
          type="file"
          name="gallery"
          multiple
          accept="image/*"
          style={{ display: "none" }}
          ref={galleryInputRef}
          onChange={handleGalleryChange}
          disabled={isSaving}
        />
        <button
          type="button"
          className="save-btn"
          onClick={() => galleryInputRef.current?.click()}
          disabled={isSaving}
        >
          הוספת תמונות
        </button>

        {/* כאן השתמשנו במחלקה 'gallery-grid-container edit' */}
        <div className="gallery-grid-container edit" style={{ marginTop: "1rem" }}>
          {uniqueImages.length > 0 ? (
            uniqueImages.map(({ preview, publicId }, i) => (
              <div
                key={publicId || `preview-left-${i}`}
                className="gallery-item-wrapper image-wrapper"
              >
                <img
                  src={preview}
                  alt={`תמונת גלריה ${i + 1}`}
                  className="gallery-img"
                />
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteImage(publicId)}
                  type="button"
                  title="מחיקה"
                  disabled={isSaving}
                >
                  🗑️
                </button>
              </div>
            ))
          ) : (
            <p className="no-data">אין תמונות בגלריה</p>
          )}
        </div>
      </div>

      {/* צד ימין: תצוגת גלריה ללא כפתורי מחיקה */}
      <div className="preview-column">
        {renderTopBar?.()}

        <h3 className="section-title">הגלריה שלנו</h3>
        {/* כאן השתמשנו במחלקה 'gallery-grid-container view' */}
        <div className="gallery-grid-container view">
          {uniqueImages.length > 0 ? (
            uniqueImages.map(({ preview, publicId }, i) => (
              <div
                key={publicId || `preview-${i}`}
                className="gallery-item-wrapper image-wrapper"
              >
                <ImageLoader
                  src={preview}
                  alt={`תמונת גלריה ${i + 1}`}
                  className="gallery-img"
                />
              </div>
            ))
          ) : (
            <p className="no-data">אין תמונות בגלריה</p>
          )}
        </div>
      </div>
    </>
  );
}
