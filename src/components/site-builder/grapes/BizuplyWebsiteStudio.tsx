import React, { useEffect, useMemo, useRef, useState } from "react";
import grapesjs, { Editor } from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";

import { registerBizuplyBlocks } from "./grapesBlocks";
import { bizuplyCanvasCss, defaultBizuplyHtml } from "./grapesTheme";
import type { BizuplySitePayload, BizuplyWebsiteStudioProps } from "./types";

type LeftPanel =
  | "templates"
  | "elements"
  | "smartBlocks"
  | "pages"
  | "media"
  | "commerce"
  | "services"
  | "booking"
  | "club"
  | "leads"
  | "seo"
  | "settings";

type RightPanel = "design" | "settings";

type DeviceType = "Desktop" | "Tablet" | "Mobile";

type StudioTemplate = {
  id: string;
  name: string;
  description: string;
  preview: string;
  html: string;
};

const studioTemplates: StudioTemplate[] = [
  {
    id: "luxury-beauty",
    name: "יוקרתי",
    description: "אתר יוקרתי לעסקי יופי, קליניקות וסטודיו",
    preview:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=700&q=90",
    html: defaultBizuplyHtml,
  },
  {
    id: "modern-beauty",
    name: "מודרני",
    description: "מבנה מודרני, נקי ומכירתי",
    preview:
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=700&q=90",
    html: `
<div class="biz-page">
  <header class="biz-nav">
    <div class="biz-brand">
      <div class="biz-logo">B</div>
      <div>
        <p class="biz-brand-title">הדר עשת ביוטי</p>
        <p class="biz-brand-subtitle">איפור קבוע וטיפולי יופי</p>
      </div>
    </div>

    <nav class="biz-nav-links">
      <a>דף הבית</a>
      <a>אודות</a>
      <a>שירותים</a>
      <a>גלריה</a>
      <a>צור קשר</a>
    </nav>
  </header>

  <section class="biz-section-full">
    <div class="biz-hero-card" style="text-align:center;">
      <div class="biz-pill">סטודיו מקצועי · אתר חכם</div>
      <h1 class="biz-title">יופי שמרגיש לך טבעי</h1>
      <p class="biz-subtitle" style="margin-left:auto;margin-right:auto;">
        איפור קבוע, טיפולי פנים ושירותי יופי בהתאמה אישית.
      </p>
      <div class="biz-actions" style="justify-content:center;">
        <a class="biz-btn biz-btn-primary">קביעת תור</a>
        <a class="biz-btn biz-btn-secondary">שליחת הודעה</a>
      </div>
    </div>
  </section>

  <section class="biz-section">
    <h2 class="biz-section-title">השירותים שלי</h2>
    <div class="biz-grid-3">
      <article class="biz-card">
        <div class="biz-card-icon">✦</div>
        <h3 class="biz-card-title">איפור קבוע</h3>
        <p class="biz-card-text">תוצאה טבעית, מדויקת ואלגנטית.</p>
      </article>
      <article class="biz-card">
        <div class="biz-card-icon">✦</div>
        <h3 class="biz-card-title">טיפולי פנים</h3>
        <p class="biz-card-text">טיפולים מתקדמים לעור בריא וזוהר.</p>
      </article>
      <article class="biz-card">
        <div class="biz-card-icon">✦</div>
        <h3 class="biz-card-title">ייעוץ אישי</h3>
        <p class="biz-card-text">התאמה אישית לפי מבנה הפנים והעור.</p>
      </article>
    </div>
  </section>
</div>
`,
  },
  {
    id: "minimal-premium",
    name: "מינימליסטי",
    description: "עיצוב שקט, נקי ואלגנטי",
    preview:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=700&q=90",
    html: `
<div class="biz-page">
  <section class="biz-section" style="min-height:720px;display:flex;align-items:center;justify-content:center;text-align:center;">
    <div>
      <div class="biz-pill">עסק מקצועי · נוכחות דיגיטלית</div>
      <h1 class="biz-title">הדר עשת ביוטי</h1>
      <p class="biz-subtitle" style="margin-left:auto;margin-right:auto;">
        אתר עסקי אלגנטי עם שירותים, גלריה, תיאום תורים ולידים.
      </p>
      <div class="biz-actions" style="justify-content:center;">
        <a class="biz-btn biz-btn-primary">קביעת תור</a>
        <a class="biz-btn biz-btn-secondary">צור קשר</a>
      </div>
    </div>
  </section>
</div>
`,
  },
];

