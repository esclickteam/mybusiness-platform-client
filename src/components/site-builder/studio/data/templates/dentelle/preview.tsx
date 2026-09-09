import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import DentellePages from "./pages";
export default function DentellePreview() {
  return (
    <div dir={templateDir()} data-template-id="dentelle" className="min-h-screen w-full" style={{ background: "#F8FAFC", overflowX: "hidden" }}>
      <DentellePages initialPage="home" mode="preview" />
    </div>
  );
}
