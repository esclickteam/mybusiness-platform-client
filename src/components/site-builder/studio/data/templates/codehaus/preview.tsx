import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import CodehausPages from "./pages";

export default function CodehausPreview() {
  return (
    <div dir={templateDir()} data-template-id="codehaus" className="min-h-screen w-full" style={{ background: "#020617", overflowX: "hidden" }}>
      <CodehausPages initialPage="home" mode="preview" />
    </div>
  );
}
