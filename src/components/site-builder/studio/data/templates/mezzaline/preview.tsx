import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import MezzalinePages from "./pages";
export default function MezzalinePreview() {
  return (
    <div dir={templateDir()} data-template-id="mezzaline" className="min-h-screen w-full" style={{ background: "#f7f1e6", color: "#2c2a22" }}>
      <MezzalinePages initialPage="home" mode="preview" />
    </div>
  );
}
