import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import GleamoraPages from "./pages";

export default function GleamoraPreview() {
  return (
    <div dir={templateDir()} data-template-id="gleamora" className="min-h-screen w-full overflow-x-hidden">
      <GleamoraPages initialPage="home" mode="preview" />
    </div>
  );
}
