import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import PolyglotaPages from "./pages";

export default function PolyglotaPreview() {
  return (
    <div dir={templateDir()} data-template-id="polyglota" className="min-h-screen w-full" style={{ background: "#F0F9FF", overflowX: "hidden" }}>
      <PolyglotaPages initialPage="home" mode="preview" />
    </div>
  );
}
