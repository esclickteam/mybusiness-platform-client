import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import HorizonPages from "./pages";

export default function HorizonPreview() {
  return (
    <div dir={templateDir()} data-template-id="horizon" className="min-h-screen w-full" style={{ background: "#f7f3ed", overflowX: "hidden" }}>
      <HorizonPages initialPage="home" mode="preview" />
    </div>
  );
}
