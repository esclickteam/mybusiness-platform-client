import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import VitalisPages from "./pages";

export default function VitalisPreview() {
  return (
    <div
      dir={templateDir()}
      data-template-id="vitalis"
      className="min-h-screen w-full bg-[#f7fcfc] text-[#0f2a36]"
      style={{
        overflowX: "hidden",
        overflowY: "auto",
        position: "relative",
      }}
    >
      <VitalisPages initialPage="home" mode="preview" />
    </div>
  );
}
