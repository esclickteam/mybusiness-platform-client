import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import TalentixPages from "./pages";

export default function TalentixPreview() {
  return (
    <div dir={templateDir()} data-template-id="talentix" className="min-h-screen w-full overflow-x-hidden">
      <TalentixPages initialPage="home" mode="preview" />
    </div>
  );
}
