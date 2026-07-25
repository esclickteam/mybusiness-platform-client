import React from "react";
import CosmellaPages from "./pages";

export default function CosmellaPreview() {
  return (
    <div dir="rtl" data-template-id="cosmella-preview" className="min-h-screen w-full" style={{ background: "#F6FFFB", overflowX: "hidden" }}>
      <CosmellaPages initialPage="home" mode="preview" />
    </div>
  );
}
