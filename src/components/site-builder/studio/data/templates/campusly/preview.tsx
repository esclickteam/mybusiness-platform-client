import React from "react";
import CampuslyPages from "./pages";

export default function CampuslyPreview() {
  return (
    <div dir="rtl" data-template-id="campusly" className="min-h-screen w-full" style={{ background: "#EFF6FF", overflowX: "hidden" }}>
      <CampuslyPages initialPage="home" mode="preview" />
    </div>
  );
}
