import React from "react";
import FormaraPages from "./pages";

export default function FormaraPreview() {
  return (
    <div dir="rtl" data-template-id="formara" className="min-h-screen w-full" style={{ background: "#1E1C1A", overflowX: "hidden" }}>
      <FormaraPages initialPage="home" mode="preview" />
    </div>
  );
}