const leftNav: { key: LeftPanel; label: string; icon: string }[] = [
  { key: "templates", label: "תבניות", icon: "▦" },
  { key: "elements", label: "הוספת אלמנטים", icon: "+" },
  { key: "smartBlocks", label: "בלוקים חכמים", icon: "✦" },
  { key: "pages", label: "דפים", icon: "▤" },
  { key: "media", label: "מדיה", icon: "▧" },
  { key: "commerce", label: "מוצרים וסליקה", icon: "◈" },
  { key: "services", label: "שירותים", icon: "◇" },
  { key: "booking", label: "תיאום תורים", icon: "◷" },
  { key: "club", label: "מועדון לקוחות", icon: "♛" },
  { key: "leads", label: "טפסים ולידים", icon: "✉" },
  { key: "seo", label: "SEO", icon: "⌕" },
  { key: "settings", label: "הגדרות", icon: "⚙" },
];

const quickBlocks = [
  { label: "הירו", icon: "▣", blockId: "biz-hero-luxury" },
  { label: "אודות", icon: "◌", blockId: "biz-about" },
  { label: "שירותים", icon: "✦", blockId: "biz-services" },
  { label: "גלריה", icon: "▧", blockId: "biz-gallery" },
  { label: "ביקורות", icon: "★", blockId: "biz-reviews" },
  { label: "יצירת קשר", icon: "☎", blockId: "biz-contact" },
  { label: "טופס ליד", icon: "▤", blockId: "biz-lead-form" },
  { label: "מוצרים", icon: "◈", blockId: "biz-products" },
  { label: "תיאום תורים", icon: "◷", blockId: "biz-booking" },
  { label: "מועדון לקוחות", icon: "♛", blockId: "biz-club" },
];

