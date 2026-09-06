import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import NestwarePages from "./pages";

export default function NestwarePreview() {
  return (
    <div dir={templateDir()} data-template-id="nestware" className="min-h-screen w-full overflow-x-hidden">
      <NestwarePages initialPage="home" mode="preview" />
    </div>
  );
}
