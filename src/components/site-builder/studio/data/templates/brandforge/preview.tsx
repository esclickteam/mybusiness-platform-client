import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import BrandforgePages from "./pages";

export default function BrandforgePreview() {
  return (
    <div dir={templateDir()} data-template-id="brandforge" className="min-h-screen w-full overflow-x-hidden">
      <BrandforgePages initialPage="home" mode="preview" />
    </div>
  );
}
