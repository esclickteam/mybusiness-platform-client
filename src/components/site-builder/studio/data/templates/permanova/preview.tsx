import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import PermanovaPages from "./pages";

export default function PermanovaPreview() {
  return (
    <div dir={templateDir()} data-template-id="permanova" className="min-h-screen w-full" style={{ background: "#FFFBF7", overflowX: "hidden" }}>
      <PermanovaPages initialPage="home" mode="preview" />
    </div>
  );
}
