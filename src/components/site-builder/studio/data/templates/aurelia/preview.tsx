import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import AureliaPages from "./pages";

export default function AureliaPreview() {
  return (
    <div
      dir={templateDir()}
      data-template-id="aurelia"
      className="min-h-screen w-full bg-[#14100d] text-[#f5eee1]"
      style={{
        overflowX: "hidden",
        overflowY: "auto",
        position: "relative",
      }}
    >
      <AureliaPages initialPage="home" mode="preview" />
    </div>
  );
}
