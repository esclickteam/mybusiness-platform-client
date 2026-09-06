import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import UrbanixPages from "./pages";

export default function UrbanixPreview() {
  return (
    <div dir={templateDir()} data-template-id="urbanix" className="min-h-screen w-full" style={{ background: "#141516", color: "#f2f2f0" }}>
      <UrbanixPages initialPage="home" mode="preview" />
    </div>
  );
}
