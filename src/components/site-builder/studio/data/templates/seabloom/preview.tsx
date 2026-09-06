import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import SeabloomPages from "./pages";
export default function SeabloomPreview() {
  return (
    <div dir={templateDir()} data-template-id="seabloom" className="min-h-screen w-full" style={{ background: "#f5faf5", color: "#1a3d2e" }}>
      <SeabloomPages initialPage="home" mode="preview" />
    </div>
  );
}
