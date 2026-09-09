import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import SilkbarPages from "./pages";

export default function SilkbarPreview() {
  return (
    <div dir={templateDir()} data-template-id="silkbar" className="min-h-screen w-full" style={{ background: "#F7FCFB", overflowX: "hidden" }}>
      <SilkbarPages initialPage="home" mode="preview" />
    </div>
  );
}
