import React from "react";
import MasterlyPages from "./pages";

export default function MasterlyPreview() {
  return (
    <div dir="rtl" data-template-id="masterly" className="min-h-screen w-full" style={{ background: "#0A0A0A", overflowX: "hidden" }}>
      <MasterlyPages initialPage="home" mode="preview" />
    </div>
  );
}
