import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import CinderPages from "./pages";

export default function CinderPreview() {
  return (
    <div dir={templateDir()} data-template-id="cinder" className="min-h-screen w-full" style={{ background: "#1a120e", color: "#f6efe6" }}>
      <CinderPages initialPage="home" mode="preview" />
    </div>
  );
}
