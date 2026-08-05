import React from "react";
import SeafoodixPages from "./pages";
export default function SeafoodixPreview() {
  return (
    <div dir="rtl" data-template-id="seafoodix" className="min-h-screen w-full" style={{ background: "#04151c", color: "#e6f4f8" }}>
      <SeafoodixPages initialPage="home" mode="preview" />
    </div>
  );
}
