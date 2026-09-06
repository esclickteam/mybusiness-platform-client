import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import PartnerlyPages from "./pages";

export default function PartnerlyPreview() {
  return (
    <div dir={templateDir()} data-template-id="partnerly" className="min-h-screen w-full overflow-x-hidden">
      <PartnerlyPages initialPage="home" mode="preview" />
    </div>
  );
}
