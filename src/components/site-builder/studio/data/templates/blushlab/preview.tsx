import React from "react";
import BlushlabPages from "./pages";

export default function BlushlabPreview() {
  return (
    <div dir="rtl" data-template-id="blushlab-preview" className="min-h-screen w-full" style={{ background: "#14080C", overflowX: "hidden" }}>
      <BlushlabPages initialPage="home" mode="preview" />
    </div>
  );
}
