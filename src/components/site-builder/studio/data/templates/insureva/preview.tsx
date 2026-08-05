import React from "react";
import InsurevaPages from "./pages";

export default function InsurevaPreview() {
  return (
    <div dir="rtl" data-template-id="insureva" className="min-h-screen w-full overflow-x-hidden">
      <InsurevaPages initialPage="home" mode="preview" />
    </div>
  );
}
