import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import UxforgePages from "./pages";

export default function UxforgePreview() {
  return (
    <div dir={templateDir()} data-template-id="uxforge" className="min-h-screen w-full overflow-x-hidden">
      <UxforgePages initialPage="home" mode="preview" />
    </div>
  );
}
