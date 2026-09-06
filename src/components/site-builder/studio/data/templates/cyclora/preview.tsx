import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";

import CycloraPages from "./pages";

export default function CycloraPreview() {
  return (
    <div
      dir={templateDir()}
      data-template-id="cyclora"
      className="relative h-screen min-h-screen w-full overflow-hidden bg-black text-white"
    >
      <div className="h-full w-full overflow-x-hidden overflow-y-auto">
        <CycloraPages initialPage="home" mode="preview" />
      </div>
    </div>
  );
}