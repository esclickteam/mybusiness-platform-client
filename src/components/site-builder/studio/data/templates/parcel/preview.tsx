import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import ParcelPages from "./pages";

export default function ParcelPreview() {
  return (
    <div dir={templateDir()} data-template-id="parcel" className="min-h-screen w-full overflow-hidden" style={{ background: "#efe9da", color: "#243018" }}>
      <ParcelPages initialPage="home" mode="preview" />
    </div>
  );
}
