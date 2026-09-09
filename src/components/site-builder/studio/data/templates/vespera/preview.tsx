import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import VesperaPages from "./pages";

export default function VesperaPreview() {
  return (
    <div dir={templateDir()} data-template-id="vespera" className="min-h-screen w-full" style={{ background: "#1a0f14", color: "#f4ebe4" }}>
      <VesperaPages initialPage="home" mode="preview" />
    </div>
  );
}
