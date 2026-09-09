import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import ShawarmiaPages from "./pages";
export default function ShawarmiaPreview() {
  return (
    <div dir={templateDir()} data-template-id="shawarmia" className="min-h-screen w-full" style={{ background: "#14110e", color: "#f5ebe0" }}>
      <ShawarmiaPages initialPage="home" mode="preview" />
    </div>
  );
}
