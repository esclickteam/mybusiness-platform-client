import React from "react";
import ReactDOM from "react-dom";

const FloatingPopup = ({ children, position }) => {
  if (!position) return null;

  return ReactDOM.createPortal(
    <div
      style={{
        position: "absolute",
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: "translateX(-50%)",
        zIndex: 2000,
      }}
    >
      {children}
    </div>,
    document.getElementById("popup-root")
  );
};

export default FloatingPopup;
