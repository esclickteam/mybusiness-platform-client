import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import SeoraPages from "./pages";

export default function SeoraPreview() {
  return (
    <div dir={templateDir()} data-template-id="seora" className="min-h-screen w-full overflow-x-hidden">
      <SeoraPages initialPage="home" mode="preview" />
    </div>
  );
}
