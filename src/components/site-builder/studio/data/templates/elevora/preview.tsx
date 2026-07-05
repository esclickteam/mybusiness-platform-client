import React from "react";

import { elevoraEditorCss } from "./editorCss";
import ElevoraPages from "./pages";

export default function ElevoraPreview() {
  return (
    <div
      dir="rtl"
      data-template-id="elevora-preview"
      className="h-screen min-h-screen w-full bg-[#f6f1e7] text-[#13231b]"
      style={{
        overflow: "hidden",
        position: "relative",
      }}
    >
      <style>{elevoraEditorCss}</style>

      <div
        style={{
          width: "100%",
          height: "100%",
          overflow: "auto",
        }}
      >
        <ElevoraPages initialPage="home" mode="preview" />
      </div>
    </div>
  );
}