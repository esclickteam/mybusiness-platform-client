import React, { useEffect, useRef, useState } from "react";
import ImageLoader from "@components/ImageLoader";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./GallerySection.css";

export default function GallerySection({
  businessDetails,
  galleryInputRef,
  handleGalleryChange,
  handleDeleteImage,
  setGalleryOrder,
  isSaving,
  renderTopBar,

  /* 🆕 same pattern as MainSection */
  showViewProfile,
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
     Drag reorder
  ========================= */
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(images);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);

    setImages(items);
    setGalleryOrder(items);
  };

  /* =========================
     Delete with soft confirm
  ========================= */
  const onDelete = (publicId) => {
    const ok = window.confirm("Remove this image from the gallery?");
    if (!ok) return;

    setImages((prev) => prev.filter((img) => img.publicId !== publicId));
    handleDeleteImage(publicId);
  };

  return (
    <>
      {/* =========================
         LEFT – EDIT MODE
      ========================= */}
      <div className="form-column" ref={containerRef}>
        <h3 className="section-title">Gallery Images</h3>

        {/* Upload input */}
        <input
          type="file"
          multiple
          accept="image/*"
          ref={galleryInputRef}
          style={{ display: "none" }}
          onChange={handleGalleryChange}
          disabled={isSaving}
        />

        {/* Dropzone */}
        <div
          className={`gallery-dropzone ${isSaving ? "disabled" : ""}`}
          onClick={() => !isSaving && galleryInputRef.current?.click()}
        >
          <div className="dropzone-inner">
            <span className="icon">📸</span>
            <div className="text">
              <strong>Drag & drop images here</strong>
              <span>or click to upload</span>
            </div>
          </div>
        </div>

        {/* Gallery grid */}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="gallery">
            {(provided) => (
              <div
                className="gallery-grid-container edit"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {images.length === 0 && (
                  <div className="gallery-empty">
                    No images in the gallery yet
                  </div>
                )}

                {images.map(({ preview, publicId }, index) => (
                  <Draggable
                    key={publicId}
                    draggableId={publicId}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        className="gallery-item-wrapper image-wrapper"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <img
                          src={preview}
                          alt=""
                          className="gallery-img"
                          draggable={false}
                        />

                        <button
                          className="delete-btn"
                          onClick={() => onDelete(publicId)}
                          disabled={isSaving}
                          title="Remove image"
                        >
                          🗑️
                        </button>

                        <div className="drag-hint">Drag to reorder</div>
                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Saving overlay */}
        {isSaving && (
          <div className="gallery-saving-overlay">
            Saving changes…
          </div>
        )}

        {/* =========================
           VIEW PROFILE CTA (like MainSection)
        ========================= */}
        {showViewProfile && images.length > 0 && (
          <button
            type="button"
            className="view-profile-btn"
            onClick={() => navigate(`/business/${businessDetails._id}`)}
          >
            👀 View Public Profile
          </button>
        )}
      </div>

      {/* =========================
         RIGHT – PUBLIC PREVIEW
      ========================= */}
      <div className="preview-column">
        {renderTopBar?.()}

        <h3 className="section-title">Our Gallery</h3>

        <div className="gallery-grid-container view">
          {images.length > 0 ? (
            images.map(({ preview, publicId }) => (
              <div
                key={publicId}
                className="gallery-item-wrapper image-wrapper"
              >
                <ImageLoader src={preview} className="gallery-img" />
              </div>
            ))
          ) : (
            <p className="no-data">No images in the gallery</p>
          )}
        </div>
      </div>
    </>
  );
}
