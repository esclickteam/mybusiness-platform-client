import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import TapasoraPages from "./pages";
export default function TapasoraPreview() {
  return (
    <div dir={templateDir()} data-template-id="tapasora" className="min-h-screen w-full" style={{ background: "#12081a", color: "#f8eef8" }}>
      <TapasoraPages initialPage="home" mode="preview" />
    </div>
  );
}
