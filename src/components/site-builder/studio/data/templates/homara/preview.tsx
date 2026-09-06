import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import HomaraPages from "./pages";

export default function HomaraPreview() {
  return (
    <div dir={templateDir()} data-template-id="homara" className="min-h-screen w-full" style={{ background: "#f3f0e8", color: "#243028" }}>
      <HomaraPages initialPage="home" mode="preview" />
    </div>
  );
}
