import React from "react";
import WantravelPages from "./pages";

export default function WantravelPreview() {
  return (
    <div className="wantravel-preview-shell">
      <style>{`
        .wantravel-preview-shell {
          width: 100%;
          min-height: 100vh;
          height: auto;
          overflow: visible;
        }
      `}</style>

      <WantravelPages />
    </div>
  );
}