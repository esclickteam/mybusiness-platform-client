import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import JuicepressPages from "./pages";
export default function JuicepressPreview() {
  return (
    <div dir={templateDir()} data-template-id="juicepress" className="min-h-screen w-full" style={{ background: "#fffbeb", color: "#1c1917" }}>
      <JuicepressPages initialPage="home" mode="preview" />
    </div>
  );
}
