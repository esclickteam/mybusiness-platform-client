import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import ContentraPages from "./pages";

export default function ContentraPreview() {
  return (
    <div dir={templateDir()} data-template-id="contentra" className="min-h-screen w-full overflow-x-hidden">
      <ContentraPages initialPage="home" mode="preview" />
    </div>
  );
}
