import React from "react";
import InfluencixPages from "./pages";

export default function InfluencixPreview() {
  return (
    <div dir="rtl" data-template-id="influencix" className="min-h-screen w-full overflow-x-hidden">
      <InfluencixPages initialPage="home" mode="preview" />
    </div>
  );
}
