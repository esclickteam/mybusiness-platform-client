import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import ClearskinPages from "./pages";

export default function ClearskinPreview() {
  return (
    <div dir={templateDir()} data-template-id="clearskin" className="min-h-screen w-full" style={{ background: "#F3FEFF", overflowX: "hidden" }}>
      <ClearskinPages initialPage="home" mode="preview" />
    </div>
  );
}
