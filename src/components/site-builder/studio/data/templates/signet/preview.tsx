import React from "react";
import SignetPages from "./pages";
export default function SignetPreview() {
  return (
    <div dir="rtl" data-template-id="signet-preview" className="min-h-screen w-full" style={{ background: "#1a1814", color: "#f5f0e6" }}>
      <SignetPages initialPage="home" mode="preview" />
    </div>
  );
}
