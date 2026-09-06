import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import NoodlixPages from "./pages";
export default function NoodlixPreview() {
  return (
    <div dir={templateDir()} data-template-id="noodlix" className="min-h-screen w-full" style={{ background: "#0f1412", color: "#eef6f1" }}>
      <NoodlixPages initialPage="home" mode="preview" />
    </div>
  );
}
