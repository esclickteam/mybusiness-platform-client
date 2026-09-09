import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import GlowhausPages from "./pages";

export default function GlowhausPreview() {
  return (
    <div dir={templateDir()} data-template-id="glowhaus" className="min-h-screen w-full" style={{ background: "#061018", overflowX: "hidden" }}>
      <GlowhausPages initialPage="home" mode="preview" />
    </div>
  );
}
