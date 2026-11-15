import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api";
import { KNOWLEDGE_DRAFTS } from "../../lib/knowledgeDrafts.mjs";
import "./adminKnowledge.css";

const EMPTY = {
  locale: "he",
  slug: "",
  title: "",
  description: "",
  h1: "",
  lede: "",
  category: "",
  aiAssisted: false,
  sectionsText: "הגדרה\n\nכתבו כאן פסקה אחת.",
};

function sectionsToText(sections) {
  return (sections || []).map((section) => `${section.heading}\n\n${(section.paragraphs || []).join("\n\n")}`).join("\n\n---\n\n");
}

function textToSections(value) {
  return String(value || "")
    .split(/\n---\n/)
    .map((block) => {
      const [heading, ...rest] = block.trim().split(/\n\n+/);
      return { heading: (heading || "").trim(), paragraphs: rest.map((part) => part.trim()).filter(Boolean) };
    })
    .filter((section) => section.heading);
}

export default function AdminKnowledge() {
  const [articles, setArticles] = useState([]);
  const [draft, setDraft] = useState(EMPTY);
  const [current, setCurrent] = useState(null);
  const [audit, setAudit] = useState([]);
  const [revisions, setRevisions] = useState([]);
  const [confirmFacts, setConfirmFacts] = useState(false);
  const [redirectTo, setRedirectTo] = useState("/resources");
  const [message, setMessage] = useState("");
  const [previewSlug, setPreviewSlug] = useState(KNOWLEDGE_DRAFTS[0]?.slug || "");
  const [previewLocale, setPreviewLocale] = useState("he");

  async function reload() {
    const res = await API.get("/admin/knowledge/articles");
    setArticles(res.data.articles || []);
  }

  useEffect(() => {
    let active = true;
    API.get("/admin/knowledge/articles")
      .then((res) => {
        if (active) setArticles(res.data.articles || []);
      })
      .catch((error) => {
        if (active) setMessage(error?.response?.data?.error || error.message);
      });
    return () => {
      active = false;
    };
  }, []);

  function payload() {
    return {
      locale: draft.locale,
      slug: draft.slug,
      title: draft.title,
      description: draft.description,
      h1: draft.h1,
      lede: draft.lede,
      category: draft.category,
      aiAssisted: draft.aiAssisted,
      sections: textToSections(draft.sectionsText),
    };
  }

  async function openArticle(article) {
    setCurrent(article);
    setDraft({
      locale: article.locale,
      slug: article.slug,
      title: article.title,
      description: article.description,
      h1: article.h1,
      lede: article.lede,
      category: article.category || "",
      aiAssisted: Boolean(article.aiAssisted),
      sectionsText: sectionsToText(article.sections),
    });
    setConfirmFacts(false);
    const log = await API.get(`/admin/knowledge/articles/${article._id}/audit`);
    setAudit(log.data.entries || []);
    const history = await API.get(`/admin/knowledge/articles/${article._id}/revisions`);
    setRevisions(history.data.revisions || []);
  }

  async function restoreRevision(revisionId) {
    const res = await API.post(`/admin/knowledge/articles/${current._id}/restore`, { revisionId });
    await openArticle(res.data.article);
    await reload();
    setMessage("הגרסה שוחזרה לטיוטה. צריך לאשר אותה מחדש לפני פרסום.");
  }

  async function createArticle() {
    setMessage("");
    const res = await API.post("/admin/knowledge/articles", payload());
    await reload();
    await openArticle(res.data.article);
  }

  async function saveArticle() {
    setMessage("");
    const res = await API.put(`/admin/knowledge/articles/${current._id}`, payload());
    await reload();
    await openArticle(res.data.article);
  }

  async function move(status) {
    setMessage("");
    const res = await API.post(`/admin/knowledge/articles/${current._id}/transition`, {
      status,
      confirmFacts,
      redirectTo,
    });
    await reload();
    await openArticle(res.data.article);
  }

  return (
    <main className="admin-knowledge" dir="rtl">
      <header>
        <h1>ספריית הידע</h1>
        <p>טיוטה, בדיקה, אישור ופרסום. מאמר לא עולה לאתר בלי אישור עובדות. המדריכים שכבר באתר נשארים במקומם.</p>
        <p><Link to="/resources">למרכז הידע הציבורי</Link></p>
      </header>
      {message ? <p className="admin-knowledge__error">{message}</p> : null}
      <section className="admin-knowledge__drafts">
        <h2>טיוטות שממתינות לאישור</h2>
        <p>עשר הטיוטות האלה לא באתר, לא במפת האתר, ואין כאן כפתור פרסום. אישור עובדות נדרש לפני שמי מהן עוברת למערכת המאמרים.</p>
        <label>טיוטה
          <select value={previewSlug} onChange={(event) => setPreviewSlug(event.target.value)}>
            {KNOWLEDGE_DRAFTS.map((item) => <option key={item.slug} value={item.slug}>{item.locales.he.h1}</option>)}
          </select>
        </label>
        <label>שפת קריאה
          <select value={previewLocale} onChange={(event) => setPreviewLocale(event.target.value)}>
            <option value="he">עברית</option>
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="pt-BR">Português</option>
            <option value="ar">العربية</option>
          </select>
        </label>
        {(() => {
          const pack = KNOWLEDGE_DRAFTS.find((item) => item.slug === previewSlug);
          const copy = pack?.locales[previewLocale];
          if (!pack || !copy) return null;
          return (
            <article>
              <p>סטטוס: {pack.status}. נושא: {pack.cluster}.</p>
              <p>{pack.adds[previewLocale] || pack.adds.en}</p>
              <h3>{copy.h1}</h3>
              <p>{copy.lede}</p>
              {copy.sections.map((section) => (
                <section key={section.id}>
                  <h4>{section.heading}</h4>
                  {section.paragraphs.map((paragraph) => <p key={paragraph.slice(0, 48)}>{paragraph}</p>)}
                  {section.steps?.length ? <ol>{section.steps.map((step) => <li key={step}>{step}</li>)}</ol> : null}
                </section>
              ))}
            </article>
          );
        })()}
      </section>
      <div className="admin-knowledge__grid">
        <aside>
          <button type="button" onClick={() => { setCurrent(null); setDraft(EMPTY); setAudit([]); }}>מאמר חדש</button>
          <ul>
            {articles.map((article) => (
              <li key={article._id}>
                <button type="button" onClick={() => openArticle(article)}>
                  {article.h1 || article.slug} · {article.locale} · {article.status}
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <form onSubmit={(event) => event.preventDefault()}>
          <label>שפה
            <select value={draft.locale} onChange={(event) => setDraft({ ...draft, locale: event.target.value })}>
              <option value="he">עברית</option>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="pt-BR">Português</option>
              <option value="ar">العربية</option>
            </select>
          </label>
          <label>כתובת
            <input value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: event.target.value })} placeholder="what-is-a-pipeline" />
          </label>
          <label>כותרת העמוד
            <input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
          </label>
          <label>תיאור
            <textarea value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} />
          </label>
          <label>כותרת ראשית
            <input value={draft.h1} onChange={(event) => setDraft({ ...draft, h1: event.target.value })} />
          </label>
          <label>פתיח
            <textarea value={draft.lede} onChange={(event) => setDraft({ ...draft, lede: event.target.value })} />
          </label>
          <label>נושא
            <input value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} />
          </label>
          <label>תוכן. כל מקטע: כותרת, שורה ריקה, פסקאות. מפרידים מקטעים בשורה שמכילה רק ---
            <textarea rows={14} value={draft.sectionsText} onChange={(event) => setDraft({ ...draft, sectionsText: event.target.value })} />
          </label>
          <label className="admin-knowledge__check">
            <input type="checkbox" checked={draft.aiAssisted} onChange={(event) => setDraft({ ...draft, aiAssisted: event.target.checked })} />
            נכתב בסיוע אוטומטי ודורש בדיקת עובדות
          </label>
          {current ? <p>מצב: {current.status}. גרסה {current.version}.</p> : null}
          <div className="admin-knowledge__actions">
            {!current ? <button type="button" onClick={() => createArticle().catch((error) => setMessage(error?.response?.data?.error || error.message))}>יצירת טיוטה</button> : null}
            {current && current.status !== "published" ? <button type="button" onClick={() => saveArticle().catch((error) => setMessage(error?.response?.data?.error || error.message))}>שמירה</button> : null}
            {current?.status === "published" ? <p>המאמר מפורסם. כדי לערוך אותו יש להסיר את הפרסום קודם.</p> : null}
            {current?.status === "draft" ? <button type="button" onClick={() => move("in_review").catch((error) => setMessage(error?.response?.data?.error || error.message))}>להעביר לבדיקה</button> : null}
            {current?.status === "in_review" ? (
              <>
                <label className="admin-knowledge__check">
                  <input type="checkbox" checked={confirmFacts} onChange={(event) => setConfirmFacts(event.target.checked)} />
                  בדקתי את העובדות ואני מאשר
                </label>
                <button type="button" onClick={() => move("approved").catch((error) => setMessage(error?.response?.data?.error || error.message))}>אישור</button>
                <button type="button" onClick={() => move("draft").catch((error) => setMessage(error?.response?.data?.error || error.message))}>החזרה לטיוטה</button>
              </>
            ) : null}
            {current?.status === "approved" ? <button type="button" onClick={() => move("published").catch((error) => setMessage(error?.response?.data?.error || error.message))}>פרסום</button> : null}
            {current?.status === "published" ? (
              <>
                <label>לאן להפנות אחרי הסרה
                  <input value={redirectTo} onChange={(event) => setRedirectTo(event.target.value)} />
                </label>
                <button type="button" onClick={() => move("unpublished").catch((error) => setMessage(error?.response?.data?.error || error.message))}>הסרת פרסום</button>
              </>
            ) : null}
          </div>
          {current?.status === "published" ? <p>הכתובת הציבורית: /{current.locale === "en" ? "" : `${current.locale === "pt-BR" ? "pt-br" : current.locale}/`}resources/a/{current.slug}</p> : null}
          {revisions.length ? (
            <section>
              <h2>גרסאות</h2>
              <ul>
                {revisions.map((revision) => (
                  <li key={revision._id}>
                    גרסה {revision.version}
                    {current?.status === "published" ? null : (
                      <button type="button" onClick={() => restoreRevision(revision._id).catch((error) => setMessage(error?.response?.data?.error || error.message))}>שחזור לטיוטה</button>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {audit.length ? (
            <section>
              <h2>יומן שינויים</h2>
              <ul>{audit.map((entry) => <li key={entry._id}>{entry.action} · {entry.actorEmail || entry.actorUserId} · {entry.summary}</li>)}</ul>
            </section>
          ) : null}
        </form>
      </div>
    </main>
  );
}
