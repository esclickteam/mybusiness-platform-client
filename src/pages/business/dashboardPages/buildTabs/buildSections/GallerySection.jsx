import React, { useEffect, useRef } from "react";
import ImageLoader from "@components/ImageLoader";
import { dedupeByPreview } from "../../../../../utils/dedupe";

export default function GallerySection({
  businessDetails,
  galleryInputRef,
  handleGalleryChange,
  handleDeleteImage,
  isSaving,
  renderTopBar
}) {
  const containerRef = useRef();

  // Close menus on outside click if needed
  useEffect(() => {
    const onClickOutside = e => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        // No extra cleanup needed
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Build wrapped list and dedupe
  const wrapped = (businessDetails.gallery || []).map((url, idx) => ({
    preview: url,
    publicId: (businessDetails.galleryImageIds || [])[idx] || null
  }));
  const uniqueImages = dedupeByPreview(wrapped);

  return (
    <>
      {/* Left: upload form + preview images */}
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

        {/* Preview images בצד שמאל */}
        <div className="gallery-preview-left" style={{ marginTop: "1rem" }}>
          {uniqueImages.length > 0 ? (
            uniqueImages.map(({ preview, publicId }, i) => (
              <div
                key={publicId || `preview-left-${i}`}
                className="gallery-item-wrapper image-wrapper"
                style={{ position: "relative", marginBottom: "10px" }}
              >
                <img
                  src={preview}
                  alt={`תמונת גלריה ${i + 1}`}
                  className="gallery-img"
                  style={{ width: "100%", borderRadius: "8px" }}
                />
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteImage(publicId)}
                  type="button"
                  title="מחיקה"
                  disabled={isSaving}
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    background: "rgba(255,255,255,0.7)",
                    borderRadius: "50%",
                    border: "none",
                    cursor: "pointer"
                  }}
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

      {/* Right: gallery preview */}
      <div className="preview-column">
        {renderTopBar?.()}

        <h3 className="section-title">הגלריה שלנו</h3>
        <div className="gallery-grid-container">
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
    </>
  );
}
