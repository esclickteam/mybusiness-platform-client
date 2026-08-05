import React from "react";
import MentoraPages from "./pages";

export default function MentoraPreview() {
  return (
    <div dir="rtl" data-template-id="mentora" className="min-h-screen w-full" style={{ background: "#0F172A", overflowX: "hidden" }}>
      <MentoraPages initialPage="home" mode="preview" />
    </div>
  );
}
