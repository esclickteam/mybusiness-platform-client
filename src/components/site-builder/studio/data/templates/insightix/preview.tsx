import React from "react";
import InsightixPages from "./pages";

export default function InsightixPreview() {
  return (
    <div dir="rtl" data-template-id="insightix" className="min-h-screen w-full overflow-x-hidden">
      <InsightixPages initialPage="home" mode="preview" />
    </div>
  );
}
