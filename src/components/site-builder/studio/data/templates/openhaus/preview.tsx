import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import OpenhausPages from "./pages";
export default function OpenhausPreview() {
  return (
    <div dir={templateDir()} data-template-id="openhaus" className="min-h-screen w-full" style={{ background: "#fffbf7", color: "#292524" }}>
      <OpenhausPages initialPage="home" mode="preview" />
    </div>
  );
}
