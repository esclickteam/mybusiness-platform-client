import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import GelatixPages from "./pages";
export default function GelatixPreview() {
  return (
    <div dir={templateDir()} data-template-id="gelatix" className="min-h-screen w-full" style={{ background: "#fff5f8", color: "#2b1822" }}>
      <GelatixPages initialPage="home" mode="preview" />
    </div>
  );
}
