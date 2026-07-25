import React from "react";
import SavoryPages from "./pages";

export default function SavoryPreview() {
  return (
    <div
      dir="rtl"
      data-template-id="savory-preview"
      className="min-h-screen w-full"
      style={{ background: "#FAF6F0", overflowX: "hidden" }}
    >
      <SavoryPages initialPage="home" mode="preview" />
    </div>
  );
}
