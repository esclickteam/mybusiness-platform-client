import React from "react";
import ImageLoader from "@components/ImageLoader";

export default function GallerySection({
  businessDetails,
  galleryInputRef,
  handleGalleryChange,
  handleDeleteImage,
  renderTopBar
}) {
  // Extract raw URLs and IDs from state
  const rawUrls = businessDetails.gallery || [];
  const rawIds  = businessDetails.galleryImageIds || [];
  // Wrap into objects for preview and deletion
  const wrapped = rawUrls.map((url, idx) => ({
    preview:  url,
    publicId: rawIds[idx] || null
  }));

  return (
    <>
      {/* Left: upload form */}
      <div className="form-column">
        <h3>העלאת תמונות לגלריה</h3>
        <input
          type="file"
          name="gallery"
          multiple
          accept="image/*"
          style={{ display: "none" }}
          ref={galleryInputRef}
          onChange={handleGalleryChange}
        />
        <button
          className="save-btn"
          onClick={() => galleryInputRef.current?.click()}
        >
          הוספת תמונות
        </button>
      </div>

      {/* Right: gallery preview */}
      <div className="preview-column">
        {renderTopBar?.()}

        <h3 className="section-title">הגלריה שלנו</h3>
        <div className="gallery-grid-container">
          {wrapped.length > 0 ? (
            wrapped.map(({ preview, publicId }, i) => (
              <div
                key={publicId || `preview-${i}`}
                className="gallery-item-wrapper"
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