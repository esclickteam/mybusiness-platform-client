import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import AxispointPages from "./pages";
export default function AxispointPreview() {
  return (
    <div dir={templateDir()} data-template-id="axispoint" className="min-h-screen w-full" style={{ background: "#0c1222", color: "#e2e8f0" }}>
      <AxispointPages initialPage="home" mode="preview" />
    </div>
  );
}
