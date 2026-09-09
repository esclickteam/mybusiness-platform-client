import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import PetoraPages from "./pages";

export default function PetoraPreview() {
  return (
    <div dir={templateDir()} data-template-id="petora" className="min-h-screen w-full overflow-x-hidden">
      <PetoraPages initialPage="home" mode="preview" />
    </div>
  );
}
