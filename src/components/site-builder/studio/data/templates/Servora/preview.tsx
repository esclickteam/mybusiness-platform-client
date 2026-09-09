import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import { servoraEditorCss } from "./editorCss";
import ServoraPages from "./pages";

export default function ServoraPreview() {
  return (
    <div
      dir={templateDir()}
      data-template-id="servora"
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