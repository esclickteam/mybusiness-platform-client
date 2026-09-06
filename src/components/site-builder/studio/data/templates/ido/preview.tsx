import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import IdoPages from "./pages";

export default function IdoPreview() {
  return (
    <div
      dir={templateDir()}
      data-template-id="ido"
      className="min-h-screen w-full bg-[#07100e] text-white"
      style={{
        position: "relative",
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      <IdoPages initialPage="home" mode="preview" />
    </div>
  );
}