import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import VitaraPages from "./pages";

export default function VitaraPreview() {
  return (
    <div dir={templateDir()} data-template-id="vitara" className="min-h-screen w-full overflow-x-hidden">
      <VitaraPages initialPage="home" mode="preview" />
    </div>
  );
}
