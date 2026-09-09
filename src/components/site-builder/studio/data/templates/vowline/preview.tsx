import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import VowlinePages from "./pages";

export default function VowlinePreview() {
  return (
    <div dir={templateDir()} data-template-id="vowline" className="min-h-screen w-full" style={{ background: "#F8F4F0", overflowX: "hidden" }}>
      <VowlinePages initialPage="home" mode="preview" />
    </div>
  );
}
