import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import BlushlabPages from "./pages";

export default function BlushlabPreview() {
  return (
    <div dir={templateDir()} data-template-id="blushlab" className="min-h-screen w-full" style={{ background: "#14080C", overflowX: "hidden" }}>
      <BlushlabPages initialPage="home" mode="preview" />
    </div>
  );
}
