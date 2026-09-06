import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import SkillforgePages from "./pages";

export default function SkillforgePreview() {
  return (
    <div dir={templateDir()} data-template-id="skillforge" className="min-h-screen w-full" style={{ background: "#18181B", overflowX: "hidden" }}>
      <SkillforgePages initialPage="home" mode="preview" />
    </div>
  );
}
