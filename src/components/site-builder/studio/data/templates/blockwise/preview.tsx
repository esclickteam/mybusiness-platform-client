import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import BlockwisePages from "./pages";
export default function BlockwisePreview() {
  return (
    <div dir={templateDir()} data-template-id="blockwise" className="min-h-screen w-full" style={{ background: "#e8e4df", color: "#1a1a1a" }}>
      <BlockwisePages initialPage="home" mode="preview" />
    </div>
  );
}
