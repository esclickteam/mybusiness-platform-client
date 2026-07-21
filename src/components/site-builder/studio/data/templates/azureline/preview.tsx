import React from "react";
import AzurelinePages from "./pages";
export default function AzurelinePreview() {
  return (
    <div dir="rtl" data-template-id="azureline-preview" className="min-h-screen w-full" style={{ background: "#f8fcff", color: "#0a2540" }}>
      <AzurelinePages initialPage="home" mode="preview" />
    </div>
  );
}
