import React from "react";
import NestwarePages from "./pages";

export default function NestwarePreview() {
  return (
    <div dir="rtl" data-template-id="nestware" className="min-h-screen w-full overflow-x-hidden">
      <NestwarePages initialPage="home" mode="preview" />
    </div>
  );
}
