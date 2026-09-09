import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import MarkoraPages from "./pages";

export default function MarkoraPreview() {
  return (
    <div dir={templateDir()} data-template-id="markora" className="min-h-screen w-full" style={{ background: "#0A0A0B", overflowX: "hidden" }}>
      <MarkoraPages initialPage="home" mode="preview" />
    </div>
  );
}
