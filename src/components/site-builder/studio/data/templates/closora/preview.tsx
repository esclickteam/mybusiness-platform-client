import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import ClosoraPages from "./pages";

export default function ClosoraPreview() {
  return (
    <div dir={templateDir()} data-template-id="closora" className="min-h-screen w-full overflow-x-hidden">
      <ClosoraPages initialPage="home" mode="preview" />
    </div>
  );
}
