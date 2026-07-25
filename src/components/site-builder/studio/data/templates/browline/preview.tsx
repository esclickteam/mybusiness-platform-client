import React from "react";
import BrowlinePages from "./pages";

export default function BrowlinePreview() {
  return (
    <div dir="rtl" data-template-id="browline-preview" className="min-h-screen w-full" style={{ background: "#FBF7F4", overflowX: "hidden" }}>
      <BrowlinePages initialPage="home" mode="preview" />
    </div>
  );
}
