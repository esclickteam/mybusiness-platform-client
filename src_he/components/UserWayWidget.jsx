// src/components/UserWayWidget.jsx
import { useEffect } from "react";

export default function UserWayWidget() {
  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://cdn.userway.org/widget.js";
    s.async = true;
    s.setAttribute("data-account", "abcd1234");   // ← replace with your ID
    s.setAttribute("data-lang", "he");            // Hebrew
    s.setAttribute("data-position", "right");     // right / left
    document.body.appendChild(s);
    return () => s.remove();                      // cleanup on unmount
  }, []);

  return null;   // no UI
}
