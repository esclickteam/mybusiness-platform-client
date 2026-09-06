import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import NeuralisPages from "./pages";
export default function NeuralisPreview() {
  return (
    <div dir={templateDir()} data-template-id="neuralis" className="min-h-screen w-full" style={{ background: "#050816", overflowX: "hidden" }}>
      <NeuralisPages initialPage="home" mode="preview" />
    </div>
  );
}
