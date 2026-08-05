import React from "react";
import GeloraPages from "./pages";

export default function GeloraPreview() {
  return (
    <div dir="rtl" data-template-id="gelora" className="min-h-screen w-full" style={{ background: "#FFF7FB", overflowX: "hidden" }}>
      <GeloraPages initialPage="home" mode="preview" />
    </div>
  );
}
