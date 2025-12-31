// components/UI/Toast.jsx
import React, { useEffect } from "react";

export default function Toast({ message, onClose, duration = 2500 }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [message, onClose, duration]);

  if (!message) return null;

  return <div className="toast-message">{message}</div>;
}
