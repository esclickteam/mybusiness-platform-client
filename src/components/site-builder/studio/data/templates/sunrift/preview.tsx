import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import SunriftPages from "./pages";
export default function SunriftPreview() {
  return (
    <div dir={templateDir()} data-template-id="sunrift" className="min-h-screen w-full" style={{ background: "#1a0f0a", color: "#fff4e8" }}>
      <SunriftPages initialPage="home" mode="preview" />
    </div>
  );
}
