import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import VinoraPages from "./pages";

export default function VinoraPreview() {
  return (
    <div dir={templateDir()} data-template-id="vinora" className="min-h-screen w-full overflow-x-hidden">
      <VinoraPages initialPage="home" mode="preview" />
    </div>
  );
}
