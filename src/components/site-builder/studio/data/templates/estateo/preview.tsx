import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import EstateoPages from "./pages";

export default function EstateoPreview() {
  return (
    <div dir={templateDir()} data-template-id="estateo" className="min-h-screen w-full" style={{ background: "#100e0c", color: "#f4ecdf" }}>
      <EstateoPages initialPage="home" mode="preview" />
    </div>
  );
}
