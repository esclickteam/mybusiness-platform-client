import React from "react";
import LexhavenPages from "./pages";

export default function LexhavenPreview() {
  return (
    <div dir="rtl" data-template-id="lexhaven-preview" className="min-h-screen w-full" style={{ background: "#F7F3EE", overflowX: "hidden" }}>
      <LexhavenPages initialPage="home" mode="preview" />
    </div>
  );
}
