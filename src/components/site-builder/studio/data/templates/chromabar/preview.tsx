import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import ChromabarPages from "./pages";

export default function ChromabarPreview() {
  return (
    <div dir={templateDir()} data-template-id="chromabar" className="min-h-screen w-full" style={{ background: "#0B1220", overflowX: "hidden" }}>
      <ChromabarPages initialPage="home" mode="preview" />
    </div>
  );
}
