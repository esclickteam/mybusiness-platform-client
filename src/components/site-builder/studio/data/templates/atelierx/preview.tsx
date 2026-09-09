import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import AtelierxPages from "./pages";
export default function AtelierxPreview() {
  return (
    <div dir={templateDir()} data-template-id="atelierx" className="min-h-screen w-full" style={{ background: "#FAFAFA", overflowX: "hidden" }}>
      <AtelierxPages initialPage="home" mode="preview" />
    </div>
  );
}
