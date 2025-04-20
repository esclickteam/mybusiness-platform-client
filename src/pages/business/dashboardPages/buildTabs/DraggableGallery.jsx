import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const DraggableGallery = ({
  images,
  fits,
  setBusinessDetails,
  isForm,
  setEditIndex,
  onDelete,
  setActiveImageIndex,
}) => {
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(images);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    const updatedFits = {};
    reordered.forEach((item, index) => {
      const oldIndex = images.findIndex((i) => i.id === item.id);
      updatedFits[index] = fits[oldIndex] || "cover";
    });

    setBusinessDetails((prev) => ({
      ...prev,
      galleryTabImages: reordered,
      galleryTabFits: updatedFits,
    }));
  };

  return (
    <div className="gallery-form-wrapper">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="gallery" direction="vertical">
          {(provided) => (
            <div
              className="gallery-instagram-grid"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {images.map((img, index) => (
                <Draggable draggableId={img.id} index={index} key={img.id}>
                  {(provided) => (
                    <div
                      className="gallery-item-square"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{ ...provided.draggableProps.style }}
                      onClick={() => setActiveImageIndex(index)}
                    >
                      {img.type === "image" ? (
                        <img
                          src={img.url}
                          alt="media"
                          style={{ objectFit: fits[index] || "cover" }}
                        />
                      ) : (
                        <video
                          src={img.url}
                          style={{ objectFit: fits[index] || "cover" }}
                          controls
                        />
                      )}
                      {isForm && (
                        <>
                          <button
                            className="edit-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditIndex(index);
                            }}
                          >
                            ⚙️
                          </button>
                          <button
                            className="delete-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(index);
                            }}
                          >
                            🗑
                          </button>
                        </>
                      )}
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
  );
};

export default DraggableGallery;
