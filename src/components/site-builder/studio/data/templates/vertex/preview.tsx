import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import VertexPages from "./pages";

export default function VertexPreview() {
  return (
    <div dir={templateDir()} data-template-id="vertex" className="min-h-screen w-full" style={{ background: "#050505", overflowX: "hidden" }}>
      <VertexPages initialPage="home" mode="preview" />
    </div>
  );
}
