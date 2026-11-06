const LABELS = {
  brand: "מותג",
  engine: "מנוע",
  question: "שאלה",
  outcome: "תוצאת המדידה",
  source: "מקור תומך",
  competitors: "מתחרים שהופיעו",
  gap: "סיבת הפער",
  target: "עמוד יעד מוצע",
  action: "המלצת פעולה",
  impact: "השפעה צפויה",
  confidence: "רמת ביטחון",
  priority: "עדיפות",
  status: "סטטוס ביצוע",
  tracking: "מעקב",
  noGap: "אין ראיה שמספיקה לקבוע סיבה לפער.",
  noCompetitors: "לא זוהו מתחרים במדידה.",
  noQuestion: "אין שאלה אחת. המשימה מצרפת כמה מדידות.",
  noSource: "לא נשמר מקור תומך במדידה זו.",
};

const STATUS = [
  ["todo", "לביצוע"],
  ["in_progress", "בתהליך"],
  ["done", "הושלם"],
  ["dismissed", "נדחה"],
];

const state = { plans: [], brand: 0, filter: "all", canRun: false, notes: {} };

function text(parent, tag, value, className) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  el.textContent = value == null ? "" : String(value);
  parent.appendChild(el);
  return el;
}

function when(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("he-IL", { timeZone: "Asia/Jerusalem" });
}

function hrefOf(url) {
  return /^https:\/\//i.test(String(url || "")) ? String(url) : "";
}

function render() {
  const plan = state.plans[state.brand];
  const brands = document.getElementById("brands");
  brands.replaceChildren();
  state.plans.forEach((item, index) => {
    const button = text(brands, "button", item.name);
    button.type = "button";
    if (index === state.brand) button.className = "active";
    button.addEventListener("click", () => {
      state.brand = index;
      state.filter = "all";
      render();
    });
  });

  document.getElementById("disclaimer").textContent = plan.disclaimerHe || "";
  document.getElementById("counts").textContent =
    `${plan.sampleSize} מדידות שמורות · ${plan.taskCount} משימות עבודה`;
  document.getElementById("locked").hidden = state.canRun;
  document.getElementById("run").hidden = !state.canRun;
  document.getElementById("trial").hidden = !state.canRun;
  document.getElementById("toggle").textContent = state.canRun
    ? "תצוגת הרשאת הרצה"
    : "תצוגת חשבון בלי הרשאת הרצה";

  const filters = document.getElementById("filters");
  filters.replaceChildren();
  [["all", "הכל"], ...STATUS].forEach(([id, label]) => {
    const button = text(filters, "button", label);
    button.type = "button";
    if (state.filter === id) button.className = "active";
    button.addEventListener("click", () => {
      state.filter = id;
      render();
    });
  });

  const host = document.getElementById("tasks");
  host.replaceChildren();
  const visible = plan.tasks.filter((task) =>
    state.filter === "all" ? true : (task.status || "todo") === state.filter
  );
  if (!visible.length) {
    text(host, "p", "אין משימות בסינון הזה.", "muted");
    return;
  }
  visible.forEach((task) => host.appendChild(card(task, plan.name)));
}

