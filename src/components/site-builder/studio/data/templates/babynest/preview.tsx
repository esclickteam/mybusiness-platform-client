import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import BabynestPages from "./pages";

export default function BabynestPreview() {
  return (
    <div dir={templateDir()} data-template-id="babynest" className="min-h-screen w-full overflow-x-hidden">
      <BabynestPages initialPage="home" mode="preview" />
    </div>
  );
}
