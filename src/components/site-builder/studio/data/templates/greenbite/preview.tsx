import React from "react";
import GreenbitePages from "./pages";

export default function GreenbitePreview() {
  return (
    <div dir="rtl" data-template-id="greenbite-preview" className="min-h-screen w-full overflow-x-hidden">
      <GreenbitePages initialPage="home" mode="preview" />
    </div>
  );
}
