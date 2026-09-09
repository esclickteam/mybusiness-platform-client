import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import LoteraPages from "./pages";

export default function LoteraPreview() {
  return (
    <div dir={templateDir()} data-template-id="lotera" className="min-h-screen w-full" style={{ background: "#07131f", color: "#eef5fb" }}>
      <LoteraPages initialPage="home" mode="preview" />
    </div>
  );
}
