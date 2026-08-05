import React from "react";
import AutovoltPages from "./pages";
export default function AutovoltPreview() {
  return (
    <div dir="rtl" data-template-id="autovolt" className="min-h-screen w-full" style={{ background: "#0A0F14", overflowX: "hidden" }}>
      <AutovoltPages initialPage="home" mode="preview" />
    </div>
  );
}
