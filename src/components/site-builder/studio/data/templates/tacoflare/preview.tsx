import React from "react";
import TacoflarePages from "./pages";
export default function TacoflarePreview() {
  return (
    <div dir="rtl" data-template-id="tacoflare" className="min-h-screen w-full" style={{ background: "#1a0e0a", color: "#fff3e8" }}>
      <TacoflarePages initialPage="home" mode="preview" />
    </div>
  );
}
