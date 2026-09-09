import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import AdvisoraPages from "./pages";

export default function AdvisoraPreview() {
  return (
    <div dir={templateDir()} data-template-id="advisora" className="min-h-screen w-full" style={{ background: "#0B1F3A", overflowX: "hidden" }}>
      <AdvisoraPages initialPage="home" mode="preview" />
    </div>
  );
}
