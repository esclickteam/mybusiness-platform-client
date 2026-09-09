import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import MiragePages from "./pages";
export default function MiragePreview() {
  return (
    <div dir={templateDir()} data-template-id="mirage" className="min-h-screen w-full" style={{ background: "#f7f0e4", color: "#4a3828" }}>
      <MiragePages initialPage="home" mode="preview" />
    </div>
  );
}
