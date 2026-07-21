import { createRectTemplatePages } from "../shared/createRectTemplatePages";
import { vertexDefaultData } from "./defaultData";
import { vertexEditorCss } from "./editorCss";

export const vertexPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "work", label: "פרויקטים", slug: "/work" },
  { id: "insights", label: "תובנות", slug: "/insights" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
];

const theme = {
  bg: "#050505",
  surface: "#0d0d0d",
  text: "#f5f5f5",
  muted: "#9a9a9a",
  accent: "#00ff88",
  border: "#00ff8833",
  dark: "#000",
  light: "#f5f5f5",
};

export default createRectTemplatePages({
  id: "vertex",
  variant: "vertex",
  theme,
  pages: vertexPages,
  defaultData: vertexDefaultData,
  editorCss: vertexEditorCss,
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
});
