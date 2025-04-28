import React from "react";
import "../../build/Build.css";

export default function GallerySection({
  businessDetails,
  galleryInputRef,
  handleGalleryChange,
  handleDeleteImage,
  handleEditImage,
  renderTopBar
}) {
  const maxItems = 5;
  const gallery = businessDetails.gallery || [];
  const limitedGallery = gallery.slice(0, maxItems);

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
          onClick={() => galleryInputRef.current?.click()}
          type="button"
          className="save-btn"
          disabled={gallery.length >= maxItems}
        >
          {gallery.length >= maxItems ? "הגעת למקסימום" : "הוספת תמונות"}
        </button>

        <div className="gallery-preview">
          {limitedGallery.length > 0 ? (
            limitedGallery.map((item, i) => (
              <div key={i} className="gallery-item-wrapper">
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
                >
                  🗑️
                </button>
                <button
                  className="edit-btn"
                  onClick={() => handleEditImage(i)}
                  type="button"
                  title="עריכה"
                >
                  ✏️
                </button>
              </div>
            ))
          ) : (
            <p className="no-data">אין תמונות בגלריה</p>
          )}
        </div>
      </div>

      {/* צד ימין: תצוגה מקדימה עם ה־Top Bar */}
      <div className="preview-column">
        {renderTopBar && renderTopBar()}

        <h3 className="section-title">הגלריה שלנו</h3>
        <div
          className="gallery-preview"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}
        >
          {limitedGallery.length > 0 ? (
            limitedGallery.map((item, i) => (
              <div key={i} className="gallery-item-wrapper">
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
                >
                  🗑️
                </button>
                <button
                  className="edit-btn"
                  onClick={() => handleEditImage(i)}
                  type="button"
                  title="עריכה"
                >
                  ✏️
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
