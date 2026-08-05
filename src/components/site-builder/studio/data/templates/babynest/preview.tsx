import React from "react";
import BabynestPages from "./pages";

export default function BabynestPreview() {
  return (
    <div dir="rtl" data-template-id="babynest" className="min-h-screen w-full overflow-x-hidden">
      <BabynestPages initialPage="home" mode="preview" />
    </div>
  );
}
