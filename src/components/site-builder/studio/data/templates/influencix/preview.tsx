import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import InfluencixPages from "./pages";

export default function InfluencixPreview() {
  return (
    <div dir={templateDir()} data-template-id="influencix" className="min-h-screen w-full overflow-x-hidden">
      <InfluencixPages initialPage="home" mode="preview" />
    </div>
  );
}
