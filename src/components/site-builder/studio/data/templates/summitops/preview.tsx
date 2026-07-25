import React from "react";
import SummitopsPages from "./pages";

export default function SummitopsPreview() {
  return (
    <div dir="rtl" data-template-id="summitops-preview" className="min-h-screen w-full overflow-x-hidden">
      <SummitopsPages initialPage="home" mode="preview" />
    </div>
  );
}
