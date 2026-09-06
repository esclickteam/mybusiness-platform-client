import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import SolennePages from "./pages";

export default function SolennePreview() {
  return (
    <div dir={templateDir()} data-template-id="solenne" className="min-h-screen w-full" style={{ background: "#f7f3ee", color: "#1d1a17" }}>
      <SolennePages initialPage="home" mode="preview" />
    </div>
  );
}
