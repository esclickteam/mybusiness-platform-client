import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import BreworaPages from "./pages";

export default function BreworaPreview() {
  return (
    <div dir={templateDir()} data-template-id="brewora" className="min-h-screen w-full overflow-x-hidden">
      <BreworaPages initialPage="home" mode="preview" />
    </div>
  );
}
