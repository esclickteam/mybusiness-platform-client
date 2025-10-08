```javascript
import React, { useEffect, useRef } from "react";
import ImageLoader from "@components/ImageLoader";
import { dedupeByPreview } from "../../../../../utils/dedupe";
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
    const onClickOutside = e => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        // No special cleanup needed
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const wrapped = (businessDetails.gallery || []).map((url, idx) => ({
    preview: url,
    publicId: (businessDetails.galleryImageIds || [])[idx] || `temp-${idx}`
  }));
  const uniqueImages = dedupeByPreview(wrapped);

  // Handle drag end - update order
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(uniqueImages);
    const [removed] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, removed);

    setGalleryOrder(items);
  };

  return (
    <>
      <div className="form-column" ref={containerRef}>
        <h3>Upload Images to Gallery</h3>
        <input
          type="file"
          name="gallery"
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
                {uniqueImages.map(({ preview, publicId }, index) => (
                  <Draggable key={publicId} draggableId={publicId} index={index}>
                    {(provided) => (
                      <div
                        className="gallery-item-wrapper image-wrapper"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          userSelect: "none",
                          ...provided.draggableProps.style,
                        }}
                      >
                        <img
                          src={preview}
                          alt={`Gallery Image ${index + 1}`}
                          className="gallery-img"
                        />
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteImage(publicId)}
                          type="button"
                          title="Delete"
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

      <div className="preview-column">
        {renderTopBar?.()}

        <h3 className="section-title">Our Gallery</h3>
        <div className="gallery-grid-container view">
          {uniqueImages.length > 0 ? (
            uniqueImages.map(({ preview, publicId }, i) => (
              <div
                key={publicId || `preview-${i}`}
                className="gallery-item-wrapper image-wrapper"
              >
                <ImageLoader
                  src={preview}
                  alt={`Gallery Image ${i + 1}`}
                  className="gallery-img"
                />
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
```