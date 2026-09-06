import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import DwellistPages from "./pages";
export default function DwellistPreview() {
  return (
    <div dir={templateDir()} data-template-id="dwellist" className="min-h-screen w-full" style={{ background: "#faf8f5", color: "#2c2419" }}>
      <DwellistPages initialPage="home" mode="preview" />
    </div>
  );
}
