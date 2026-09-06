import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import FramehausPages from "./pages";

export default function FramehausPreview() {
  return (
    <div dir={templateDir()} data-template-id="framehaus" className="min-h-screen w-full" style={{ background: "#fafafa", overflowX: "hidden" }}>
      <FramehausPages initialPage="home" mode="preview" />
    </div>
  );
}
