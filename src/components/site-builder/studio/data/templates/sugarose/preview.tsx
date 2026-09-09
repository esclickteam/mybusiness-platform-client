import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import SugarosePages from "./pages";

export default function SugarosePreview() {
  return (
    <div dir={templateDir()} data-template-id="sugarose" className="min-h-screen w-full" style={{ background: "#FFF8E6", overflowX: "hidden" }}>
      <SugarosePages initialPage="home" mode="preview" />
    </div>
  );
}
