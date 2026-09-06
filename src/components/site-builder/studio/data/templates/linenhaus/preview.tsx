import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import LinenhausPages from "./pages";

export default function LinenhausPreview() {
  return (
    <div dir={templateDir()} data-template-id="linenhaus" className="min-h-screen w-full overflow-x-hidden">
      <LinenhausPages initialPage="home" mode="preview" />
    </div>
  );
}
