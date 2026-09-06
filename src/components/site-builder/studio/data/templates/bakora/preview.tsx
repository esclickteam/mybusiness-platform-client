import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import BakoraPages from "./pages";
export default function BakoraPreview() {
  return (
    <div dir={templateDir()} data-template-id="bakora" className="min-h-screen w-full" style={{ background: "#faf6f0", color: "#2a1f18" }}>
      <BakoraPages initialPage="home" mode="preview" />
    </div>
  );
}
