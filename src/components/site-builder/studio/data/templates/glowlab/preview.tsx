import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import GlowlabPages from "./pages";

export default function GlowlabPreview() {
  return (
    <div dir={templateDir()} data-template-id="glowlab" className="min-h-screen w-full overflow-x-hidden">
      <GlowlabPages initialPage="home" mode="preview" />
    </div>
  );
}
