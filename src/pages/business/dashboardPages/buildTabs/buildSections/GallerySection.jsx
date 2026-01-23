import React, { useEffect, useRef, useState } from "react";
import ImageLoader from "@components/ImageLoader";
import "./GallerySection.css";

export default function GallerySection({
  businessDetails,
  galleryInputRef,
  handleGalleryChange,
  handleDeleteImage,
  isSaving,
  renderTopBar,
  navigate,
}) {
  const containerRef = useRef(null);

  /* =========================
     🖼 Local gallery state
  ========================= */
  const [images, setImages] = useState([]);

  /* =========================
     Sync from parent
  ========================= */
  useEffect(() => {
    const gallery = businessDetails.gallery || [];
    const ids = businessDetails.galleryImageIds || [];

    const mapped = gallery.map((url, idx) => ({
      preview: url,
      publicId: ids[idx] || `temp-${idx}`,
    }));

    setImages(mapped);
  }, [businessDetails.gallery, businessDetails.galleryImageIds]);

  /* =========================
     Delete image
  ========================= */
  const onDelete = (publicId) => {
    const ok = window.confirm("Remove this image from the gallery?");
    if (!ok) return;

    setImages((prev) => prev.filter((img) => img.publicId !== publicId));
    handleDeleteImage(publicId);
  };

  const hasImages = images.length > 0;

  return (
    <div className="build-wrapper">
      {/* =========================
         RIGHT – PREVIEW
      ========================= */}
      <div className="preview-column">
        {renderTopBar?.()}

        <h3 className="section-title">Our Gallery</h3>

        <div className="gallery-grid-container view">
          {hasImages ? (
            images.map(({ preview, publicId }) => (
              <div key={publicId} className="gallery-item-wrapper">
                <ImageLoader src={preview} className="gallery-img" />
              </div>
            ))
          ) : (
            <p className="no-data">No images in the gallery</p>
          )}
        </div>
      </div>

      {/* =========================
         LEFT – EDIT FORM
      ========================= */}
      <div className="form-column" ref={containerRef}>
        <h3 className="section-title">Gallery Images</h3>

        <input
          type="file"
          multiple
          accept="image/*"
          ref={galleryInputRef}
          style={{ display: "none" }}
          disabled={isSaving}
          onChange={handleGalleryChange}
        />

        <div
          className={`gallery-dropzone ${isSaving ? "disabled" : ""}`}
          onClick={() => !isSaving && galleryInputRef.current?.click()}
        >
          <div className="dropzone-inner">
            <span className="icon">📸</span>
            <div className="text">
              <strong>Click to upload images</strong>
              <span>You can upload multiple images</span>
            </div>
          </div>
        </div>

        <div className="gallery-grid-container edit">
          {!hasImages && (
            <div className="gallery-empty">
              No images in the gallery yet
            </div>
          )}

          {images.map(({ preview, publicId }) => (
            <div key={publicId} className="gallery-item-wrapper">
              <img src={preview} alt="" className="gallery-img" />
              <button
                className="delete-btn"
                onClick={() => onDelete(publicId)}
                disabled={isSaving}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        {isSaving && (
          <div className="gallery-saving-overlay">
            Saving changes…
          </div>
        )}

        {hasImages && !isSaving && (
          <button
            type="button"
            className="view-profile-btn"
            onClick={() =>
              navigate(`/business/${businessDetails._id}?tab=gallery`)
            }
          >
            👀 View Public Profile
          </button>
        )}
      </div>
    </div>
  );
}
