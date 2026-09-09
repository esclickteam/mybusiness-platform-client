import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import CrisisdeskPages from "./pages";

export default function CrisisdeskPreview() {
  return (
    <div dir={templateDir()} data-template-id="crisisdesk" className="min-h-screen w-full overflow-x-hidden">
      <CrisisdeskPages initialPage="home" mode="preview" />
    </div>
  );
}
