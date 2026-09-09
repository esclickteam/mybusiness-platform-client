import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import TidehausPages from "./pages";
export default function TidehausPreview() {
  return (
    <div dir={templateDir()} data-template-id="tidehaus" className="min-h-screen w-full" style={{ background: "#eef6fb", color: "#0c2a3a" }}>
      <TidehausPages initialPage="home" mode="preview" />
    </div>
  );
}
