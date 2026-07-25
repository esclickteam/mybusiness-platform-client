import React from "react";
import ClearskinPages from "./pages";

export default function ClearskinPreview() {
  return (
    <div dir="rtl" data-template-id="clearskin-preview" className="min-h-screen w-full" style={{ background: "#F3FEFF", overflowX: "hidden" }}>
      <ClearskinPages initialPage="home" mode="preview" />
    </div>
  );
}
