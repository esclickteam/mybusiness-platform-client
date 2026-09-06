import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import BrunchhausPages from "./pages";
export default function BrunchhausPreview() {
  return (
    <div dir={templateDir()} data-template-id="brunchhaus" className="min-h-screen w-full" style={{ background: "#fff8f0", color: "#3a2a1e" }}>
      <BrunchhausPages initialPage="home" mode="preview" />
    </div>
  );
}
