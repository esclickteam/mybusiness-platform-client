import React from "react";
import NailoraPages from "./pages";

export default function NailoraPreview() {
  return (
    <div dir="rtl" data-template-id="nailora" className="min-h-screen w-full" style={{ background: "#FFF8FA", overflowX: "hidden" }}>
      <NailoraPages initialPage="home" mode="preview" />
    </div>
  );
}
