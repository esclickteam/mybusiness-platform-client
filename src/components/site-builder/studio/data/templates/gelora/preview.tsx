import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import GeloraPages from "./pages";

export default function GeloraPreview() {
  return (
    <div dir={templateDir()} data-template-id="gelora" className="min-h-screen w-full" style={{ background: "#FFF7FB", overflowX: "hidden" }}>
      <GeloraPages initialPage="home" mode="preview" />
    </div>
  );
}
