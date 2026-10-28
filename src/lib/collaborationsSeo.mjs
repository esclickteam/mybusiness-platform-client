import { getCollaborationsCopy } from "../pages/product/collaborations/runtime.js";

function escapeText(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function cards(items) {
  return (items || []).map((item) => `<h3>${escapeText(item.title)}</h3><p>${escapeText(item.text)}</p>`).join("");
}

export function collaborationsPrerender(locale) {
  const copy = getCollaborationsCopy(locale);
  const lang = ["he", "es", "pt-BR", "ar"].includes(locale) ? locale : "en";
  const dir = lang === "he" || lang === "ar" ? "rtl" : "ltr";
  const questions = copy.choose.questions.map((question) => `<li>${escapeText(question)}</li>`).join("");
  const rows = copy.compare.rows.map((row) => `<tr><th scope="row">${escapeText(row.tool)}</th><td>${escapeText(row.purpose)}</td></tr>`).join("");
  const faqs = copy.faq.items.map((item) => `<h3>${escapeText(item.q)}</h3><p>${escapeText(item.a)}</p>`).join("");
  const listings = copy.listings.map((listing) => `<h3>${escapeText(listing.title)}</h3><p>${escapeText(listing.business)}. ${escapeText(listing.description)}</p>`).join("");
  const inner = `<main lang="${lang}" dir="${dir}"><h1>${escapeText(copy.hero.title)}</h1><p>${escapeText(copy.hero.description)}</p><h2>${escapeText(copy.what.title)}</h2>${copy.what.paragraphs.map((paragraph) => `<p>${escapeText(paragraph)}</p>`).join("")}${cards(copy.what.cards)}<h2>${escapeText(copy.find.title)}</h2><p>${escapeText(copy.find.lead)}</p>${cards(copy.find.examples)}<h2>${escapeText(copy.market.title)}</h2><p>${escapeText(copy.market.lead)}</p>${cards(copy.market.types)}${listings}<p>${escapeText(copy.market.note)}</p><h2>${escapeText(copy.proposals.title)}</h2><p>${escapeText(copy.proposals.lead)}</p>${cards(copy.proposals.cards)}<h3>${escapeText(copy.proposals.sampleTitle)}</h3><p>${escapeText(copy.proposals.description)}</p><p>${escapeText(copy.proposals.statusNote)}</p><h2>${escapeText(copy.chat.title)}</h2><p>${escapeText(copy.chat.lead)}</p>${cards(copy.chat.uses)}<h2>${escapeText(copy.start.title)}</h2>${copy.start.steps.map((step) => `<h3>${escapeText(step.title)}</h3><p>${escapeText(step.text)}</p>`).join("")}<p>${escapeText(copy.start.note)}</p><h2>${escapeText(copy.models.title)}</h2>${cards(copy.models.items)}<p>${escapeText(copy.models.note)}</p><h2>${escapeText(copy.small.title)}</h2><p>${escapeText(copy.small.lead)}</p>${cards(copy.small.benefits)}<h2>${escapeText(copy.compare.title)}</h2><p>${escapeText(copy.compare.lead)}</p><table><thead><tr><th>${escapeText(copy.compare.tool)}</th><th>${escapeText(copy.compare.purpose)}</th></tr></thead><tbody>${rows}</tbody></table><p>${escapeText(copy.compare.note)}</p><h2>${escapeText(copy.platform.title)}</h2><p>${escapeText(copy.platform.lead)}</p>${cards(copy.platform.items)}<h2>${escapeText(copy.choose.title)}</h2><p>${escapeText(copy.choose.lead)}</p>${cards(copy.choose.criteria)}<h3>${escapeText(copy.choose.questionsTitle)}</h3><ol>${questions}</ol><h2>${escapeText(copy.faq.title)}</h2>${faqs}<h2>${escapeText(copy.cta.title)}</h2><p>${escapeText(copy.cta.text)}</p></main>`;
  return { lang, dir, inner };
}

export function collaborationsSchemas(locale, canonical) {
  const copy = getCollaborationsCopy(locale);
  const lang = ["he", "es", "pt-BR", "ar"].includes(locale) ? locale : "en";
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: copy.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
  const software = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Bizuply",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: canonical,
    description: copy.seo.description,
    inLanguage: lang,
  };
  return [faq, software];
}
