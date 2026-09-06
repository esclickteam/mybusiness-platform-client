import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import MediavaultPages from "./pages";

export default function MediavaultPreview() {
  return (
    <div dir={templateDir()} data-template-id="mediavault" className="min-h-screen w-full overflow-x-hidden">
      <MediavaultPages initialPage="home" mode="preview" />
    </div>
  );
}
