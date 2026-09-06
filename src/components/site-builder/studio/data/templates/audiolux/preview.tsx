import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import AudioluxPages from "./pages";

export default function AudioluxPreview() {
  return (
    <div dir={templateDir()} data-template-id="audiolux" className="min-h-screen w-full overflow-x-hidden">
      <AudioluxPages initialPage="home" mode="preview" />
    </div>
  );
}
