import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import NarrativaPages from "./pages";

export default function NarrativaPreview() {
  return (
    <div dir={templateDir()} data-template-id="narrativa" className="min-h-screen w-full overflow-x-hidden">
      <NarrativaPages initialPage="home" mode="preview" />
    </div>
  );
}
