import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import SocialuxPages from "./pages";

export default function SocialuxPreview() {
  return (
    <div dir={templateDir()} data-template-id="socialux" className="min-h-screen w-full overflow-x-hidden">
      <SocialuxPages initialPage="home" mode="preview" />
    </div>
  );
}
