import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import PharmoraPages from "./pages";

export default function PharmoraPreview() {
  return (
    <div dir={templateDir()} data-template-id="pharmora" className="min-h-screen w-full overflow-x-hidden">
      <PharmoraPages initialPage="home" mode="preview" />
    </div>
  );
}
