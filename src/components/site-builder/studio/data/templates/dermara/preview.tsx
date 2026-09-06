import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import DermaraPages from "./pages";

export default function DermaraPreview() {
  return (
    <div dir={templateDir()} data-template-id="dermara" className="min-h-screen w-full" style={{ background: "#F7FFFD", overflowX: "hidden" }}>
      <DermaraPages initialPage="home" mode="preview" />
    </div>
  );
}
