import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import MonolithPages from "./pages";

export default function MonolithPreview() {
  return (
    <div dir={templateDir()} data-template-id="monolith" className="min-h-screen w-full" style={{ background: "#eef0f4", overflowX: "hidden" }}>
      <MonolithPages initialPage="home" mode="preview" />
    </div>
  );
}
