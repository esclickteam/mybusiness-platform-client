import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import SoundlinePages from "./pages";
export default function SoundlinePreview() {
  return (
    <div dir={templateDir()} data-template-id="soundline" className="min-h-screen w-full" style={{ background: "#0B0B12", overflowX: "hidden" }}>
      <SoundlinePages initialPage="home" mode="preview" />
    </div>
  );
}
