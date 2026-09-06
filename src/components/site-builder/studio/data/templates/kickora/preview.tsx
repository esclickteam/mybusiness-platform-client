import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import KickoraPages from "./pages";

export default function KickoraPreview() {
  return (
    <div dir={templateDir()} data-template-id="kickora" className="min-h-screen w-full overflow-x-hidden">
      <KickoraPages initialPage="home" mode="preview" />
    </div>
  );
}
