import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import SummitopsPages from "./pages";

export default function SummitopsPreview() {
  return (
    <div dir={templateDir()} data-template-id="summitops" className="min-h-screen w-full overflow-x-hidden">
      <SummitopsPages initialPage="home" mode="preview" />
    </div>
  );
}
