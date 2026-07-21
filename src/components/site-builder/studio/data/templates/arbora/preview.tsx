import React from "react";
import ArboraPages from "./pages";

export default function ArboraPreview() {
  return (
    <div dir="rtl" data-template-id="arbora-preview" className="min-h-screen w-full" style={{ background: "#eef2ea", color: "#1c2618" }}>
      <ArboraPages initialPage="home" mode="preview" />
    </div>
  );
}
