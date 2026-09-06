import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import SpajadePages from "./pages";

export default function SpajadePreview() {
  return (
    <div dir={templateDir()} data-template-id="spajade" className="min-h-screen w-full" style={{ background: "#07140F", overflowX: "hidden" }}>
      <SpajadePages initialPage="home" mode="preview" />
    </div>
  );
}
