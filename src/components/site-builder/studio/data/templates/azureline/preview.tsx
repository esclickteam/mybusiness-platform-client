import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import AzurelinePages from "./pages";
export default function AzurelinePreview() {
  return (
    <div dir={templateDir()} data-template-id="azureline" className="min-h-screen w-full" style={{ background: "#f8fcff", color: "#0a2540" }}>
      <AzurelinePages initialPage="home" mode="preview" />
    </div>
  );
}
