import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import PetaluxePages from "./pages";

export default function PetaluxePreview() {
  return (
    <div dir={templateDir()} data-template-id="petaluxe" className="min-h-screen w-full" style={{ background: "#FFF5F9", overflowX: "hidden" }}>
      <PetaluxePages initialPage="home" mode="preview" />
    </div>
  );
}
