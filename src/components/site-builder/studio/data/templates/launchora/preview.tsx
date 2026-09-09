import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import LaunchoraPages from "./pages";

export default function LaunchoraPreview() {
  return (
    <div dir={templateDir()} data-template-id="launchora" className="min-h-screen w-full overflow-x-hidden">
      <LaunchoraPages initialPage="home" mode="preview" />
    </div>
  );
}
