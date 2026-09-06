import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import BridaluxePages from "./pages";

export default function BridaluxePreview() {
  return (
    <div dir={templateDir()} data-template-id="bridaluxe" className="min-h-screen w-full" style={{ background: "#FFF7F8", overflowX: "hidden" }}>
      <BridaluxePages initialPage="home" mode="preview" />
    </div>
  );
}
