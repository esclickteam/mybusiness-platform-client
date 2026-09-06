import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import NestiqPages from "./pages";
export default function NestiqPreview() {
  return (
    <div dir={templateDir()} data-template-id="nestiq" className="min-h-screen w-full" style={{ background: "#faf5ff", color: "#1e1b4b" }}>
      <NestiqPages initialPage="home" mode="preview" />
    </div>
  );
}
