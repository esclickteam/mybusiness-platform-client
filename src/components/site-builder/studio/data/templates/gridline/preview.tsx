import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import GridlinePages from "./pages";

export default function GridlinePreview() {
  return (
    <div dir={templateDir()} data-template-id="gridline" className="min-h-screen w-full" style={{ background: "#f4f4f0", overflowX: "hidden" }}>
      <GridlinePages initialPage="home" mode="preview" />
    </div>
  );
}
