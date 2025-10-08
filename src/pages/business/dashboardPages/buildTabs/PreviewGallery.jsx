import React, { useState, useRef, useEffect } from "react";
import GalleryDndKit from "./GalleryDndKit";
import "./GalleryTab.css";

const GalleryEditorWithPreview = ({
  isForm,
  businessDetails,
  setBusinessDetails,
  galleryTabInputRef,
  editGalleryTabIndex,
  setEditGalleryTabIndex,
  handleFitChange,
  handleConfirmEdit,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const [modalIndex, setModalIndex] = useState(null);
  const popupRefs = useRef({});

  const galleryTabImages = businessDetails?.galleryTabImages || [];

  // ✅ פונקציית מחיקה פנימית
  const handleDeleteGalleryTabImage = (indexToRemove) => {
    setBusinessDetails((prev) => ({
      ...prev,
      galleryTabImages: prev.galleryTabImages.filter((_, i) => i !== indexToRemove),
    }));
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      const clickedInsidePopup = Object.values(popupRefs.current || {}).some(
        (ref) => ref && ref.contains(e.target)
      );
      const clickedEditBtn = e.target.closest(".edit-btn");

      if (!clickedInsidePopup && !clickedEditBtn) {
        setEditGalleryTabIndex(null);
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
    <div className="preview-gallery-wrapper" style={{ display: "flex", gap: "32px" }}>
      <div className="gallery-form-side" style={{ flex: 1 }}>
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
          onDelete={handleDeleteGalleryTabImage} // ✅ מחובר פנימית
          setEditIndex={setEditGalleryTabIndex}
          editIndex={editGalleryTabIndex}
          handleFitChange={handleFitChange}
          popupRefs={popupRefs}
        />

        <button className="save-btn" onClick={handleConfirmEdit}>
          שמור
        </button>
      </div>

      <div className="gallery-preview-side gallery-preview-wrapper" style={{ flex: 1 }}>
        <h3>תצוגה מקדימה</h3>
        <div className="gallery-instagram-grid">
          {galleryTabImages.map((item, index) => (
            <div
              className="gallery-item-square"
              key={item.id || index}
              onClick={() => setModalIndex(index)}
            >
              {item.type === "image" ? (
                <img src={item.url} alt="" className="gallery-media" />
              ) : (
                <video src={item.url} muted className="gallery-media" />
              )}
            </div>
          ))}
        </div>
      </div>

      {modalIndex !== null && (
        <div className="modal-overlay" onClick={() => setModalIndex(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="nav-btn left"
              onClick={() =>
                setModalIndex((prev) =>
                  (prev - 1 + galleryTabImages.length) % galleryTabImages.length
                )
              }
            >
              ◀
            </button>

            {galleryTabImages[modalIndex].type === "image" ? (
              <img src={galleryTabImages[modalIndex].url} alt="" className="modal-media" />
            ) : (
              <video
                src={galleryTabImages[modalIndex].url}
                controls
                className="modal-media"
              />
            )}

            <button
              className="nav-btn right"
              onClick={() =>
                setModalIndex((prev) => (prev + 1) % galleryTabImages.length)
              }
            >
              ▶
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryEditorWithPreview;
