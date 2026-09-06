import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import SaltforgePages from "./pages";
export default function SaltforgePreview() {
  return (
    <div dir={templateDir()} data-template-id="saltforge" className="min-h-screen w-full" style={{ background: "#e8e4df", color: "#2a2826" }}>
      <SaltforgePages initialPage="home" mode="preview" />
    </div>
  );
}
