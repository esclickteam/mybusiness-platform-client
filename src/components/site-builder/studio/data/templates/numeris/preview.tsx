import React from "react";
import NumerisPages from "./pages";

export default function NumerisPreview() {
  return (
    <div dir="rtl" data-template-id="numeris" className="min-h-screen w-full" style={{ background: "#F3F6F4", overflowX: "hidden" }}>
      <NumerisPages initialPage="home" mode="preview" />
    </div>
  );
}
