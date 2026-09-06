import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import VelvetinePages from "./pages";

export default function VelvetinePreview() {
  return (
    <div dir={templateDir()} data-template-id="velvetine" className="min-h-screen w-full" style={{ background: "#120E0C", overflowX: "hidden" }}>
      <VelvetinePages initialPage="home" mode="preview" />
    </div>
  );
}
