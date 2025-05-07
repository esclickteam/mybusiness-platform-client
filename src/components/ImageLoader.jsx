import React, { useState, useEffect } from "react";

const ImageLoader = ({ src, alt, className }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const img = new Image();
    img.src = src;
    img.onload = () => {
      if (isMounted) {
        setLoading(false);
        setError(false);
      }
    };
    img.onerror = () => {
      if (isMounted) {
        setLoading(false);
        setError(true);
      }
    };
    return () => {
      isMounted = false;
    };
  }, [src]);

  return (
    <div className={`image-container ${className}`} style={{ position: "relative" }}>
      {loading && (
        <div
          className="spinner"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)"
          }}
        >
          🔄
        </div>
      )}
      {!loading && !error && (
        <img
          src={src}
          alt={alt}
          className="loaded-image"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "12px"
          }}
        />
      )}
      {!loading && error && (
        <div
          className="error-placeholder"
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "12px"
          }}
        >
          ❌
        </div>
      )}
    </div>
  );
};

export default ImageLoader;
