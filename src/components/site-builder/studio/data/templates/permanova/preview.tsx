import React from "react";
import PermanovaPages from "./pages";

export default function PermanovaPreview() {
  return (
    <div dir="rtl" data-template-id="permanova" className="min-h-screen w-full" style={{ background: "#FFFBF7", overflowX: "hidden" }}>
      <PermanovaPages initialPage="home" mode="preview" />
    </div>
  );
}