function card(task, brandName) {
  const work = task.work || {};
  const article = document.createElement("article");
  const head = document.createElement("div");
  head.className = "head";
  const titleBox = document.createElement("div");
  text(titleBox, "strong", task.titleHe || "");
  const meta = document.createElement("div");
  meta.className = "meta";
  const prov = text(meta, "span", work.provenanceHe || "");
  prov.className = task.provenance === "proven" ? "proven" : "hypothesis";
  text(meta, "span", `${LABELS.impact}: ${work.impactHe || "—"}`);
  text(meta, "span", `${LABELS.confidence}: ${work.confidenceHe || "—"}`);
  text(meta, "span", `${LABELS.priority}: ${work.priorityScore ?? "—"}`);
  titleBox.appendChild(meta);
  head.appendChild(titleBox);

  const statusLabel = document.createElement("label");
  text(statusLabel, "span", LABELS.status);
  const select = document.createElement("select");
  select.setAttribute("aria-label", LABELS.status);
  STATUS.forEach(([id, label]) => {
    const option = text(select, "option", label);
    option.value = id;
  });
  select.value = task.status || "todo";
  select.addEventListener("change", () => {
    task.status = select.value;
    render();
  });
  statusLabel.appendChild(select);
  head.appendChild(statusLabel);
  article.appendChild(head);

  const dl = document.createElement("dl");
  row(dl, LABELS.brand, work.brandName || brandName);
  row(dl, LABELS.engine, work.engine || "—");
  row(dl, LABELS.question, work.question || LABELS.noQuestion);
  const outcome = [work.outcomeHe || "—", when(work.checkedAt)].filter(Boolean).join(" · ");
  row(dl, LABELS.outcome, outcome);
  sourceRow(dl, work.sources || []);
  row(
    dl,
    LABELS.competitors,
    (work.competitors || []).length ? work.competitors.join(", ") : LABELS.noCompetitors
  );
  row(dl, LABELS.gap, work.gapReasonHe || LABELS.noGap);
  const target = document.createElement("div");
  text(target, "dt", LABELS.target);
  const dd = document.createElement("dd");
  if (work.targetPath) {
    const code = text(dd, "code", work.targetPath);
    code.dir = "ltr";
    dd.appendChild(document.createTextNode(" "));
  }
  dd.appendChild(document.createTextNode(work.targetNoteHe || LABELS.noGap));
  target.appendChild(dd);
  dl.appendChild(target);
  row(dl, LABELS.action, work.actionHe || "");
  article.appendChild(dl);

  if (work.priorityNoteHe) text(article, "p", work.priorityNoteHe, "muted");

  const noteLabel = document.createElement("label");
  text(noteLabel, "span", LABELS.tracking);
  const note = document.createElement("textarea");
  note.rows = 2;
  note.value = state.notes[task.taskKey] ?? task.noteHe ?? "";
  note.addEventListener("input", () => {
    state.notes[task.taskKey] = note.value;
  });
  noteLabel.appendChild(note);
  article.appendChild(noteLabel);
  text(article, "p", "שינוי באתר המותג דורש אישור. הוא לא מבוצע מכאן.", "approval");
  return article;
}

function row(dl, label, value) {
  const wrap = document.createElement("div");
  text(wrap, "dt", label);
  const dd = text(wrap, "dd", value);
  dd.dir = "auto";
  dl.appendChild(wrap);
}

function sourceRow(dl, sources) {
  const wrap = document.createElement("div");
  text(wrap, "dt", LABELS.source);
  const dd = document.createElement("dd");
  if (!sources.length) {
    dd.textContent = LABELS.noSource;
  } else {
    const list = document.createElement("ul");
    sources.slice(0, 4).forEach((source) => {
      const item = document.createElement("li");
      const href = hrefOf(source.url);
      const label = source.title || source.domain || "מקור";
      if (href) {
        const link = document.createElement("a");
        link.href = href;
        link.target = "_blank";
        link.rel = "noreferrer";
        link.textContent = label;
        item.appendChild(link);
      } else {
        item.textContent = label;
      }
      if (source.domain) item.appendChild(document.createTextNode(` · ${source.domain}`));
      list.appendChild(item);
    });
    dd.appendChild(list);
  }
  wrap.appendChild(dd);
  dl.appendChild(wrap);
}

document.getElementById("toggle").addEventListener("click", () => {
  state.canRun = !state.canRun;
  render();
});

fetch("./data.json")
  .then((res) => {
    if (!res.ok) throw new Error("טעינת המדידות נכשלה");
    return res.json();
  })
  .then((data) => {
    state.plans = data.plans || [];
    if (!state.plans.length) throw new Error("אין מותגים בתצוגה");
    render();
  })
  .catch((err) => {
    document.getElementById("tasks").textContent = err.message || "טעינה נכשלה";
  });
