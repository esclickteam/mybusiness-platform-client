import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import ToolhausPages from "./pages";

export default function ToolhausPreview() {
  return (
    <div dir={templateDir()} data-template-id="toolhaus" className="min-h-screen w-full overflow-x-hidden">
      <ToolhausPages initialPage="home" mode="preview" />
    </div>
  );
}
