import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import FranchoraPages from "./pages";

export default function FranchoraPreview() {
  return (
    <div dir={templateDir()} data-template-id="franchora" className="min-h-screen w-full overflow-x-hidden">
      <FranchoraPages initialPage="home" mode="preview" />
    </div>
  );
}
