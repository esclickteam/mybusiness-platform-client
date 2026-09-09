import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import BagoraPages from "./pages";

export default function BagoraPreview() {
  return (
    <div dir={templateDir()} data-template-id="bagora" className="min-h-screen w-full overflow-x-hidden">
      <BagoraPages initialPage="home" mode="preview" />
    </div>
  );
}
