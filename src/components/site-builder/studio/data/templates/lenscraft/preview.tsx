import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import LenscraftPages from "./pages";

export default function LenscraftPreview() {
  return (
    <div dir={templateDir()} data-template-id="lenscraft" className="min-h-screen w-full" style={{ background: "#0F0F10", overflowX: "hidden" }}>
      <LenscraftPages initialPage="home" mode="preview" />
    </div>
  );
}
