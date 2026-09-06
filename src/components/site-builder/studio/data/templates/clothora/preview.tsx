import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import ClothoraPages from "./pages";

export default function ClothoraPreview() {
  return (
    <div dir={templateDir()} data-template-id="clothora" className="min-h-screen w-full overflow-x-hidden">
      <ClothoraPages initialPage="home" mode="preview" />
    </div>
  );
}
