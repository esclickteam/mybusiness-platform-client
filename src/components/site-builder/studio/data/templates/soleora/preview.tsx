import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import SoleoraPages from "./pages";

export default function SoleoraPreview() {
  return (
    <div dir={templateDir()} data-template-id="soleora" className="min-h-screen w-full overflow-x-hidden">
      <SoleoraPages initialPage="home" mode="preview" />
    </div>
  );
}
