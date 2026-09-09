import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import CosmellaPages from "./pages";

export default function CosmellaPreview() {
  return (
    <div dir={templateDir()} data-template-id="cosmella" className="min-h-screen w-full" style={{ background: "#F6FFFB", overflowX: "hidden" }}>
      <CosmellaPages initialPage="home" mode="preview" />
    </div>
  );
}
