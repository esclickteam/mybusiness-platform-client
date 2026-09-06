import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import FluxoraPages from "./pages";

export default function FluxoraPreview() {
  return (
    <div
      dir={templateDir()}
      data-template-id="fluxora"
      className="min-h-screen w-full bg-[#070b10] text-[#e8eef5]"
    >
      <FluxoraPages initialPage="home" mode="preview" />
    </div>
  );
}
