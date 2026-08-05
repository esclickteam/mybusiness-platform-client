import React from "react";
import PeeloraPages from "./pages";

export default function PeeloraPreview() {
  return (
    <div dir="rtl" data-template-id="peelora" className="min-h-screen w-full" style={{ background: "#F8FCFF", overflowX: "hidden" }}>
      <PeeloraPages initialPage="home" mode="preview" />
    </div>
  );
}
