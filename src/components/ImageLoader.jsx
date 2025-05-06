import React, { useState, useEffect } from "react";

const ImageLoader = ({ src, alt, className }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setLoading(false);
  }, [src]);

  return (
    <div className={`image-container ${className}`}>
      {loading ? (
        <div className="spinner">🔄</div>  // ספינר טעינה
      ) : (
        <img src={src} alt={alt} className="loaded-image" />
      )}
    </div>
  );
};

export default ImageLoader;
