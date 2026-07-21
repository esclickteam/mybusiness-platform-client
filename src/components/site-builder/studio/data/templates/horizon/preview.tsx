import React from "react";
import HorizonPages from "./pages";

export default function HorizonPreview() {
  return (
    <div dir="rtl" data-template-id="horizon-preview" className="min-h-screen w-full" style={{ background: "#f7f3ed", overflowX: "hidden" }}>
      <HorizonPages initialPage="home" mode="preview" />
    </div>
  );
}
