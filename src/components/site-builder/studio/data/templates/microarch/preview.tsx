import React from "react";
import MicroarchPages from "./pages";

export default function MicroarchPreview() {
  return (
    <div dir="rtl" data-template-id="microarch" className="min-h-screen w-full" style={{ background: "#FFFBEB", overflowX: "hidden" }}>
      <MicroarchPages initialPage="home" mode="preview" />
    </div>
  );
}
