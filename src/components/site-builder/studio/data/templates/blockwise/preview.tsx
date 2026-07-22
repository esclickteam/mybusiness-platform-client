import React from "react";
import BlockwisePages from "./pages";
export default function BlockwisePreview() {
  return (
    <div dir="rtl" data-template-id="blockwise-preview" className="min-h-screen w-full" style={{ background: "#e8e4df", color: "#1a1a1a" }}>
      <BlockwisePages initialPage="home" mode="preview" />
    </div>
  );
}
