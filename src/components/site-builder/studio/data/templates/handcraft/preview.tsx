import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import HandcraftPages from "./pages";

export default function HandcraftPreview() {
  return (
    <div
      dir={templateDir()}
      data-template-id="handcraft"
      className="min-h-screen w-full"
      style={{ background: "#FAFAF9", overflowX: "hidden" }}
    >
      <HandcraftPages initialPage="home" mode="preview" />
    </div>
  );
}
