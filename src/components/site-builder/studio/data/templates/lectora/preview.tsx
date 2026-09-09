import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import LectoraPages from "./pages";

export default function LectoraPreview() {
  return (
    <div dir={templateDir()} data-template-id="lectora" className="min-h-screen w-full" style={{ background: "#041F1E", overflowX: "hidden" }}>
      <LectoraPages initialPage="home" mode="preview" />
    </div>
  );
}
