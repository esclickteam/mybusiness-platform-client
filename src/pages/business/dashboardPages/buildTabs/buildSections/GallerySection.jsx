import React from "react";
import "../../build/Build.css";
import { ReactComponent as DeleteIcon } from "../../../../../assets/delete.svg";
import { ReactComponent as EditIcon } from "../../../../../assets/edit.svg";

export default function GallerySection({
  businessDetails,
  galleryInputRef,
  handleGalleryChange,
  handleDeleteImage,
  handleEditImage,
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
        <button onClick={() => galleryInputRef.current?.click()} type="button">
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
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteImage(i)}
                  type="button"
                >
                  <DeleteIcon />
                </button>
                <button
                  className="edit-btn"
                  onClick={() => handleEditImage(i)}
                  type="button"
                >
                  <EditIcon />
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
        <div className="gallery-preview">
          {gallery.length > 0 ? (
            gallery.map((item, i) => (
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
                >
                  <DeleteIcon />
                </button>
                <button
                  className="edit-btn"
                  onClick={() => handleEditImage(i)}
                  type="button"
                >
                  <EditIcon />
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
