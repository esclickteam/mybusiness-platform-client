import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import GlinticaPages from "./pages";

export default function GlinticaPreview() {
  return (
    <div dir={templateDir()} data-template-id="glintica" className="min-h-screen w-full" style={{ background: "#1F1A1C", overflowX: "hidden" }}>
      <GlinticaPages initialPage="home" mode="preview" />
    </div>
  );
}
