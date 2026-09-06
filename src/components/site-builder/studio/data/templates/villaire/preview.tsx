import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import VillairePages from "./pages";

export default function VillairePreview() {
  return (
    <div dir={templateDir()} data-template-id="villaire" className="min-h-screen w-full overflow-hidden" style={{ background: "#0a0a0a", color: "#f4efe6" }}>
      <VillairePages initialPage="home" mode="preview" />
    </div>
  );
}
