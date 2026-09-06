import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import SkyholdPages from "./pages";
export default function SkyholdPreview() {
  return (
    <div dir={templateDir()} data-template-id="skyhold" className="min-h-screen w-full" style={{ background: "#0f1419", color: "#e8edf5" }}>
      <SkyholdPages initialPage="home" mode="preview" />
    </div>
  );
}
