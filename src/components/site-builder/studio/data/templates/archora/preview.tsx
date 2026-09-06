import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import ArchoraPages from "./pages";
export default function ArchoraPreview() {
  return (
    <div dir={templateDir()} data-template-id="archora" className="min-h-screen w-full" style={{ background: "#111111", overflowX: "hidden" }}>
      <ArchoraPages initialPage="home" mode="preview" />
    </div>
  );
}
