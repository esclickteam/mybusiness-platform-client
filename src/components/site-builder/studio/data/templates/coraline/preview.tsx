import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import CoralinePages from "./pages";
export default function CoralinePreview() {
  return (
    <div dir={templateDir()} data-template-id="coraline" className="min-h-screen w-full" style={{ background: "#041824", color: "#e8f4ff" }}>
      <CoralinePages initialPage="home" mode="preview" />
    </div>
  );
}
