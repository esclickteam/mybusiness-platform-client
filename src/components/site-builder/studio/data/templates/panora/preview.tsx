import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import PanoraPages from "./pages";

export default function PanoraPreview() {
  return (
    <div dir={templateDir()} data-template-id="panora" className="min-h-screen w-full overflow-x-hidden">
      <PanoraPages initialPage="home" mode="preview" />
    </div>
  );
}
