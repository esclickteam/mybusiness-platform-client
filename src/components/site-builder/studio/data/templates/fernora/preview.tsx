import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import FernoraPages from "./pages";

export default function FernoraPreview() {
  return (
    <div dir={templateDir()} data-template-id="fernora" className="min-h-screen w-full overflow-x-hidden">
      <FernoraPages initialPage="home" mode="preview" />
    </div>
  );
}
