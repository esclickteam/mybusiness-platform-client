import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import PlayoraPages from "./pages";

export default function PlayoraPreview() {
  return (
    <div dir={templateDir()} data-template-id="playora" className="min-h-screen w-full overflow-x-hidden">
      <PlayoraPages initialPage="home" mode="preview" />
    </div>
  );
}
