import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import DimsumixPages from "./pages";
export default function DimsumixPreview() {
  return (
    <div dir={templateDir()} data-template-id="dimsumix" className="min-h-screen w-full" style={{ background: "#0f1412", color: "#f0f5f2" }}>
      <DimsumixPages initialPage="home" mode="preview" />
    </div>
  );
}
