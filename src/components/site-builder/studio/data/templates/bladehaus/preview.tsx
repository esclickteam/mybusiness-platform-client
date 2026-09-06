import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import BladehausPages from "./pages";

export default function BladehausPreview() {
  return (
    <div dir={templateDir()} data-template-id="bladehaus" className="min-h-screen w-full" style={{ background: "#111111", overflowX: "hidden" }}>
      <BladehausPages initialPage="home" mode="preview" />
    </div>
  );
}
