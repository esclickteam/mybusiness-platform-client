import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import PropnexPages from "./pages";
export default function PropnexPreview() {
  return (
    <div dir={templateDir()} data-template-id="propnex" className="min-h-screen w-full" style={{ background: "#f4f6f9", color: "#111827" }}>
      <PropnexPages initialPage="home" mode="preview" />
    </div>
  );
}
