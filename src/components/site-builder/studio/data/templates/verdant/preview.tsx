import React from "react";
import VerdantPages from "./pages";

export default function VerdantPreview() {
  return (
    <div
      dir="rtl"
      data-template-id="verdant-preview"
      className="min-h-screen w-full"
      style={{ background: "#F7F3ED", overflowX: "hidden" }}
    >
      <VerdantPages initialPage="home" mode="preview" />
    </div>
  );
}
