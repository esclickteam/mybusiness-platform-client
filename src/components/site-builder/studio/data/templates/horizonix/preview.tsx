import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import HorizonixPages from "./pages";
export default function HorizonixPreview() {
  return (
    <div dir={templateDir()} data-template-id="horizonix" className="min-h-screen w-full" style={{ background: "#0d1117", color: "#f0f6fc" }}>
      <HorizonixPages initialPage="home" mode="preview" />
    </div>
  );
}
