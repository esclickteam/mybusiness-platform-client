import React, { useRef, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import "./GalleryTab.css";

const SortableItem = ({
  item,
  index,
  onClick,
  onDelete,
  onEdit,
  isForm,
  editIndex,
  handleFitChange,
  popupRefs,
  fit,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const itemRef = useRef(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
    position: "relative",
  };

  useEffect(() => {
    if (popupRefs?.current) {
      popupRefs.current[index] = itemRef.current;
    }
  }, [editIndex, index, popupRefs]);

  return (
    <div
      className="gallery-item-square"
      ref={(el) => {
        setNodeRef(el);
        itemRef.current = el;
      }}
      style={style}
      onClick={() => onClick(index)}
      {...attributes}
      {...listeners}
    >
      {item.type === "image" ? (
        <img
          src={item.url}
          alt=""
          className="gallery-media"
          style={{ objectFit: fit || "cover" }}
        />
      ) : (
        <video
          src={item.url}
          muted
          className="gallery-media"
          style={{ objectFit: fit || "cover" }}
        />
      )}

      {isForm && (
        <>
          <button
            className="edit-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEdit(index);
            }}
            title="Edit Media"
          >
            <FaEdit size={16} />
          </button>

          <button
            className="delete-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(index);
            }}
            title="Delete Media"
          >
            <FaTrashAlt size={16} />
          </button>
        </>
      )}

      {isForm && editIndex === index && (
        <div
          className="fit-select-popup"
          ref={(el) => {
            if (popupRefs?.current) popupRefs.current[index] = el;
          }}
        >
          <select
            value={fit || "cover"}
            onChange={(e) => handleFitChange(index, e.target.value)}
          >
            <option value="cover">Crop (cover)</option>
            <option value="contain">Fit (contain)</option>
          </select>
          <button
            className="confirm-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEdit(null);
            }}
          >
            ✔ Save
          </button>
        </div>
      )}
    </div>
  );
};

const GalleryDndKit = ({
  images,
  setImages,
  setActiveImageIndex,
  isForm,
  onDelete,
  setEditIndex,
  editIndex,
  handleFitChange,
  popupRefs,
  galleryTabFits,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = images.findIndex((i) => i.id === active.id);
      const newIndex = images.findIndex((i) => i.id === over.id);
      const reordered = arrayMove(images, oldIndex, newIndex);
      setImages(reordered);
    }
  };

  const handleItemClick = (index) => {
    if (!isForm) {
      setActiveImageIndex(index);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={images} strategy={verticalListSortingStrategy}>
        <div className="gallery-instagram-grid">
          {images.map((img, index) => (
            <SortableItem
              key={img.id}
              item={img}
              index={index}
              onClick={handleItemClick}
              onDelete={onDelete}
              onEdit={setEditIndex}
              isForm={isForm}
              editIndex={editIndex}
              handleFitChange={handleFitChange}
              popupRefs={popupRefs}
              fit={galleryTabFits?.[index] || "cover"}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default GalleryDndKit;
