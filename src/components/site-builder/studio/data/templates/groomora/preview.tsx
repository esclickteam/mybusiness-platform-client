import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import GroomoraPages from "./pages";

export default function GroomoraPreview() {
  return (
    <div dir={templateDir()} data-template-id="groomora" className="min-h-screen w-full" style={{ background: "#0C1208", overflowX: "hidden" }}>
      <GroomoraPages initialPage="home" mode="preview" />
    </div>
  );
}
