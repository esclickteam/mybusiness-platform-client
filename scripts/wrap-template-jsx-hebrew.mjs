#!/usr/bin/env node
/**
 * Wrap Hebrew literals that render in template JSX so they go through tx().
 * Safe patterns only — never wraps module-level page-label arrays.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve("src/components/site-builder/studio/data/templates");
const TX_MODULE = path.resolve("src/i18n/localizeBuiltInTemplateSeed");

function importLine(filePath) {
  let rel = path.relative(path.dirname(filePath), TX_MODULE);
  if (!rel.startsWith(".")) rel = `./${rel}`;
  return `import { tx } from "${rel.replaceAll("\\", "/")}";`;
}

function wrapFile(filePath) {
  const original = fs.readFileSync(filePath, "utf8");
  let src = original;
  let changed = 0;

  src = src.replace(/\|\|\s*p\.label\b/g, (match, offset) => {
    const before = src.slice(Math.max(0, offset - 80), offset);
    if (before.includes("tx(")) return match;
    changed += 1;
    return "|| tx(p.label)";
  });

  src = src.replace(/\{(item|p|page)\.label\}/g, (full, name) => {
    if (full.includes("tx(")) return full;
    changed += 1;
    return `{tx(${name}.label)}`;
  });

  src = src.replace(/(?<!=)>([^<{]*[\u0590-\u05FF][^<{]*)</g, (full, text) => {
    if (text.includes("tx(") || text.includes("{") || text.includes("}") || text.includes("=")) {
      return full;
    }
    const trimmed = String(text).trim();
    if (!trimmed || trimmed.length > 240) return full;
    changed += 1;
    return `>{tx(${JSON.stringify(trimmed)})}<`;
  });

  src = src.replace(/\{(text|item|d)\}/g, (full, name, offset) => {
    const after = src[offset + full.length] || "";
    if (after === "." || after === "?" || after === ":") return full;
    const before = src.slice(Math.max(0, offset - 12), offset);
    if (before.includes("tx(")) return full;
    changed += 1;
    return `{tx(${name})}`;
  });

  src = src.replace(/פרק \{i\+1\}/g, () => {
    changed += 1;
    return `{tx("פרק")} {i+1}`;
  });

  src = src.replace(/מומחית \{i\+1\}/g, () => {
    changed += 1;
    return `{tx("מומחית")} {i+1}`;
  });

  src = src.replace(/משך משוער: \{minutes\}/g, () => {
    changed += 1;
    return `{tx("משך משוער")}: {tx(minutes)}`;
  });

  src = src.replace(/>(מפה) · \{/g, () => {
    changed += 1;
    return `>{tx("מפה")} · {`;
  });

  src = src.replace(
    /\{role\} · אבחון קשוב, תיעוד מסודר ותוצאה שמותאמת לפנים ולשגרה\./g,
    () => {
      changed += 1;
      return `{tx(role)} · {tx("אבחון קשוב, תיעוד מסודר ותוצאה שמותאמת לפנים ולשגרה.")}`;
    },
  );

  const wrapLiterals = [
    "45-75 דק׳",
    "60-90 דק׳",
    "30-60 דק׳",
    "15-30 דק׳",
    "קבלת פנים",
    "חדר טיפול",
    "פינת סיום",
    "נהלי חיטוי",
    "בחירת חבילה",
    "הכשרות מוצר",
    "בטיחות לקוחה",
    "בדיקת חומרים",
    "קביעת טיפול דגל",
    "עמדת ייעוץ שקטה עם תאורה רכה וכיבוד קטן.",
    "מיטה מחוממת, סטריליות מלאה ומוזיקה מותאמת.",
    "מראה גדולה, מוצרי המשך והנחיות כתובות.",
    "הוספת מערכת תורים ותיעוד דיגיטלי.",
    "הכשרות קבועות והתנסות בטכניקות חדשות.",
    "הנחיות בית ותיאום ביקורת לפי הצורך.",
    "הרחבת הצוות והכשרות מתקדמות.",
    "חלל חדש עם אזורי טיפול, המתנה ואבחון.",
    "כלים מחוטאים, עמדות נקיות וחומרים מאושרים בלבד.",
    "לא מתחילות טיפול לפני התאמת ציפיות ותיעוד מלא.",
    "לוח תורים מרווח כדי שלא תרגישו חלק מפס ייצור.",
    "מגדירות מטרה, רגישויות וסגנון אישי.",
    "מחיר, משך ותוצאה צפויה מוסברים מראש.",
    "מעקב אחרי הטיפול והמלצות המשך אמיתיות.",
    "ניקוי, התאמה ובדיקת נוחות לפני תחילת הטיפול.",
    "עבודה מדויקת בקצב רגוע עם חומרי פרימיום.",
    "פתיחת החדר הראשון וקבלת לקוחות קבועות.",
    "תעודה, רענון ויישום בפועל בצוות.",
    "שיחה",
    "הכנה",
    "ביצוע",
    "המשך",
    "דיוק",
    "היגיינה",
    "רוגע",
    "שקיפות",
    "למידה",
    "אחריות",
  ];
  for (const literal of wrapLiterals) {
    const needle = JSON.stringify(literal);
    const wrapped = `tx(${needle})`;
    src = src.replaceAll(needle, (match, offset) => {
      const before = src.slice(Math.max(0, offset - 4), offset);
      if (before.endsWith("tx(")) return match;
      changed += 1;
      return wrapped;
    });
  }

  src = src.replace(
    /(placeholder|aria-label|title|alt|label|text|data-visual-edit-label|data-bizuply-success-message)=(["'])([^"']*[\u0590-\u05FF][^"']*)\2/g,
    (full, attr, _quote, value) => {
      if (value.includes("tx(")) return full;
      changed += 1;
      return `${attr}={tx(${JSON.stringify(value)})}`;
    },
  );

  if (!changed) return 0;

  if (!src.includes("localizeBuiltInTemplateSeed")) {
    const firstImport = src.indexOf("import ");
    if (firstImport !== -1) {
      const insertAt = src.indexOf("\n", firstImport);
      src = `${src.slice(0, insertAt + 1)}${importLine(filePath)}\n${src.slice(insertAt + 1)}`;
    }
  }

  if (src !== original) {
    fs.writeFileSync(filePath, src);
    return changed;
  }
  return 0;
}

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (
      entry.name === "pages.tsx" ||
      entry.name === "preview.tsx" ||
      (dir.endsWith(`${path.sep}shared`) && entry.name.endsWith(".tsx"))
    ) {
      out.push(full);
    }
  }
  return out;
}

let files = 0;
let wraps = 0;
for (const file of walk(ROOT)) {
  const n = wrapFile(file);
  if (n) {
    files += 1;
    wraps += n;
    process.stdout.write(`${path.relative(process.cwd(), file)} (${n})\n`);
  }
}
process.stdout.write(`\nUpdated ${files} files, ${wraps} replacements.\n`);
