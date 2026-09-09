import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import PrismPages from "./pages";

export default function PrismPreview() {
  return (
    <div dir={templateDir()} data-template-id="prism" className="min-h-screen w-full" style={{ background: "#fffef8", overflowX: "hidden" }}>
      <PrismPages initialPage="home" mode="preview" />
    </div>
  );
}
