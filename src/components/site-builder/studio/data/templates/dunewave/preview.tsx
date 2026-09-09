import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import DunewavePages from "./pages";
export default function DunewavePreview() {
  return (
    <div dir={templateDir()} data-template-id="dunewave" className="min-h-screen w-full" style={{ background: "#f4ead8", color: "#3d2f1f" }}>
      <DunewavePages initialPage="home" mode="preview" />
    </div>
  );
}
