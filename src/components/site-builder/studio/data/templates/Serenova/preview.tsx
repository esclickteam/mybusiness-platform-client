import React from "react";
import SerenovaPages from "./pages";

/** Legacy gallery fallback — same renderer as editor / public / template preview. */
export default function SerenovaPreview() {
  return <SerenovaPages initialPage="home" mode="preview" />;
}
