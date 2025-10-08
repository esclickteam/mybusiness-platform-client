// src/components/UserWayWidget.jsx
import { useEffect } from "react";

export default function UserWayWidget() {
  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://cdn.userway.org/widget.js";
    s.async = true;
    s.setAttribute("data-account", "abcd1234");   // ← החלף ל-ID שלך
    s.setAttribute("data-lang", "he");            // עברית
    s.setAttribute("data-position", "right");     // right / left
    document.body.appendChild(s);
    return () => s.remove();                      // ניקוי ב-unmount
  }, []);

  return null;   // אין UI
}
