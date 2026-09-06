import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import LashatelierPages from "./pages";

export default function LashatelierPreview() {
  return (
    <div dir={templateDir()} data-template-id="lashatelier" className="min-h-screen w-full" style={{ background: "#120A1F", overflowX: "hidden" }}>
      <LashatelierPages initialPage="home" mode="preview" />
    </div>
  );
}
