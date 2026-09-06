import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import CampuslyPages from "./pages";

export default function CampuslyPreview() {
  return (
    <div dir={templateDir()} data-template-id="campusly" className="min-h-screen w-full" style={{ background: "#EFF6FF", overflowX: "hidden" }}>
      <CampuslyPages initialPage="home" mode="preview" />
    </div>
  );
}
