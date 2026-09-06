import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import InsurevaPages from "./pages";

export default function InsurevaPreview() {
  return (
    <div dir={templateDir()} data-template-id="insureva" className="min-h-screen w-full overflow-x-hidden">
      <InsurevaPages initialPage="home" mode="preview" />
    </div>
  );
}
