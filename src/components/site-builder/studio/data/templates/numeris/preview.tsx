import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import NumerisPages from "./pages";

export default function NumerisPreview() {
  return (
    <div dir={templateDir()} data-template-id="numeris" className="min-h-screen w-full" style={{ background: "#F3F6F4", overflowX: "hidden" }}>
      <NumerisPages initialPage="home" mode="preview" />
    </div>
  );
}
