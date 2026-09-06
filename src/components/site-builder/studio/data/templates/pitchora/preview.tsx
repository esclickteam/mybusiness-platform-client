import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import PitchoraPages from "./pages";

export default function PitchoraPreview() {
  return (
    <div dir={templateDir()} data-template-id="pitchora" className="min-h-screen w-full overflow-x-hidden">
      <PitchoraPages initialPage="home" mode="preview" />
    </div>
  );
}
