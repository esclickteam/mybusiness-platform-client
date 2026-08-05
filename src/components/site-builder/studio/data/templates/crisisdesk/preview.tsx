import React from "react";
import CrisisdeskPages from "./pages";

export default function CrisisdeskPreview() {
  return (
    <div dir="rtl" data-template-id="crisisdesk" className="min-h-screen w-full overflow-x-hidden">
      <CrisisdeskPages initialPage="home" mode="preview" />
    </div>
  );
}
