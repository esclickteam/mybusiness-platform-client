import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import JustoraPages from "./pages";

export default function JustoraPreview() {
  return (
    <div
      dir={templateDir()}
      data-template-id="justora"
      className="min-h-screen w-full bg-[#f6efe3] text-[#172433]"
      style={{
        overflowX: "hidden",
        overflowY: "auto",
        position: "relative",
      }}
    >
      <JustoraPages initialPage="home" mode="preview" />
    </div>
  );
}