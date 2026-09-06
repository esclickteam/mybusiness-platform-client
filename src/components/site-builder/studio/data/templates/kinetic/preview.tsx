import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import KineticPages from "./pages";

export default function KineticPreview() {
  return (
    <div dir={templateDir()} data-template-id="kinetic" className="min-h-screen w-full" style={{ background: "#0b0b0b", overflowX: "hidden" }}>
      <KineticPages initialPage="home" mode="preview" />
    </div>
  );
}
