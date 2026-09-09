import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import ScentoraPages from "./pages";

export default function ScentoraPreview() {
  return (
    <div dir={templateDir()} data-template-id="scentora" className="min-h-screen w-full overflow-x-hidden">
      <ScentoraPages initialPage="home" mode="preview" />
    </div>
  );
}
