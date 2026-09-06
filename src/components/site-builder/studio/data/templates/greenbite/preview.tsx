import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import GreenbitePages from "./pages";

export default function GreenbitePreview() {
  return (
    <div dir={templateDir()} data-template-id="greenbite" className="min-h-screen w-full overflow-x-hidden">
      <GreenbitePages initialPage="home" mode="preview" />
    </div>
  );
}
