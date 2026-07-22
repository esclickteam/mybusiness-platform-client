import React, { useState, useEffect } from "react";
import BizuplyLoader from "./ui/BizuplyLoader";

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
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.85)",
          }}
        >
          <BizuplyLoader size="sm" compact />
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
