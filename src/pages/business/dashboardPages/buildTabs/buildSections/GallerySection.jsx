import React from "react";
import "../../build/Build.css";

export default function GallerySection({
  businessDetails,
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
          name="gallery"                     // התאמת השדה בשרת
          multiple
          accept="image/*"
          style={{ display: "none" }}
          ref={galleryInputRef}
          onChange={handleGalleryChange}
        />
        <button onClick={() => galleryInputRef.current?.click()}>
          הוספת תמונות
        </button>

        <div className="gallery-preview">
          {gallery.length > 0 ? (
            gallery.map((item, i) => (
              <div key={i} className="gallery-item-wrapper">
                <img
                  src={item.preview}
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

      {/* צד ימין: Preview כולל Top Bar */}
      <div className="preview-column">
        {renderTopBar && renderTopBar()}
        <h3 className="section-title">הגלריה שלנו</h3>
        <div className="gallery-preview">
          {gallery.length > 0 ? (
            gallery.map((item, i) => (
              <div key={i} className="gallery-item-wrapper">
                <img
                  src={item.preview}
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
