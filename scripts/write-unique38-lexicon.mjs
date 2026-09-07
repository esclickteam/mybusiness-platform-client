/**
 * unique38 — leftover built-in preview headlines after unique37.
 * Skip personal names, streets, cities, Admin/Staff, hybrids, and smash-hazard singles.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const r = (en, es, pt, ar) => ({ en, es, "pt-BR": pt, ar });

const rows = {
  "מומחה סושיאל\nשבונה נוכחות\nשמוכרת בשבילך": r(
    "A social expert\nwho builds a presence\nthat sells for you",
    "Un experto en social\nque construye una presencia\nque vende por ti",
    "Um especialista em social\nque constrói uma presença\nque vende por você",
    "خبير سوشيال\nيبني حضوراً\nيبيع من أجلكم",
  ),
  "מומחה סושיאל": r(
    "A social expert",
    "Un experto en social",
    "Um especialista em social",
    "خبير سوشيال",
  ),
  "שבונה נוכחות": r(
    "who builds a presence",
    "que construye una presencia",
    "que constrói uma presença",
    "يبني حضوراً",
  ),
  "שמוכרת בשבילך": r(
    "that sells for you",
    "que vende por ti",
    "que vende por você",
    "يبيع من أجلكم",
  ),
  "לא מעלים פוסטים.\nבונים ביקוש.\nמייצרים פניות.": r(
    "We don't just post.\nWe build demand.\nWe generate inquiries.",
    "No solo publicamos.\nConstruimos demanda.\nGeneramos consultas.",
    "Não apenas postamos.\nConstruímos demanda.\nGeramos consultas.",
    "لا نكتفي بالنشر.\nنبني الطلب.\nنولّد الاستفسارات.",
  ),
  "לא מעלים פוסטים.": r(
    "We don't just post.",
    "No solo publicamos.",
    "Não apenas postamos.",
    "لا نكتفي بالنشر.",
  ),
  "בונים ביקוש.": r(
    "We build demand.",
    "Construimos demanda.",
    "Construímos demanda.",
    "نبني الطلب.",
  ),
  "מייצרים פניות.": r(
    "We generate inquiries.",
    "Generamos consultas.",
    "Geramos consultas.",
    "نولّد الاستفسارات.",
  ),
  "אסטרטגיה · תוכן · קמפיינים · צמיחה דיגיטלית": r(
    "Strategy · content · campaigns · digital growth",
    "Estrategia · contenido · campañas · crecimiento digital",
    "Estratégia · conteúdo · campanhas · crescimento digital",
    "استراتيجية · محتوى · حملات · نمو رقمي",
  ),
  "בניית מותג דיגיטלי, תוכן שמייצר אמון וקמפיינים שמביאים לידים,\nלקוחות ותוצאות מדידות.": r(
    "Building a digital brand, trust-making content, and campaigns that bring leads,\ncustomers, and measurable results.",
    "Construimos una marca digital, contenido que genera confianza y campañas que traen leads,\nclientes y resultados medibles.",
    "Construímos uma marca digital, conteúdo que gera confiança e campanhas que trazem leads,\nclientes e resultados mensuráveis.",
    "نبني علامة رقمية ومحتوى يبني الثقة وحملات تجلب العملاء المحتملين،\nوالعملاء والنتائج القابلة للقياس.",
  ),
  "בניית מותג דיגיטלי, תוכן שמייצר אמון וקמפיינים שמביאים לידים,\n          לקוחות ותוצאות מדידות.": r(
    "Building a digital brand, trust-making content, and campaigns that bring leads,\ncustomers, and measurable results.",
    "Construimos una marca digital, contenido que genera confianza y campañas que traen leads,\nclientes y resultados medibles.",
    "Construímos uma marca digital, conteúdo que gera confiança e campanhas que trazem leads,\nclientes e resultados mensuráveis.",
    "نبني علامة رقمية ومحتوى يبني الثقة وحملات تجلب العملاء المحتملين،\nوالعملاء والنتائج القابلة للقياس.",
  ),
  "לקוחות ותוצאות מדידות.": r(
    "customers and measurable results.",
    "clientes y resultados medibles.",
    "clientes e resultados mensuráveis.",
    "عملاء ونتائج قابلة للقياس.",
  ),
};

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../src/i18n/templateExactLexicon.unique38.json",
);
writeFileSync(out, JSON.stringify(rows, null, 2) + "\n");
console.log(`wrote ${Object.keys(rows).length} unique38 rows`);
