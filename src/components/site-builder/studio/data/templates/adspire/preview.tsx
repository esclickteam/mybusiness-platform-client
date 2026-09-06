import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import AdspirePages from "./pages";

export default function AdspirePreview() {
  return (
    <div dir={templateDir()} data-template-id="adspire" className="min-h-screen w-full overflow-x-hidden">
      <AdspirePages initialPage="home" mode="preview" />
    </div>
  );
}
