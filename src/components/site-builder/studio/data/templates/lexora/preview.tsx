import React from "react";
import LexoraPages from "./pages";

export default function LexoraPreview() {
  return (
    <div className="lexora-preview-scroll">
      <style>{`
        .lexora-preview-scroll {
          position: relative;
          width: 100%;
          height: 100vh;
          max-height: 100vh;
          min-height: 100vh;
          overflow-x: hidden !important;
          overflow-y: auto !important;
          overscroll-behavior: contain;
          -webkit-overflow-scrolling: touch;
          background: #eee9dd;
          scrollbar-gutter: stable;
        }

        .lexora-preview-scroll [data-template-id="lexora"] {
          min-height: max-content !important;
          height: auto !important;
          overflow-x: hidden !important;
          overflow-y: visible !important;
        }

        .lexora-preview-scroll .lex-page {
          min-height: max-content !important;
          height: auto !important;
          overflow: visible !important;
        }

        .lexora-preview-scroll .lex-header {
          position: absolute !important;
        }
      `}</style>

      <LexoraPages pageId="home" pageSlug="/" selectedPageId="home" />
    </div>
  );
}