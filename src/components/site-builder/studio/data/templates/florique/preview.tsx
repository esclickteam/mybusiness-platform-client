import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import FloriquePages from "./pages";
export default function FloriquePreview() {
  return (
    <div dir={templateDir()} data-template-id="florique" className="min-h-screen w-full" style={{ background: "#FFF7FB", overflowX: "hidden" }}>
      <FloriquePages initialPage="home" mode="preview" />
    </div>
  );
}
