import React from "react";
import SmokepitPages from "./pages";
export default function SmokepitPreview() {
  return (
    <div dir="rtl" data-template-id="smokepit" className="min-h-screen w-full" style={{ background: "#120c08", color: "#f3e8d8" }}>
      <SmokepitPages initialPage="home" mode="preview" />
    </div>
  );
}
