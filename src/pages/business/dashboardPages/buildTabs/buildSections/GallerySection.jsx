import React from "react";

export default function GallerySection({
  businessDetails,
  galleryInputRef,
  handleGalleryChange,
  handleDeleteImage,
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

      {/* צד ימין: תצוגת גלריה */}
      <div className="preview-column">
        {renderTopBar && renderTopBar()}

        <h3 className="section-title">הגלריה שלנו</h3>
        <div className="gallery-grid-container">
          {gallery.length > 0 ? (
            gallery.map((item, i) => (
              <div key={item.publicId ?? `preview-${i}`} className="gallery-item-wrapper">
                <img
                  src={item.preview}
                  alt={`תמונת גלריה ${i + 1}`}
                  className="gallery-img"
                />
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteImage(item.publicId, i)}
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