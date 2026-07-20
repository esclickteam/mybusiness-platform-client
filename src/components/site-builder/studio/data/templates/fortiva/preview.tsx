import React from "react";
import FortivaPages from "./pages";

export default function FortivaPreview() {
  return (
    <div
      dir="rtl"
      data-template-id="fortiva-preview"
      className="min-h-screen w-full bg-[#f6f5f1] text-[#0f1e3d]"
      style={{
        overflowX: "hidden",
        overflowY: "auto",
        position: "relative",
      }}
    >
      <FortivaPages initialPage="home" mode="preview" />
    </div>
  );
}
