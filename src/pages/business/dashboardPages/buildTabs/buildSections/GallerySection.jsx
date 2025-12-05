import React, { useEffect, useRef } from "react";
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
  renderTopBar
}) {
  const containerRef = useRef();

  useEffect(() => {
    const onClickOutside = e => {};
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // ❌ לא dedupe — נותנים לכל תמונה להופיע גם אם יש blob דומה
  const images = (businessDetails.gallery || []).map((url, idx) => ({
    preview: url,
    publicId: (businessDetails.galleryImageIds || [])[idx] || `temp-${idx}`
  }));

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(images);
    const [removed] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, removed);

    // מעדכן סדר ב־parent
    setGalleryOrder(items);
  };

  return (
    <>
      {/* LEFT SIDE – EDIT MODE */}
      <div className="form-column" ref={containerRef}>
        <h3>Upload Gallery Images</h3>

        <input
          type="file"
          multiple
          accept="image/*"
          style={{ display: "none" }}
          ref={galleryInputRef}
          onChange={handleGalleryChange}
          disabled={isSaving}
        />

        <button
          type="button"
          className="save-btn"
          onClick={() => galleryInputRef.current?.click()}
          disabled={isSaving}
        >
          Add Images
        </button>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="gallery">
            {(provided) => (
              <div
                className="gallery-grid-container edit"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {images.map(({ preview, publicId }, index) => (
                  <Draggable key={publicId} draggableId={publicId} index={index}>
                    {(provided) => (
                      <div
                        className="gallery-item-wrapper image-wrapper"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <img src={preview} alt="" className="gallery-img" />

                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteImage(publicId)}
                          disabled={isSaving}
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* RIGHT SIDE – PUBLIC PREVIEW */}
      <div className="preview-column">
        {renderTopBar?.()}

        <h3 className="section-title">Our Gallery</h3>

        <div className="gallery-grid-container view">
          {images.length > 0 ? (
            images.map(({ preview, publicId }, i) => (
              <div key={publicId} className="gallery-item-wrapper image-wrapper">
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
