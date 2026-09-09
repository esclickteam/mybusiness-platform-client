import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import NailoraPages from "./pages";

export default function NailoraPreview() {
  return (
    <div dir={templateDir()} data-template-id="nailora" className="min-h-screen w-full" style={{ background: "#FFF8FA", overflowX: "hidden" }}>
      <NailoraPages initialPage="home" mode="preview" />
    </div>
  );
}
