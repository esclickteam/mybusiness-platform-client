import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import TipcraftPages from "./pages";

export default function TipcraftPreview() {
  return (
    <div dir={templateDir()} data-template-id="tipcraft" className="min-h-screen w-full" style={{ background: "#FAF8FF", overflowX: "hidden" }}>
      <TipcraftPages initialPage="home" mode="preview" />
    </div>
  );
}
