import { createRectTemplatePages } from "../shared/createRectTemplatePages";
import { monolithDefaultData } from "./defaultData";
import { monolithEditorCss } from "./editorCss";

export const monolithPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "work", label: "פרויקטים", slug: "/work" },
  { id: "insights", label: "תובנות", slug: "/insights" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
];

const theme = {
  bg: "#eef0f4",
  surface: "#ffffff",
  text: "#0c1a33",
  muted: "#5a6478",
  accent: "#c8a96a",
  border: "#0c1a3322",
  dark: "#0c1a33",
  light: "#f6f5f1",
};

export default createRectTemplatePages({
  id: "monolith",
  variant: "monolith",
  theme,
  pages: monolithPages,
  defaultData: monolithDefaultData,
  editorCss: monolithEditorCss,
  fontFamily: "Georgia, \"Times New Roman\", serif",
});
