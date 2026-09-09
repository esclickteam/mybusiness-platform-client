import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import CraftoraPages from "./pages";

export default function CraftoraPreview() {
  return (
    <div dir={templateDir()} data-template-id="craftora" className="min-h-screen w-full" style={{ background: "#F5F5F4", overflowX: "hidden" }}>
      <CraftoraPages initialPage="home" mode="preview" />
    </div>
  );
}
