import React from "react";
import MediavaultPages from "./pages";

export default function MediavaultPreview() {
  return (
    <div dir="rtl" data-template-id="mediavault-preview" className="min-h-screen w-full overflow-x-hidden">
      <MediavaultPages initialPage="home" mode="preview" />
    </div>
  );
}
