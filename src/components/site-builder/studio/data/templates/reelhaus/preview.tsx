import React from "react";
import ReelhausPages from "./pages";

export default function ReelhausPreview() {
  return (
    <div dir="rtl" data-template-id="reelhaus-preview" className="min-h-screen w-full overflow-x-hidden">
      <ReelhausPages initialPage="home" mode="preview" />
    </div>
  );
}
