import React from "react";
import SpajadePages from "./pages";

export default function SpajadePreview() {
  return (
    <div dir="rtl" data-template-id="spajade" className="min-h-screen w-full" style={{ background: "#07140F", overflowX: "hidden" }}>
      <SpajadePages initialPage="home" mode="preview" />
    </div>
  );
}
