import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import AurayogaPages from "./pages";
export default function AurayogaPreview() {
  return (
    <div dir={templateDir()} data-template-id="aurayoga" className="min-h-screen w-full" style={{ background: "#1C1526", overflowX: "hidden" }}>
      <AurayogaPages initialPage="home" mode="preview" />
    </div>
  );
}
