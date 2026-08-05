import React from "react";
import SkillforgePages from "./pages";

export default function SkillforgePreview() {
  return (
    <div dir="rtl" data-template-id="skillforge" className="min-h-screen w-full" style={{ background: "#18181B", overflowX: "hidden" }}>
      <SkillforgePages initialPage="home" mode="preview" />
    </div>
  );
}
