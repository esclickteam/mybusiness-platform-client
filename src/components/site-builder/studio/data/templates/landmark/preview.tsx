import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import LandmarkPages from "./pages";
export default function LandmarkPreview() {
  return (
    <div dir={templateDir()} data-template-id="landmark" className="min-h-screen w-full" style={{ background: "#f0f4f8", color: "#1e293b" }}>
      <LandmarkPages initialPage="home" mode="preview" />
    </div>
  );
}
