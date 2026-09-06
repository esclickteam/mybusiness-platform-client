import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import SportifyaPages from "./pages";

export default function SportifyaPreview() {
  return (
    <div dir={templateDir()} data-template-id="sportifya" className="min-h-screen w-full overflow-x-hidden">
      <SportifyaPages initialPage="home" mode="preview" />
    </div>
  );
}
