import React, { useState, useRef, useEffect } from "react";
import GalleryDndKit from "./GalleryDndKit.jsx";
import "./GalleryTab.css";

const GalleryTab = ({
  isForm,
  businessDetails,
  setBusinessDetails,
  galleryTabInputRef,
  editGalleryTabIndex,
  setEditGalleryTabIndex,
  handleConfirmEdit,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const popupRef = useRef(null);

  const galleryTabImages = businessDetails?.galleryTabImages || [];
  const galleryTabFits = businessDetails?.galleryTabFits || {};

  // ✅ פונקציית מחיקה מובנית
  const handleDeleteGalleryTabImage = (indexToRemove) => {
    setBusinessDetails((prev) => ({
      ...prev,
      galleryTabImages: prev.galleryTabImages.filter((_, i) => i !== indexToRemove),
    }));
  };

  const handleFitChange = (index, fit) => {
    setBusinessDetails((prev) => ({
      ...prev,
      galleryTabFits: {
        ...prev.galleryTabFits,
        [index]: fit,
      },
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
              key={item.id || index}
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
                    (prev) =>
                      (prev - 1 + galleryTabImages.length) % galleryTabImages.length
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
                  style={{
                    objectFit: galleryTabFits[activeImageIndex] || "cover",
                  }}
                />
              ) : (
                <video
                  src={galleryTabImages[activeImageIndex].url}
                  controls
                  className="modal-media"
                  style={{
                    objectFit: galleryTabFits[activeImageIndex] || "cover",
                  }}
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
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target) &&
        !e.target.closest(".edit-btn")
      ) {
        if (typeof setEditGalleryTabIndex === "function") {
          setEditGalleryTabIndex(null);
        }
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [editGalleryTabIndex]);

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    const existing = galleryTabImages.map(
      (img) => img?.file?.name + img?.file?.size
    );
    const newImages = files
      .filter((file) => !existing.includes(file.name + file.size))
      .map((file) => {
        const isVideo = file.type.startsWith("video");
        return {
          id: `${Date.now()}-${Math.random()}`,
          file,
          url: URL.createObjectURL(file),
          type: isVideo ? "video" : "image",
        };
      });

    setBusinessDetails((prev) => ({
      ...prev,
      galleryTabImages: [...(prev?.galleryTabImages || []), ...newImages],
    }));
  };

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
      <button
        onClick={() => galleryTabInputRef.current.click()}
        className="upload-btn"
      >
        ➕ הוספת מדיה
      </button>
      <p className="info-note">ניתן לגרור ולשנות את הסדר</p>

      <GalleryDndKit
        images={galleryTabImages}
        setImages={(newImages) =>
          setBusinessDetails((prev) => ({
            ...prev,
            galleryTabImages: newImages,
          }))
        }
        setActiveImageIndex={setActiveImageIndex}
        isForm={true}
        onDelete={handleDeleteGalleryTabImage} // ✅ עכשיו עובד מבפנים
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
