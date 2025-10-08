```javascript
import React, { useState, useRef, useEffect } from "react";
import '../build/Build.css';
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
          loading: true, // ⏳ Marking as loading
        };
      })
      .filter((img) => !existingIds.includes(img.id));

    const updatedImages = [...galleryTabImages, ...newImages];

    setBusinessDetails((prev) => ({
      ...prev,
      galleryTabImages: updatedImages,
    }));

    // Simulating loading for 1.5 seconds
    setTimeout(() => {
      setBusinessDetails((prev) => ({
        ...prev,
        galleryTabImages: prev.galleryTabImages.map((img) =>
          img.loading ? { ...img, loading: false } : img
        ),
      }));
    }, 1500);
  };

  return (
    <div className="gallery-form-wrapper edit-mode">
      <div className="image-preview">
        {/* Displaying the image on the left side */}
        {galleryTabImages.length > 0 && (
          <img src={galleryTabImages[0].url} alt="Image" className="image-preview-side" />
        )}
      </div>

      <div className="form-content">
        <h2>🎨 Gallery Design</h2>
        <h4>Upload Media</h4>
        <p className="info-note">You can upload images or videos</p>
        <input
          type="file"
          multiple
          ref={galleryTabInputRef}
          style={{ display: "none" }}
          onChange={handleUpload}
        />
        <button onClick={() => galleryTabInputRef.current.click()} className="upload-btn">
          ➕ Add Media
        </button>
        <p className="info-note">You can drag and change the order</p>

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
          Save
        </button>
      </div>
    </div>
  );
};

export default GalleryTab;
```