import React, { useState, useEffect } from "react";

const ImageLoader = ({ src, alt, className }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setLoading(false);
  }, [src]);

  return (
    <div className={`image-container ${className}`} style={{ position: "relative" }}>
      {loading ? (
        <div className="spinner" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
          🔄
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className="loaded-image"
          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" }}
        />
      )}
    </div>
  );
};

export default ImageLoader;
