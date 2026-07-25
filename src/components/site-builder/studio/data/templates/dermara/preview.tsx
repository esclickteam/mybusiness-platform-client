import React from "react";
import DermaraPages from "./pages";

export default function DermaraPreview() {
  return (
    <div dir="rtl" data-template-id="dermara-preview" className="min-h-screen w-full" style={{ background: "#F7FFFD", overflowX: "hidden" }}>
      <DermaraPages initialPage="home" mode="preview" />
    </div>
  );
}
