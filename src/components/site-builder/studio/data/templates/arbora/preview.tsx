import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import ArboraPages from "./pages";

export default function ArboraPreview() {
  return (
    <div dir={templateDir()} data-template-id="arbora" className="min-h-screen w-full" style={{ background: "#eef2ea", color: "#1c2618" }}>
      <ArboraPages initialPage="home" mode="preview" />
    </div>
  );
}
