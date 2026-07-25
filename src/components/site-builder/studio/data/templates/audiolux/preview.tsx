import React from "react";
import AudioluxPages from "./pages";

export default function AudioluxPreview() {
  return (
    <div dir="rtl" data-template-id="audiolux-preview" className="min-h-screen w-full overflow-x-hidden">
      <AudioluxPages initialPage="home" mode="preview" />
    </div>
  );
}
