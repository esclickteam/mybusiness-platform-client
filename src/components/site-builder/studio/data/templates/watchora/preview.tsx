import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import WatchoraPages from "./pages";

export default function WatchoraPreview() {
  return (
    <div dir={templateDir()} data-template-id="watchora" className="min-h-screen w-full overflow-x-hidden">
      <WatchoraPages initialPage="home" mode="preview" />
    </div>
  );
}
