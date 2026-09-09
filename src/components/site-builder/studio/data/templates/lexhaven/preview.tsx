import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import LexhavenPages from "./pages";

export default function LexhavenPreview() {
  return (
    <div dir={templateDir()} data-template-id="lexhaven" className="min-h-screen w-full" style={{ background: "#F7F3EE", overflowX: "hidden" }}>
      <LexhavenPages initialPage="home" mode="preview" />
    </div>
  );
}
