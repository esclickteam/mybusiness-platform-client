import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import NexoraPages from "./pages";

export default function NexoraPreview() {
  return (
    <div
      dir={templateDir()}
      data-template-id="nexora"
      className="min-h-screen w-full bg-[#0b1020] text-white"
      style={{
        overflowX: "hidden",
        overflowY: "auto",
        position: "relative",
      }}
    >
      <NexoraPages initialPage="home" mode="preview" />
    </div>
  );
}
