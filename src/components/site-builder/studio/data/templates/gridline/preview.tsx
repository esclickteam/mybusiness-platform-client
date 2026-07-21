import React from "react";
import GridlinePages from "./pages";

export default function GridlinePreview() {
  return (
    <div dir="rtl" data-template-id="gridline-preview" className="min-h-screen w-full" style={{ background: "#f4f4f0", overflowX: "hidden" }}>
      <GridlinePages initialPage="home" mode="preview" />
    </div>
  );
}
