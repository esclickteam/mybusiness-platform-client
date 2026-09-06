import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import LuminellePages from "./pages";

export default function LuminellePreview() {
  return (
    <div
      dir={templateDir()}
      data-template-id="luminelle"
      className="min-h-screen w-full"
      style={{ background: "#E8E4DF", overflowX: "hidden" }}
    >
      <LuminellePages initialPage="home" mode="preview" />
    </div>
  );
}
