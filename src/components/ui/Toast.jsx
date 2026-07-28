// components/UI/Toast.jsx
import React, { useEffect } from "react";

export default function Toast({
  message,
  type = "success", // success | error | warning
  onClose,
  duration = 2500,
}) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, onClose, duration]);

  if (!message) return null;

  return (
    <div className={`toast ${type}`}>
      {message}
    </div>
  );
}
