import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";

import DomoraPages from "./pages";
import { domoraDefaultData } from "./defaultData";

export default function DomoraPreview() {
  return (
    <div
      dir={templateDir()}
      data-template-id="domora"
      className="h-screen min-h-screen w-full overflow-hidden bg-[#f5f5f2] text-[#151d20]"
    >
      <DomoraPages
        initialPage="home"
        mode="preview"
        defaultData={domoraDefaultData}
      />
    </div>
  );
}