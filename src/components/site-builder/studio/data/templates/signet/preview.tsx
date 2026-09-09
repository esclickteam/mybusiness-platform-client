import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import SignetPages from "./pages";
export default function SignetPreview() {
  return (
    <div dir={templateDir()} data-template-id="signet" className="min-h-screen w-full" style={{ background: "#1a1814", color: "#f5f0e6" }}>
      <SignetPages initialPage="home" mode="preview" />
    </div>
  );
}
