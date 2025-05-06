import React from "react";

const Gallery = ({
  images,
  onImageDelete,
  isSaving,
  onImageSelect,
  isLoading
}) => {
    return (
        <div className="gallery-preview">
          {isLoading && (
            <div className="spinner">
              {/* הצגת ספינר בזמן טעינה */}
              🔄
            </div>
          )}

      {images.map((img, i) => (
        <div key={i} className="gallery-item-wrapper image-wrapper">
          <img
            src={img.preview}
            alt={`Main Image ${i + 1}`}
            className="gallery-img"
          />
          <button
            className="delete-btn"
            onClick={() => onImageDelete(i)}
            type="button"
            title="מחק"
            disabled={isSaving}
          >
            🗑️
          </button>
        </div>
      ))}
      {images.length < 5 && (
        <div
          className="gallery-placeholder clickable"
          onClick={onImageSelect}
        >
          +
        </div>
      )}
    </div>
  );
};

export default Gallery;
