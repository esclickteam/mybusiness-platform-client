import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import JewelisPages from "./pages";

export default function JewelisPreview() {
  return (
    <div dir={templateDir()} data-template-id="jewelis" className="min-h-screen w-full overflow-x-hidden">
      <JewelisPages initialPage="home" mode="preview" />
    </div>
  );
}
