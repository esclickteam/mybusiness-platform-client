import React, { useState, useRef, useEffect } from "react";
// ייבוא סגנונות גלובליים של העמוד
import "../Build.css";
// סגנונות ספציפיים לטאב הגלריה
import "./GalleryTab.css";

import GalleryDndKit from "./GalleryDndKit";

const GalleryTab = ({
  isForm,
  businessDetails,
  setBusinessDetails,
  galleryTabInputRef,
  editGalleryTabIndex,
  setEditGalleryTabIndex,
  handleDeleteGalleryTabImage,
  handleFitChange,
  handleConfirmEdit,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const popupRef = useRef(null);

  const galleryTabImages = businessDetails.galleryTabImages || [];
  const galleryTabFits = businessDetails.galleryTabFits || {};

  // סגירת הפופאפ בלחיצה מחוץ
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target) &&
        !e.target.closest(".edit-btn")
      ) {
        setEditGalleryTabIndex(null);
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);
    return () => document.removeEventListener("pointerdown", handleClickOutside);
  }, [setEditGalleryTabIndex]);

  // הוספת קבצים חדשים
  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    const existingIds = galleryTabImages.map((img) => img.id);
    const newImages = files
      .map((file) => {
        const isVideo = file.type.startsWith("video");
        const id = `${file.name}-${file.size}-${Date.now()}`;
        return {
          id,
          file,
          url: URL.createObjectURL(file),
          type: isVideo ? "video" : "image",
        };
      })
      .filter((img) => !existingIds.includes(img.id));

    setBusinessDetails((prev) => ({
      ...prev,
      galleryTabImages: [...(prev.galleryTabImages || []), ...newImages],
    }));
  };

  // מצב תצוגה בלבד
  if (!isForm) {
    return (
      <div className="gallery-preview-wrapper">
        <h3>הגלריה שלנו</h3>
        <div className="gallery-instagram-grid">
          {galleryTabImages.map((item, index) => (
            <div
              className="gallery-item-square"
              key={item.id}
              onClick={() => setActiveImageIndex(index)}
            >
              {item.type === "image" ? (
                <img
                  src={item.url}
                  alt=""
                  className="gallery-media"
                  style={{ objectFit: galleryTabFits[index] || "cover" }}
                />
              ) : (
                <video
                  src={item.url}
                  muted
                  className="gallery-media"
                  style={{ objectFit: galleryTabFits[index] || "cover" }}
                />
              )}
            </div>
          ))}
        </div>

        {activeImageIndex !== null && (
          <div className="modal-overlay" onClick={() => setActiveImageIndex(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button
                className="nav-btn left"
                onClick={() =>
                  setActiveImageIndex(
                    (prev) => (prev - 1 + galleryTabImages.length) % galleryTabImages.length
                  )
                }
              >
                ◀
              </button>

              {galleryTabImages[activeImageIndex].type === "image" ? (
                <img
                  src={galleryTabImages[activeImageIndex].url}
                  alt=""
                  className="modal-media"
                  style={{ objectFit: galleryTabFits[activeImageIndex] || "cover" }}
                />
              ) : (
                <video
                  src={galleryTabImages[activeImageIndex].url}
                  controls
                  className="modal-media"
                  style={{ objectFit: galleryTabFits[activeImageIndex] || "cover" }}
                />
              )}

              <button
                className="nav-btn right"
                onClick={() =>
                  setActiveImageIndex((prev) => (prev + 1) % galleryTabImages.length)
                }
              >
                ▶
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // מצב עריכה
  return (
    <div className="gallery-form-wrapper edit-mode">
      <h2>🎨 עיצוב הגלריה</h2>
      <h4>העלאת מדיה</h4>
      <p className="info-note">ניתן להעלות תמונות או סרטונים</p>
      <input
        type="file"
        multiple
        ref={galleryTabInputRef}
        style={{ display: "none" }}
        onChange={handleUpload}
      />
      <button onClick={() => galleryTabInputRef.current.click()} className="upload-btn">
        ➕ הוספת מדיה
      </button>
      <p className="info-note">ניתן לגרור ולשנות את הסדר</p>

      <GalleryDndKit
        images={galleryTabImages}
        setImages={(newImages) =>
          setBusinessDetails((prev) => ({ ...prev, galleryTabImages: newImages }))
        }
        setActiveImageIndex={setActiveImageIndex}
        isForm
        onDelete={handleDeleteGalleryTabImage}
        setEditIndex={setEditGalleryTabIndex}
        editIndex={editGalleryTabIndex}
        handleFitChange={handleFitChange}
        popupRefs={popupRef}
        galleryTabFits={galleryTabFits}
      />

      <button className="save-btn" onClick={handleConfirmEdit}>
        שמור
      </button>
    </div>
  );
};

export default GalleryTab;
