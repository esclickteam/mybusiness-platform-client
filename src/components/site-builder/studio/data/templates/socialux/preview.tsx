import React from "react";
import SocialuxPages from "./pages";

export default function SocialuxPreview() {
  return (
    <div dir="rtl" data-template-id="socialux" className="min-h-screen w-full overflow-x-hidden">
      <SocialuxPages initialPage="home" mode="preview" />
    </div>
  );
}
