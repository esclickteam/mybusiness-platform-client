import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import LumenwarePages from "./pages";

export default function LumenwarePreview() {
  return (
    <div dir={templateDir()} data-template-id="lumenware" className="min-h-screen w-full overflow-x-hidden">
      <LumenwarePages initialPage="home" mode="preview" />
    </div>
  );
}
