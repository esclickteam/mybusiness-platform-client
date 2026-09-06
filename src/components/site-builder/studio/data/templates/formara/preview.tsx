import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import FormaraPages from "./pages";

export default function FormaraPreview() {
  return (
    <div dir={templateDir()} data-template-id="formara" className="min-h-screen w-full" style={{ background: "#1E1C1A", overflowX: "hidden" }}>
      <FormaraPages initialPage="home" mode="preview" />
    </div>
  );
}
