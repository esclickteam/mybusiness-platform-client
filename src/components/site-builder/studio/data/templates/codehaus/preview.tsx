import React from "react";
import CodehausPages from "./pages";

export default function CodehausPreview() {
  return (
    <div dir="rtl" data-template-id="codehaus" className="min-h-screen w-full" style={{ background: "#020617", overflowX: "hidden" }}>
      <CodehausPages initialPage="home" mode="preview" />
    </div>
  );
}
