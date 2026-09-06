import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import RivaraPages from "./pages";

export default function RivaraPreview() {
  return (
    <div dir={templateDir()} data-template-id="rivara" className="min-h-screen w-full overflow-hidden" style={{ background: "#e8f3f2", color: "#12343a" }}>
      <RivaraPages initialPage="home" mode="preview" />
    </div>
  );
}
