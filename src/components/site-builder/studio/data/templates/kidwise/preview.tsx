import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import KidwisePages from "./pages";

export default function KidwisePreview() {
  return (
    <div dir={templateDir()} data-template-id="kidwise" className="min-h-screen w-full" style={{ background: "#ECFDF5", overflowX: "hidden" }}>
      <KidwisePages initialPage="home" mode="preview" />
    </div>
  );
}
