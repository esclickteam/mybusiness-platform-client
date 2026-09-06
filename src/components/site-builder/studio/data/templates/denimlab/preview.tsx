import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import DenimlabPages from "./pages";

export default function DenimlabPreview() {
  return (
    <div dir={templateDir()} data-template-id="denimlab" className="min-h-screen w-full overflow-x-hidden">
      <DenimlabPages initialPage="home" mode="preview" />
    </div>
  );
}
