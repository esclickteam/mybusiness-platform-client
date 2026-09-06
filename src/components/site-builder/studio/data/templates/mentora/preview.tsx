import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import MentoraPages from "./pages";

export default function MentoraPreview() {
  return (
    <div dir={templateDir()} data-template-id="mentora" className="min-h-screen w-full" style={{ background: "#0F172A", overflowX: "hidden" }}>
      <MentoraPages initialPage="home" mode="preview" />
    </div>
  );
}