export default function BizuplyWebsiteStudio({
  businessId,
  initialSlug = "hadar-beauty",
  onSave,
}: BizuplyWebsiteStudioProps) {
  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const blocksRef = useRef<HTMLDivElement | null>(null);
  const layersRef = useRef<HTMLDivElement | null>(null);
  const stylesRef = useRef<HTMLDivElement | null>(null);
  const traitsRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<Editor | null>(null);

  const [leftPanel, setLeftPanel] = useState<LeftPanel>("templates");
  const [rightPanel, setRightPanel] = useState<RightPanel>("design");
  const [device, setDevice] = useState<DeviceType>("Desktop");
  const [slug, setSlug] = useState(initialSlug);
  const [savedAt, setSavedAt] = useState("");
  const [ready, setReady] = useState(false);

  const publicUrl = useMemo(() => {
    const clean = slug.trim() || "your-business";
    return `https://${clean}.bizuply.com`;
  }, [slug]);

  const slugValid = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);

  useEffect(() => {
    if (!editorContainerRef.current || editorRef.current) return;

    const editor = grapesjs.init({
      container: editorContainerRef.current,
      height: "100%",
      width: "100%",
      fromElement: false,
      storageManager: false,

      panels: {
        defaults: [],
      },

      selectorManager: {
        componentFirst: true,
      },

      blockManager: {
        appendTo: blocksRef.current || undefined,
      },

      layerManager: {
        appendTo: layersRef.current || undefined,
      },

      traitManager: {
        appendTo: traitsRef.current || undefined,
      },

      styleManager: {
        appendTo: stylesRef.current || undefined,
        sectors: [
          {
            name: "צבעים",
            open: true,
            properties: [
              "color",
              "background-color",
              "background",
              "background-image",
              "opacity",
            ],
          },
          {
            name: "טיפוגרפיה",
            open: true,
            properties: [
              "font-family",
              "font-size",
              "font-weight",
              "letter-spacing",
              "line-height",
              "text-align",
              "text-decoration",
            ],
          },
          {
            name: "גודל ומיקום",
            open: true,
            properties: [
              "display",
              "position",
              "top",
              "right",
              "bottom",
              "left",
              "width",
              "height",
              "min-height",
              "max-width",
              "z-index",
            ],
          },
          {
            name: "מרווחים",
            open: true,
            properties: ["margin", "padding"],
          },
          {
            name: "פינות, גבול וצל",
            open: true,
            properties: ["border-radius", "border", "box-shadow"],
          },
          {
            name: "אפקטים",
            open: false,
            properties: ["transform", "transition", "filter", "backdrop-filter"],
          },
        ],
      },

      assetManager: {
        upload: false,
        assets: [
          {
            src: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1400&q=90",
            name: "Beauty hero",
          },
          {
            src: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=90",
            name: "Beauty gallery",
          },
          {
            src: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=700&q=90",
            name: "Spa",
          },
        ],
      },

      deviceManager: {
        devices: [
          {
            name: "Desktop",
            width: "",
          },
          {
            name: "Tablet",
            width: "768px",
            widthMedia: "992px",
          },
          {
            name: "Mobile",
            width: "390px",
            widthMedia: "480px",
          },
        ],
      },

      i18n: {
        locale: "he",
        localeFallback: "he",
        messages: {
          he: {
            styleManager: {
              empty: "בחרי אלמנט כדי לערוך עיצוב",
            },
            traitManager: {
              empty: "בחרי אלמנט כדי לערוך הגדרות",
            },
            assetManager: {
              addButton: "הוספת תמונה",
              inputPlh: "כתובת תמונה",
              modalTitle: "ניהול מדיה",
              uploadTitle: "גררי תמונות לכאן",
            },
          },
        },
      },
    });

    editorRef.current = editor;

    editor.on("load", () => {
      registerBizuplyBlocks(editor);

      editor.setComponents(defaultBizuplyHtml);
      editor.setStyle(bizuplyCanvasCss);

      injectGrapesUiPolish(editor);

      setReady(true);
    });

    return () => {
      editor.destroy();
      editorRef.current = null;
    };
  }, []);

  const runEditor = (callback: (editor: Editor) => void) => {
    if (!editorRef.current) return;
    callback(editorRef.current);
  };

  const changeDevice = (nextDevice: DeviceType) => {
    setDevice(nextDevice);
    runEditor((editor) => editor.setDevice(nextDevice));
  };

  const applyTemplate = (template: StudioTemplate) => {
    runEditor((editor) => {
      editor.setComponents(template.html);
      editor.setStyle(bizuplyCanvasCss);
    });
  };

  const addBlockToCanvas = (blockId: string) => {
    runEditor((editor) => {
      const block = editor.BlockManager.get(blockId);
      if (!block) return;

      const content = block.get("content");
      editor.addComponents(content);
    });
  };

  const handleSave = async (published: boolean) => {
    if (!slugValid || !editorRef.current) return;

    const editor = editorRef.current;

    const payload: BizuplySitePayload = {
      slug,
      projectData: editor.getProjectData(),
      html: editor.getHtml(),
      css: editor.getCss(),
      published,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      `bizuply-mini-site-${businessId || "demo"}`,
      JSON.stringify(payload)
    );

    await onSave?.(payload);

    setSavedAt(
      new Date().toLocaleTimeString("he-IL", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );

    console.log("BIZUPLY WEBSITE SAVED:", payload);
  };

  const handlePreview = () => {
    runEditor((editor) => editor.runCommand("preview"));
  };

  const handleOpenAssets = () => {
    runEditor((editor) => editor.runCommand("open-assets"));
  };

  const handleUndo = () => {
    runEditor((editor) => editor.UndoManager.undo());
  };

  const handleRedo = () => {
    runEditor((editor) => editor.UndoManager.redo());
  };

  const handleClear = () => {
    const ok = window.confirm("למחוק את כל העיצוב הנוכחי?");
    if (!ok) return;

    runEditor((editor) => {
      editor.setComponents(defaultBizuplyHtml);
      editor.setStyle(bizuplyCanvasCss);
    });
  };

  return (
    <div
      dir="rtl"
      className="h-screen w-full overflow-hidden bg-[#f6f4ff] text-slate-800"
    >
      <style>{studioPolishCss}</style>

      <div className="flex h-screen flex-col">
        <header className="z-50 flex h-[72px] shrink-0 items-center justify-between border-b border-slate-200/70 bg-white/90 px-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur-2xl">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 text-base font-black text-white shadow-xl shadow-violet-200">
              B
            </div>

            <div>
              <p className="text-base font-black leading-none text-slate-800">
                Bizuply Website Studio
              </p>
              <p className="mt-1 text-xs font-bold leading-none text-slate-400">
                עורך אתר מקצועי בלי קוד
              </p>
            </div>
          </div>

          <div className="flex min-w-[420px] items-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50" dir="ltr">
            <span className="px-3 text-xs font-black text-slate-400">URL</span>
            <input
              value={slug}
              onChange={(event) =>
                setSlug(event.target.value.toLowerCase().trim())
              }
              className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm font-black text-slate-800 outline-none"
              dir="ltr"
              placeholder="hadar-beauty"
            />
            <span className="border-l border-slate-200 bg-white px-3 py-3 text-sm font-black text-slate-500">
              .bizuply.com
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ToolbarButton onClick={handleUndo}>ביטול</ToolbarButton>
            <ToolbarButton onClick={handleRedo}>בצע שוב</ToolbarButton>

            <div className="mx-1 h-8 w-px bg-slate-200" />

            <DeviceButton
              active={device === "Desktop"}
              onClick={() => changeDevice("Desktop")}
            >
              דסקטופ
            </DeviceButton>
            <DeviceButton
              active={device === "Tablet"}
              onClick={() => changeDevice("Tablet")}
            >
              טאבלט
            </DeviceButton>
            <DeviceButton
              active={device === "Mobile"}
              onClick={() => changeDevice("Mobile")}
            >
              מובייל
            </DeviceButton>

            <div className="mx-1 h-8 w-px bg-slate-200" />

            <ToolbarButton onClick={handleOpenAssets}>מדיה</ToolbarButton>
            <ToolbarButton onClick={handlePreview}>תצוגה מקדימה</ToolbarButton>
            <ToolbarButton onClick={handleClear}>איפוס</ToolbarButton>

            <button
              type="button"
              className="rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-xs font-black text-violet-700 transition hover:bg-violet-100"
            >
              AI לבניית אתר ✨
            </button>

            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={!ready || !slugValid}
              className="rounded-2xl border border-violet-200 bg-white px-4 py-3 text-xs font-black text-violet-700 shadow-sm transition hover:bg-violet-50 disabled:opacity-40"
            >
              שמירה כטיוטה
            </button>

            <button
              type="button"
              onClick={() => handleSave(true)}
              disabled={!ready || !slugValid}
              className="rounded-2xl bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 px-5 py-3 text-xs font-black text-white shadow-xl shadow-violet-200 transition hover:-translate-y-0.5 disabled:opacity-40"
            >
              פרסום 🚀
            </button>
          </div>
        </header>

        {!slugValid && (
          <div className="z-40 border-b border-rose-100 bg-rose-50 px-4 py-2 text-center text-xs font-black text-rose-600">
            מותר רק אותיות באנגלית קטנות, מספרים ומקף. לדוגמה: hadar-beauty
          </div>
        )}

        {savedAt && (
          <div className="z-40 border-b border-emerald-100 bg-emerald-50 px-4 py-2 text-center text-xs font-black text-emerald-700">
            נשמר בהצלחה בשעה {savedAt} · {publicUrl}
          </div>
        )}

        <div className="grid min-h-0 flex-1 grid-cols-[520px_minmax(0,1fr)_380px]">
          <aside className="grid min-h-0 grid-cols-[88px_1fr] border-l border-slate-200 bg-white">
            <nav className="flex min-h-0 flex-col items-center gap-2 border-l border-slate-100 bg-white px-3 py-4">
              {leftNav.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setLeftPanel(item.key)}
                  className={[
                    "group flex w-full flex-col items-center justify-center rounded-2xl px-2 py-3 text-[11px] font-black transition",
                    leftPanel === item.key
                      ? "bg-violet-100 text-violet-700"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                  ].join(" ")}
                >
                  <span className="mb-1 text-lg">{item.icon}</span>
                  <span className="leading-4">{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="min-h-0 overflow-y-auto bg-white p-5">
              {leftPanel === "templates" && (
                <PanelBox
                  title="תבניות"
                  subtitle="בחרי מבנה אתר מוכן והתחילי לערוך"
                >
                  <div className="grid grid-cols-3 gap-3">
                    {studioTemplates.map((template) => (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => applyTemplate(template)}
                        className="group rounded-3xl border border-slate-200 bg-white p-2 text-right shadow-sm transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl"
                      >
                        <img
                          src={template.preview}
                          alt=""
                          className="mb-3 h-24 w-full rounded-2xl object-cover"
                        />
                        <p className="text-sm font-black text-slate-800">
                          {template.name}
                        </p>
                        <p className="mt-1 line-clamp-2 text-[11px] font-bold leading-4 text-slate-400">
                          {template.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </PanelBox>
              )}

              {leftPanel === "elements" && (
                <PanelBox
                  title="הוספת אלמנטים"
                  subtitle="גררי אלמנטים או לחצי כדי להוסיף לאתר"
                >
                  <div className="mb-5 grid grid-cols-3 gap-3">
                    {quickBlocks.map((block) => (
                      <button
                        key={block.blockId}
                        type="button"
                        onClick={() => addBlockToCanvas(block.blockId)}
                        className="rounded-3xl border border-slate-100 bg-gradient-to-br from-white to-violet-50/60 p-4 text-center shadow-sm transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl"
                      >
                        <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-xl text-violet-700">
                          {block.icon}
                        </span>
                        <span className="text-xs font-black text-slate-800">
                          {block.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="hidden">
                    <div ref={blocksRef} />
                  </div>
                </PanelBox>
              )}

              {leftPanel === "smartBlocks" && (
                <PanelBox
                  title="בלוקים חכמים"
                  subtitle="בלוקים שמתחברים למודולים של Bizuply"
                >
                  <SmartBlock
                    title="שירותים מהעסק"
                    text="מושך אוטומטית שירותים, מחירים וזמנים"
                    onClick={() => addBlockToCanvas("biz-services")}
                  />
                  <SmartBlock
                    title="תיאום תורים"
                    text="מחובר ליומן, שעות פעילות וזמינות"
                    onClick={() => addBlockToCanvas("biz-booking")}
                  />
                  <SmartBlock
                    title="מוצרים וסליקה"
                    text="מוצרים, סליקה וכפתור הוספה לסל"
                    onClick={() => addBlockToCanvas("biz-products")}
                  />
                  <SmartBlock
                    title="טופס ליד"
                    text="כל פנייה נכנסת ל־CRM של העסק"
                    onClick={() => addBlockToCanvas("biz-lead-form")}
                  />
                  <SmartBlock
                    title="מועדון לקוחות"
                    text="הרשמה להטבות, קופונים ועדכונים"
                    onClick={() => addBlockToCanvas("biz-club")}
                  />
                </PanelBox>
              )}

              {leftPanel === "pages" && (
                <PanelBox title="דפים" subtitle="ניהול דפי האתר">
                  <PageItem active title="דף הבית" />
                  <PageItem title="אודות" />
                  <PageItem title="שירותים" />
                  <PageItem title="צור קשר" />
                </PanelBox>
              )}

              {leftPanel === "media" && (
                <PanelBox title="מדיה" subtitle="תמונות וקבצים לאתר">
                  <button
                    type="button"
                    onClick={handleOpenAssets}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-black text-slate-700 transition hover:bg-violet-50 hover:text-violet-700"
                  >
                    פתיחת מנהל מדיה
                  </button>
                </PanelBox>
              )}

              {leftPanel === "commerce" && (
                <PanelBox title="מוצרים וסליקה" subtitle="חיבור חנות וסליקה">
                  <SmartBlock
                    title="הוספת בלוק מוצרים"
                    text="מוצרים עם מחיר וכפתור רכישה"
                    onClick={() => addBlockToCanvas("biz-products")}
                  />
                </PanelBox>
              )}

              {leftPanel === "services" && (
                <PanelBox title="שירותים" subtitle="חיבור השירותים לאתר">
                  <SmartBlock
                    title="הוספת בלוק שירותים"
                    text="השירותים יוצגו מתוך המערכת"
                    onClick={() => addBlockToCanvas("biz-services")}
                  />
                </PanelBox>
              )}

              {leftPanel === "booking" && (
                <PanelBox title="תיאום תורים" subtitle="חיבור האתר ליומן">
                  <SmartBlock
                    title="הוספת תיאום תורים"
                    text="בחירת שירות, תאריך ושעה פנויה"
                    onClick={() => addBlockToCanvas("biz-booking")}
                  />
                </PanelBox>
              )}

              {leftPanel === "club" && (
                <PanelBox title="מועדון לקוחות" subtitle="הטבות וקופונים">
                  <SmartBlock
                    title="הוספת מועדון לקוחות"
                    text="סקשן קטן להצטרפות לקוחות"
                    onClick={() => addBlockToCanvas("biz-club")}
                  />
                </PanelBox>
              )}

              {leftPanel === "leads" && (
                <PanelBox title="טפסים ולידים" subtitle="טפסים שמתחברים ל־CRM">
                  <SmartBlock
                    title="הוספת טופס ליד"
                    text="שם, טלפון, אימייל והודעה"
                    onClick={() => addBlockToCanvas("biz-lead-form")}
                  />
                </PanelBox>
              )}

              {leftPanel === "seo" && (
                <PanelBox title="SEO" subtitle="הגדרות נראות במנועי חיפוש">
                  <p className="rounded-3xl bg-slate-50 p-4 text-sm font-bold leading-7 text-slate-500">
                    בהמשך נחבר כותרת SEO, תיאור, תמונת שיתוף וקישור ציבורי.
                  </p>
                </PanelBox>
              )}

              {leftPanel === "settings" && (
                <PanelBox title="הגדרות" subtitle="הגדרות כלליות לאתר">
                  <p className="rounded-3xl bg-slate-50 p-4 text-sm font-bold leading-7 text-slate-500">
                    כאן יהיו שפה, דומיין, סטטוס פרסום, פיקסלים, אנליטיקס והרשאות.
                  </p>
                </PanelBox>
              )}
            </div>
          </aside>

          <main className="min-h-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.10),transparent_30%),linear-gradient(135deg,#f8f7ff,#ffffff)] p-5">
            <div className="h-full overflow-hidden rounded-[2rem] border border-white bg-white shadow-[0_30px_100px_rgba(15,23,42,0.10)]">
              <div ref={editorContainerRef} className="h-full w-full" />
            </div>
          </main>

          <aside className="flex min-h-0 flex-col border-r border-slate-200 bg-white">
            <div className="flex h-14 shrink-0 border-b border-slate-200">
              <PanelTab
                active={rightPanel === "design"}
                onClick={() => setRightPanel("design")}
              >
                עיצוב
              </PanelTab>
              <PanelTab
                active={rightPanel === "settings"}
                onClick={() => setRightPanel("settings")}
              >
                הגדרות
              </PanelTab>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              {rightPanel === "design" && (
                <>
                  <PanelTitle
                    title="עיצוב"
                    subtitle="צבעים, גדלים, פינות, ריווח, צללים ואפקטים"
                  />
                  <div ref={stylesRef} />
                </>
              )}

              {rightPanel === "settings" && (
                <>
                  <PanelTitle
                    title="הגדרות אלמנט"
                    subtitle="קישורים, פעולות, תמונות, שדות והגדרות מתקדמות"
                  />
                  <div ref={traitsRef} />
                </>
              )}
            </div>
          </aside>

          <div className="hidden">
            <div ref={layersRef} />
          </div>
        </div>
      </div>
    </div>
  );
}

function injectGrapesUiPolish(editor: Editor) {
  editor.Css.addRules(`
    .gjs-selected {
      outline: 3px solid #8b5cf6 !important;
      outline-offset: 3px !important;
    }
  `);
}

function ToolbarButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-black text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
    >
      {children}
    </button>
  );
}

function DeviceButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-2xl px-4 py-3 text-xs font-black transition",
        active
          ? "border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800"
          : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function PanelTab({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex-1 text-sm font-black transition",
        active
          ? "border-b-2 border-violet-700 bg-violet-50 text-violet-700"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function PanelTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-black text-slate-800">{title}</p>
      <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
        {subtitle}
      </p>
    </div>
  );
}

function PanelBox({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-5">
        <h2 className="text-2xl font-black tracking-tight text-slate-800">
          {title}
        </h2>
        <p className="mt-1 text-sm font-bold leading-6 text-slate-400">
          {subtitle}
        </p>
      </div>

      {children}
    </section>
  );
}

function SmartBlock({
  title,
  text,
  onClick,
}: {
  title: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-3 w-full rounded-3xl border border-slate-200 bg-white p-4 text-right shadow-sm transition hover:-translate-y-1 hover:border-violet-300 hover:bg-violet-50 hover:shadow-xl"
    >
      <p className="text-sm font-black text-slate-800">{title}</p>
      <p className="mt-1 text-xs font-bold leading-5 text-slate-500">{text}</p>
    </button>
  );
}

function PageItem({ title, active = false }: { title: string; active?: boolean }) {
  return (
    <button
      type="button"
      className={[
        "mb-3 flex w-full items-center justify-between rounded-3xl border p-4 text-right shadow-sm transition",
        active
          ? "border-violet-300 bg-violet-50 text-violet-700"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
      ].join(" ")}
    >
      <span className="text-sm font-black">{title}</span>
      <span className="text-xs font-black">{active ? "פעיל" : "עריכה"}</span>
    </button>
  );
}

const studioPolishCss = `
  .gjs-one-bg {
    background: #ffffff !important;
  }

  .gjs-two-color {
    color: #475569 !important;
  }

  .gjs-three-bg {
    background: #8b5cf6 !important;
  }

  .gjs-four-color,
  .gjs-four-color-h:hover {
    color: #8b5cf6 !important;
  }

  .gjs-cv-canvas {
    background: #f3f4f8 !important;
    width: 100% !important;
    height: 100% !important;
    top: 0 !important;
  }

  .gjs-frame-wrapper {
    box-shadow: 0 25px 90px rgba(15, 23, 42, 0.16) !important;
  }

  .gjs-frame {
    border-radius: 18px !important;
  }

  .gjs-blocks-c {
    display: grid !important;
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    gap: 12px !important;
  }

  .gjs-block {
    width: auto !important;
    min-height: 92px !important;
    border-radius: 22px !important;
    border: 1px solid #e2e8f0 !important;
    background: linear-gradient(135deg, #ffffff, #f8f5ff) !important;
    color: #0f172a !important;
    box-shadow: 0 12px 28px rgba(15,23,42,0.06) !important;
    transition: 0.2s ease !important;
  }

  .gjs-block:hover {
    transform: translateY(-3px) !important;
    border-color: #c4b5fd !important;
    box-shadow: 0 20px 50px rgba(124,58,237,0.14) !important;
  }

  .gjs-block-label {
    font-weight: 900 !important;
    font-size: 12px !important;
  }

  .gjs-sm-sector {
    border: 1px solid #e2e8f0 !important;
    border-radius: 22px !important;
    overflow: hidden !important;
    margin-bottom: 14px !important;
    background: #ffffff !important;
  }

  .gjs-sm-sector-title {
    background: #f8fafc !important;
    color: #0f172a !important;
    font-weight: 900 !important;
    letter-spacing: 0 !important;
    padding: 14px 16px !important;
  }

  .gjs-sm-property {
    padding: 10px 14px !important;
  }

  .gjs-field,
  .gjs-input-holder input,
  .gjs-sm-select select {
    border-radius: 12px !important;
    background: #f8fafc !important;
    border: 1px solid #e2e8f0 !important;
    color: #0f172a !important;
  }

  .gjs-layer {
    border-radius: 14px !important;
    margin-bottom: 6px !important;
  }

  
  .gjs-toolbar {
    border-radius: 16px !important;
    overflow: hidden !important;
    box-shadow: 0 18px 45px rgba(15,23,42,0.18) !important;
  }
`;