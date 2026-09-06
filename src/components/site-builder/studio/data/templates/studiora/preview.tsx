import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import StudioraPages from "./pages";

export default function StudioraPreview() {
  return (
    <div
      dir={templateDir()}
      data-template-id="studiora"
      className="min-h-screen w-full bg-[#0a0a0a] text-white"
      style={{
        overflowX: "hidden",
        overflowY: "auto",
        position: "relative",
      }}
    >
      <StudioraPages initialPage="home" mode="preview" />
    </div>
  );
}
