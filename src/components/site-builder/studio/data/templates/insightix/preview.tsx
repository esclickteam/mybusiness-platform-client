import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import InsightixPages from "./pages";

export default function InsightixPreview() {
  return (
    <div dir={templateDir()} data-template-id="insightix" className="min-h-screen w-full overflow-x-hidden">
      <InsightixPages initialPage="home" mode="preview" />
    </div>
  );
}
