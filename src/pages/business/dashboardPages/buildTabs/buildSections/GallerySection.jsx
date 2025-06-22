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
        // אין צורך בניקוי מיוחד
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

  // טיפול בסיום גרירה - עדכון הסדר
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
        <h3>העלאת תמונות לגלריה</h3>
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
          הוספת תמונות
        </button>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="gallery" direction="horizontal">
            {(provided) => (
              <div
                className="gallery-grid-container edit"
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{ display: "flex", gap: "10px", overflowX: "auto" }}
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
                          minWidth: "140px",
                          height: "140px",
                          borderRadius: "12px",
                          overflow: "hidden",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          position: "relative",
                          background: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <img
                          src={preview}
                          alt={`תמונת גלריה ${index + 1}`}
                          className="gallery-img"
                          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" }}
                        />
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteImage(publicId)}
                          type="button"
                          title="מחיקה"
                          disabled={isSaving}
                          style={{
                            position: "absolute",
                            top: "6px",
                            right: "6px",
                            background: "rgba(255,255,255,0.8)",
                            borderRadius: "50%",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "1.2rem",
                            lineHeight: 1,
                            padding: "2px 6px",
                            transition: "background 0.2s ease",
                            zIndex: 10,
                          }}
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

        <h3 className="section-title">הגלריה שלנו</h3>
        <div className="gallery-grid-container view">
          {uniqueImages.length > 0 ? (
            uniqueImages.map(({ preview, publicId }, i) => (
              <div
                key={publicId || `preview-${i}`}
                className="gallery-item-wrapper image-wrapper"
              >
                <ImageLoader
                  src={preview}
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
