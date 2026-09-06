import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import FormellaPages from "./pages";

export default function FormellaPreview() {
  return (
    <div dir={templateDir()} data-template-id="formella" className="min-h-screen w-full" style={{ background: "#0B1009", overflowX: "hidden" }}>
      <FormellaPages initialPage="home" mode="preview" />
    </div>
  );
}
