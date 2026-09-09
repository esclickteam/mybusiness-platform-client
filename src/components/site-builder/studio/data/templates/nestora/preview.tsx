import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import NestoraPages from "./pages";

export default function NestoraPreview() {
  return (
    <div dir={templateDir()} data-template-id="nestora" className="min-h-screen w-full overflow-hidden" style={{ background: "#eef1f5", color: "#1e2836" }}>
      <NestoraPages initialPage="home" mode="preview" />
    </div>
  );
}
