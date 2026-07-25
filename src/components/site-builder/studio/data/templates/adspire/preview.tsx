import React from "react";
import AdspirePages from "./pages";

export default function AdspirePreview() {
  return (
    <div dir="rtl" data-template-id="adspire-preview" className="min-h-screen w-full overflow-x-hidden">
      <AdspirePages initialPage="home" mode="preview" />
    </div>
  );
}
