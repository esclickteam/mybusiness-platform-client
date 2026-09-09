import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import LoungoraPages from "./pages";

export default function LoungoraPreview() {
  return (
    <div dir={templateDir()} data-template-id="loungora" className="min-h-screen w-full overflow-x-hidden">
      <LoungoraPages initialPage="home" mode="preview" />
    </div>
  );
}
