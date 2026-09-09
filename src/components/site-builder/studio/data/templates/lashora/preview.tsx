import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import LashoraPages from "./pages";

export default function LashoraPreview() {
  return (
    <div dir={templateDir()} data-template-id="lashora" className="min-h-screen w-full" style={{ background: "#0B0A12", overflowX: "hidden" }}>
      <LashoraPages initialPage="home" mode="preview" />
    </div>
  );
}
