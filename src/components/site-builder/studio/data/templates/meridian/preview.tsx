import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import MeridianPages from "./pages";

export default function MeridianPreview() {
  return (
    <div dir={templateDir()} data-template-id="meridian" className="min-h-screen w-full" style={{ background: "#12100e", color: "#f3ebe1" }}>
      <MeridianPages initialPage="home" mode="preview" />
    </div>
  );
}
