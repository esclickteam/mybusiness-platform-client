import React from "react";
import WantravelPages from "./pages";

export default function WantravelPreview() {
  return (
    <div className="wantravel-preview-scroll">
      <style>{`
        .wantravel-preview-scroll {
          position: relative;
          width: 100%;
          height: 100vh;
          max-height: 100vh;
          min-height: 100vh;
          overflow-x: hidden !important;
          overflow-y: auto !important;
          overscroll-behavior: contain;
          -webkit-overflow-scrolling: touch;
          background: #f4ecdf;
          scrollbar-gutter: stable;
        }

        .wantravel-preview-scroll [data-template-id="wantravel"] {
          min-height: max-content !important;
          height: auto !important;
          overflow-x: hidden !important;
          overflow-y: visible !important;
        }

        .wantravel-preview-scroll .wan-page {
          min-height: max-content !important;
          height: auto !important;
          overflow: visible !important;
        }

        .wantravel-preview-scroll .wan-header {
          position: absolute !important;
        }
      `}</style>

      <WantravelPages pageId="home" pageSlug="/" selectedPageId="home" />
    </div>
  );
}