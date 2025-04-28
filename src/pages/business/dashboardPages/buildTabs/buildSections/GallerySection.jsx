import React from "react";
import "../../build/Build.css";

export default function GallerySection({
  businessDetails,
  galleryInputRef,
  handleGalleryChange,
  handleDeleteImage,
  renderTopBar
}) {
  const gallery = businessDetails.gallery || [];

  return (
    <div className="preview-column">
      {/* Top bar and tabs */}
      {renderTopBar && renderTopBar()}

      {/* כותרת וכפתור העלאה בתוך הקיצור */}
      <div className="gallery-upload-wrapper" style={{ textAlign: 'right', margin: '1rem 0' }}>
        <label style={{ display: 'none' }} htmlFor="gallery-upload-input">העלאת תמונות לגלריה</label>
        <input
          id="gallery-upload-input"
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

      {/* תצוגת הגלריה */}
      <h3 className="section-title">הגלריה שלנו</h3>
      <div
        className="gallery-scroll-container"
        style={{ display: 'flex', gap: '1rem', overflowX: 'auto', padding: '1rem 0' }}
      >
        {gallery.length > 0 ? (
          gallery.map((item, i) => (
            <div
              key={i}
              className="gallery-item-wrapper"
              style={{ position: 'relative', minWidth: '150px' }}
            >
              <img
                src={item.preview}
                alt={`תמונת גלריה ${i + 1}`}
                className="gallery-img"
              />
              <button
                className="delete-btn"
                onClick={() => handleDeleteImage(i)}
                type="button"
                title="מחיקה"
                style={{ position: 'absolute', top: 4, right: 4 }}
              >🗑️</button>
            </div>
          ))
        ) : (
          <p className="no-data">אין תמונות בגלריה</p>
        )}
      </div>
    </div>
  );
}
