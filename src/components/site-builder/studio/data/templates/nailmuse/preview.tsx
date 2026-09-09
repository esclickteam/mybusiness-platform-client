import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import NailmusePages from "./pages";

export default function NailmusePreview() {
  return (
    <div dir={templateDir()} data-template-id="nailmuse" className="min-h-screen w-full" style={{ background: "#FFF9F0", overflowX: "hidden" }}>
      <NailmusePages initialPage="home" mode="preview" />
    </div>
  );
}
