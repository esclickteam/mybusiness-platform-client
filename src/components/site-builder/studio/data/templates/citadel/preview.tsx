import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import CitadelPages from "./pages";

export default function CitadelPreview() {
  return (
    <div dir={templateDir()} data-template-id="citadel" className="min-h-screen w-full" style={{ background: "#030a06", overflowX: "hidden" }}>
      <CitadelPages initialPage="home" mode="preview" />
    </div>
  );
}
