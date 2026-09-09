import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import BrowlinePages from "./pages";

export default function BrowlinePreview() {
  return (
    <div dir={templateDir()} data-template-id="browline" className="min-h-screen w-full" style={{ background: "#FBF7F4", overflowX: "hidden" }}>
      <BrowlinePages initialPage="home" mode="preview" />
    </div>
  );
}
