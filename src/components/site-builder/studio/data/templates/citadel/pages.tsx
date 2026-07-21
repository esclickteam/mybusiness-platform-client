import { createRectTemplatePages } from "../shared/createRectTemplatePages";
import { citadelDefaultData } from "./defaultData";
import { citadelEditorCss } from "./editorCss";

export const citadelPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "work", label: "פרויקטים", slug: "/work" },
  { id: "insights", label: "תובנות", slug: "/insights" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
];

const theme = {
  bg: "#030a06",
  surface: "#071510",
  text: "#d7ffd9",
  muted: "#7fad85",
  accent: "#39ff14",
  border: "#39ff1422",
  dark: "#010503",
  light: "#d7ffd9",
};

export default createRectTemplatePages({
  id: "citadel",
  variant: "citadel",
  theme,
  pages: citadelPages,
  defaultData: citadelDefaultData,
  editorCss: citadelEditorCss,
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
});
