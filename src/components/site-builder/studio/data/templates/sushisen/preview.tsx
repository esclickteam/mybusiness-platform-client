import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import SushisenPages from "./pages";
export default function SushisenPreview() {
  return (
    <div dir={templateDir()} data-template-id="sushisen" className="min-h-screen w-full" style={{ background: "#0b0b0b", color: "#f2f0ea" }}>
      <SushisenPages initialPage="home" mode="preview" />
    </div>
  );
}
