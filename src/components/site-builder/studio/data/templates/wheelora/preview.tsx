import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import WheeloraPages from "./pages";

export default function WheeloraPreview() {
  return (
    <div dir={templateDir()} data-template-id="wheelora" className="min-h-screen w-full overflow-x-hidden">
      <WheeloraPages initialPage="home" mode="preview" />
    </div>
  );
}
