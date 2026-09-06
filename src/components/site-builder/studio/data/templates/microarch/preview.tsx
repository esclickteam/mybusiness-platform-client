import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import MicroarchPages from "./pages";

export default function MicroarchPreview() {
  return (
    <div dir={templateDir()} data-template-id="microarch" className="min-h-screen w-full" style={{ background: "#FFFBEB", overflowX: "hidden" }}>
      <MicroarchPages initialPage="home" mode="preview" />
    </div>
  );
}
