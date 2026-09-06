import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import EmberplatePages from "./pages";
export default function EmberplatePreview() {
  return (
    <div dir={templateDir()} data-template-id="emberplate" className="min-h-screen w-full" style={{ background: "#140c08", color: "#f6ebe0" }}>
      <EmberplatePages initialPage="home" mode="preview" />
    </div>
  );
}
