import React from "react";
import FormellaPages from "./pages";

export default function FormellaPreview() {
  return (
    <div dir="rtl" data-template-id="formella-preview" className="min-h-screen w-full" style={{ background: "#0B1009", overflowX: "hidden" }}>
      <FormellaPages initialPage="home" mode="preview" />
    </div>
  );
}
