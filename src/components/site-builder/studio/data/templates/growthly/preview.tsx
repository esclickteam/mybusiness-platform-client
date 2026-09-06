import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import GrowthlyPages from "./pages";

export default function GrowthlyPreview() {
  return (
    <div dir={templateDir()} data-template-id="growthly" className="min-h-screen w-full overflow-x-hidden">
      <GrowthlyPages initialPage="home" mode="preview" />
    </div>
  );
}
