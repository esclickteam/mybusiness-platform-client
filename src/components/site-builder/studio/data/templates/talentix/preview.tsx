import React from "react";
import TalentixPages from "./pages";

export default function TalentixPreview() {
  return (
    <div dir="rtl" data-template-id="talentix-preview" className="min-h-screen w-full overflow-x-hidden">
      <TalentixPages initialPage="home" mode="preview" />
    </div>
  );
}
