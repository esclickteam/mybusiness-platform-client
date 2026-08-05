import React from "react";
import WheeloraPages from "./pages";

export default function WheeloraPreview() {
  return (
    <div dir="rtl" data-template-id="wheelora" className="min-h-screen w-full overflow-x-hidden">
      <WheeloraPages initialPage="home" mode="preview" />
    </div>
  );
}
