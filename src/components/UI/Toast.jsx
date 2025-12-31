// components/UI/Toast.jsx
import React, { useEffect } from "react";

export default function Toast({
  text,
  type = "success",
  onClose,
  duration = 2500,
}) {
  useEffect(() => {
    if (!text) return;
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [text, onClose, duration]);

  if (!text) return null;

  return (
    <div className={`toast-message toast-${type}`}>
      {text}
    </div>
  );
}
