import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import SmokepitPages from "./pages";
export default function SmokepitPreview() {
  return (
    <div dir={templateDir()} data-template-id="smokepit" className="min-h-screen w-full" style={{ background: "#120c08", color: "#f3e8d8" }}>
      <SmokepitPages initialPage="home" mode="preview" />
    </div>
  );
}
