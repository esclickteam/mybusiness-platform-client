import React from "react";
import { servoraEditorCss } from "./editorCss";
import ServoraPages from "./pages";

export default function ServoraPreview() {
  return (
    <div
      dir="rtl"
      data-template-id="servora-preview"
      className="h-screen min-h-screen w-full bg-[#fff7ed] text-[#111827]"
      style={{
        overflow: "hidden",
        position: "relative",
      }}
    >
      <style>{servoraEditorCss}</style>

      <div
        style={{
          width: "100%",
          height: "100%",
          overflow: "auto",
        }}
      >
        <ServoraPages initialPage="home" mode="preview" />
      </div>
    </div>
  );
}