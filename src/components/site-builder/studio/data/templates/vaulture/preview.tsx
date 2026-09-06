import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import VaulturePages from "./pages";
export default function VaulturePreview() {
  return (
    <div dir={templateDir()} data-template-id="vaulture" className="min-h-screen w-full" style={{ background: "#0c0a08", color: "#f5f0e8" }}>
      <VaulturePages initialPage="home" mode="preview" />
    </div>
  );
}
