import React from "react";
import SugarosePages from "./pages";

export default function SugarosePreview() {
  return (
    <div dir="rtl" data-template-id="sugarose-preview" className="min-h-screen w-full" style={{ background: "#FFF8E6", overflowX: "hidden" }}>
      <SugarosePages initialPage="home" mode="preview" />
    </div>
  );
}
