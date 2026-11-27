import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HOME_FAQ } from "../../lib/homeFaq.mjs";
import { getGuide } from "../../lib/guidesMarketing.mjs";
import { PRICING_PAGE_PACKAGES } from "../../data/pricingPackagesData";
import "./experience.css";

const GUIDES = ["what-is-a-crm", "meta-lead-ads-to-crm", "whatsapp-cloud-api-cost"];
const LAYERS = [
  ["CRM", "/crm"],
  ["WhatsApp", "/whatsapp-api"],
  ["Automations", "/automations"],
  ["Marketing", "/meta-campaigns"],
  ["AI", "/agents"],
  ["Calendar", "/appointments"],
  ["Websites", "/website-builder"],
] as const;

type Copy = {
  platform: string;
  platformLead: string;
  reel: string;
  biziTitle: string;
  biziLead: string;
  biziButton: string;
  question: string;
  answer: string;
  quoteLabel: string;
  solutions: string;
  sols: [string, string][];
  journey: string;
  journeyLead: string;
  steps: string[];
  self: string;
  guided: string;
  integrations: string;
  benefits: string;
  prices: string;
  pricesLead: string;
  partners: string;
  partnersLead: string;
  guides: string;
  faq: string;
  ask: string;
  close: string;
  closeLead: string;
  start: string;
  demo: string;
  sample: string;
};

const EN: Copy = {
  platform: "Not another system for every task. Your whole business, connected.",
  platformLead: "From the first enquiry through the next step, the work sits in one workspace.",
  reel: "Watch one customer move through the workspace.",
  biziTitle: "Not sure where to start? Meet Bizi.",
  biziLead: "Bizuply’s advisor is here to learn the business, answer questions and help you choose the published fit.",
  biziButton: "Let’s talk",
  question: "We need leads, WhatsApp and a calendar.",
  answer: "The business plan covers CRM, appointments and automations. WhatsApp API is separate.",
  quoteLabel: "From the published catalog",
  solutions: "The business is specific. The workspace should be too.",
  sols: [
    ["Small businesses", "Leads, tasks and conversations in one place."],
    ["Service providers", "Customers, meetings and the day ahead."],
    ["Marketing agencies", "Campaigns, incoming leads and the next step."],
    ["Growing teams", "Shared records, tasks and workflows."],
  ],
  journey: "From the first moment.",
  journeyLead: "A lead can arrive from Meta Lead Ads, a Google Ads form, or a form on a Bizuply site.",
  steps: ["Enquiry", "Lead", "CRM", "Conversation", "Follow-up", "Meeting"],
  self: "Start on your own",
  guided: "Talk with the team",
  integrations: "Connections that already exist",
  benefits: "More order. More control. More room to grow.",
  prices: "The right fit. At the published price.",
  pricesLead: "These are the packages already on the pricing page.",
  partners: "Grow better together.",
  partnersLead: "The partner program stays on the terms already published.",
  guides: "Guides that are already published.",
  faq: "What people ask before they start.",
  ask: "Ask Bizi",
  close: "It’s time to connect the whole business.",
  closeLead: "Customers, marketing, conversations and workflows — on one platform.",
  start: "Get Started",
  demo: "Schedule a personal demo",
  sample: "Sample",
};

const HE: Copy = {
  ...EN,
  platform: "לא עוד מערכת לכל משימה. כל העסק שלכם מחובר.",
  platformLead: "מהפנייה הראשונה ועד המשך הטיפול, העבודה נמצאת בסביבה אחת.",
  reel: "רואים לקוח אחד נע בתוך סביבת העבודה.",
  biziTitle: "לא בטוחים מאיפה להתחיל? תכירו את Bizi.",
  biziLead: "היועצת החכמה של Bizuply כאן כדי להכיר את העסק שלכם, לענות על שאלות ולעזור לכם לבחור את הפתרון המתאים לצרכים שלכם.",
  biziButton: "בואו להתייעץ איתי",
  question: "צריך לידים, WhatsApp ויומן.",
  answer: "החבילה העסקית כוללת CRM, פגישות ואוטומציות. WhatsApp API הוא מנוי נפרד.",
  quoteLabel: "לפי הקטלוג המפורסם",
  solutions: "העסק שלכם ייחודי. גם סביבת העבודה שלו צריכה להיות.",
  sols: [
    ["עסקים קטנים", "לידים, משימות ושיחות במקום אחד."],
    ["נותני שירות", "לקוחות, פגישות וסדר היום."],
    ["סוכנויות שיווק", "קמפיינים, לידים שנכנסים והפעולה הבאה."],
    ["צוותים בצמיחה", "רשומות, משימות ותהליכים משותפים."],
  ],
  journey: "מהרגע הראשון.",
  journeyLead: "ליד יכול להגיע ממודעות לידים של Meta, מטופס Google Ads, או מטופס באתר Bizuply.",
  steps: ["פנייה", "ליד", "CRM", "שיחה", "המשך טיפול", "פגישה"],
  self: "מתחילים בעצמכם",
  guided: "מדברים עם הצוות",
  integrations: "החיבורים שכבר קיימים",
  benefits: "יותר סדר. יותר שליטה. יותר מקום לצמוח.",
  prices: "הפתרון הנכון. במחיר שמתאים לעסק.",
  pricesLead: "אלה החבילות שכבר מופיעות בעמוד המחירים.",
  partners: "צומחים טוב יותר ביחד.",
  partnersLead: "תוכנית השותפים נשארת לפי התנאים שכבר מפורסמים.",
  guides: "מדריכים שכבר פורסמו.",
  faq: "כל מה שרציתם לדעת.",
  ask: "שאלו את Bizi",
  close: "הגיע הזמן לחבר את כל העסק שלכם.",
  closeLead: "לקוחות, שיווק, שיחות ותהליכי עבודה — בפלטפורמה אחת.",
  start: "התחילו עכשיו",
  demo: "קבעו הדגמה אישית",
  sample: "דוגמה",
};

function copyFor(language: string) {
  return language.toLowerCase().startsWith("he") ? HE : EN;
}

function localeOf(language: string) {
  const value = language.toLowerCase();
  if (value.startsWith("he")) return "he";
  if (value.startsWith("es")) return "es";
  if (value.startsWith("pt")) return "pt-BR";
  if (value.startsWith("ar")) return "ar";
  return "en";
}

export default function Experience({ language }: { language: string }) {
  const copy = copyFor(language);
  const locale = localeOf(language);
  const he = locale === "he";
  const [layer, setLayer] = useState(0);
  const [solution, setSolution] = useState(0);
  const [faqOpen, setFaqOpen] = useState(0);
  const faqs = ((HOME_FAQ as Record<string, [string, string][]>)[locale] || HOME_FAQ.en).slice(0, 6);
  const guides = GUIDES.map((slug) => ({ slug, article: getGuide(slug, locale) })).filter((item) => item.article?.h1);
  const yearly = PRICING_PAGE_PACKAGES.find((plan) => plan.type === "yearly");

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".xp");
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const tick = () => {
      frame = 0;
      root.querySelectorAll<HTMLElement>("[data-scene]").forEach((scene) => {
        const rect = scene.getBoundingClientRect();
        const total = Math.max(1, scene.offsetHeight - window.innerHeight);
        const progress = reduced ? 1 : Math.min(1, Math.max(0, -rect.top / total));
        scene.style.setProperty("--p", progress.toFixed(4));
        scene.style.setProperty("--phase", Math.min(1, progress * 1.4).toFixed(4));
        if (scene.dataset.beats) {
          const beats = Number(scene.dataset.beats);
          scene.dataset.beat = String(Math.min(beats - 1, Math.floor(progress * beats)));
        }
      });
      const stack = root.querySelector<HTMLElement>(".xp-stack");
      const reel = root.querySelector<HTMLElement>(".xp-reel");
      if (stack && reel?.dataset.beat && !stack.dataset.locked) stack.dataset.layer = String(Math.min(6, Number(reel.dataset.beat)));
    };
    const request = () => { if (!frame) frame = window.requestAnimationFrame(tick); };
    request();
    window.addEventListener("scroll", request, { passive: true });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
    };
  }, []);

  return (
    <div className="xp">
      <section className="xp-platform">
        <div className="xp-wrap xp-platform__head">
          <div>
            <img className="xp-mark" src="/brand/mark.png" alt="" />
            <h2>{copy.platform}</h2>
            <p>{copy.platformLead}</p>
          </div>
          <p>{copy.reel}</p>
        </div>
        <div className="xp-wrap">
          <div className="xp-tabs" aria-hidden="false">
            {LAYERS.map(([label], index) => (
              <button key={label} type="button" className={layer === index ? "is-on" : ""} data-i={index} onClick={() => { setLayer(index); document.querySelector<HTMLElement>(".xp-stack")?.setAttribute("data-locked", "1"); document.querySelector<HTMLElement>(".xp-stack")?.setAttribute("data-layer", String(index)); }}>{label}</button>
            ))}
          </div>
          <div className="xp-stack" data-layer={layer}>
            {LAYERS.map(([label, href], index) => (
              <article className="xp-layer" data-i={index} key={label}>
                <div>
                  <h3>{label}</h3>
                  <Link className="xp-go" to={href}>{label}</Link>
                </div>
                <ProductFace index={index} sample={copy.sample} />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="xp-reel" data-scene data-beats="6" data-beat="0">
        <div className="xp-wrap xp-reel__pin">
          <div>
            <h2>{copy.reel}</h2>
            <p>{copy.journeyLead}</p>
          </div>
          <div className="xp-reel__stage">
            <div className="xp-scene" data-i="0"><ProductFace index={0} sample={copy.sample} /></div>
            <div className="xp-scene" data-i="1"><ProductFace index={1} sample={copy.sample} /></div>
            <div className="xp-scene" data-i="2"><ProductFace index={2} sample={copy.sample} /></div>
            <div className="xp-scene" data-i="3"><ProductFace index={3} sample={copy.sample} /></div>
            <div className="xp-scene" data-i="4"><ProductFace index={5} sample={copy.sample} /></div>
            <div className="xp-scene" data-i="5"><ProductFace index={6} sample={copy.sample} /></div>
          </div>
        </div>
      </section>
      <div className="xp-wash" aria-hidden="true" />

      <section className="xp-wrap" data-scene>
        <div className="xp-bizi">
          <div className="xp-portrait"><img src="/brand/bizi.png" alt="Bizi" /></div>
          <div>
            <h2>{copy.biziTitle}</h2>
            <p>{copy.biziLead}</p>
            <div className="xp-console">
              <p className="q">{copy.question}</p>
              <p className="a">{copy.answer}</p>
              <div className="xp-quote">
                <span>{copy.quoteLabel}</span>
                <b>{yearly ? `$${yearly.price}` : ""}</b>
                <span>{he ? yearly?.pricePeriodHe : yearly?.pricePeriodEn}</span>
                <div>{he ? yearly?.nameHe : yearly?.nameEn}</div>
              </div>
            </div>
            <button type="button" className="xp-go" onClick={() => window.dispatchEvent(new CustomEvent("bizuply:openSupportChat"))}>{copy.biziButton}</button>
          </div>
        </div>
      </section>

      <section className="xp-wrap xp-split">
        <div>
          <h2>{copy.solutions}</h2>
          {copy.sols.map(([title], index) => (
            <button key={title} type="button" aria-pressed={solution === index} onClick={() => setSolution(index)}>{title}</button>
          ))}
        </div>
        <div className="xp-photo">
          <img src={`/demo-media/home/screens/${he ? "he" : "en"}-desktop-${solution % 2 ? "whatsapp" : "crm-card"}.webp`} alt="" />
          <p>{copy.sols[solution][1]}</p>
        </div>
      </section>

      <section className="xp-wrap xp-path" data-scene>
        <h2>{copy.journey}</h2>
        <p>{copy.journeyLead}</p>
        <svg viewBox="0 0 100 20" aria-hidden="true"><path pathLength="1" d="M2 12 C 18 2, 32 18, 50 10 S 82 4, 98 11" /></svg>
        <div className="xp-steps">{copy.steps.map((step) => <span key={step}>{step}</span>)}</div>
        <div className="xp-steps" style={{ marginTop: "1rem" }}>
          <Link to="/meta-campaigns">Meta Lead Ads</Link>
          <span>Google Ads</span>
          <Link to="/website-builder">Bizuply</Link>
          <Link to="/whatsapp-api">WhatsApp</Link>
        </div>
        <p style={{ marginTop: "1.4rem" }}>{copy.integrations}</p>
        <h2 style={{ marginTop: "2rem" }}>{copy.benefits}</h2>
        <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", marginTop: "1rem" }}>
          <Link className="xp-go" to="/register">{copy.self}</Link>
          <Link className="xp-go" to="/contact">{copy.guided}</Link>
        </div>
      </section>

      <section className="xp-wrap">
        <h2>{copy.prices}</h2>
        <p>{copy.pricesLead}</p>
        <div className="xp-plans">
          {PRICING_PAGE_PACKAGES.map((plan) => (
            <article className="xp-plan" key={plan.type}>
              <h3>{he ? plan.nameHe : plan.nameEn}</h3>
              <b>${plan.price}</b>
              <span>{he ? plan.pricePeriodHe : plan.pricePeriodEn}</span>
            </article>
          ))}
        </div>
        <Link className="xp-go" to="/pricing">{copy.prices}</Link>
      </section>

      <section className="xp-wrap">
        <h2>{copy.partners}</h2>
        <p>{copy.partnersLead}</p>
        <Link className="xp-go" to="/partners">{copy.partners}</Link>
      </section>

      <section className="xp-wrap">
        <h2>{copy.guides}</h2>
        <div className="xp-guides">
          {guides.map((guide) => <Link key={guide.slug} to={`/guides/${guide.slug}`}>{guide.article.h1}</Link>)}
        </div>
        <Link className="xp-go" to="/guides">{copy.guides}</Link>
      </section>

      <section className="xp-wrap xp-faq">
        <h2>{copy.faq}</h2>
        {faqs.map(([question, answer], index) => (
          <details key={question} open={faqOpen === index} onToggle={(event) => { if (event.currentTarget.open) setFaqOpen(index); }}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
        <button type="button" className="xp-go" onClick={() => window.dispatchEvent(new CustomEvent("bizuply:openSupportChat"))}>{copy.ask}</button>
      </section>

      <section className="xp-wrap xp-close">
        <div>
          <h2>{copy.close}</h2>
          <p>{copy.closeLead}</p>
          <Link className="xp-go" to="/register">{copy.start}</Link>{" "}
          <Link className="xp-go" to="/contact">{copy.demo}</Link>
        </div>
        <img src="/brand/mark.png" alt="" />
      </section>
    </div>
  );
}

function ProductFace({ index, sample }: { index: number; sample: string }) {
  if (index === 1) {
    return (
      <div className="xp-ui xp-thread">
        <div className="xp-bubble">{sample}</div>
        <div className="xp-bubble in">{sample}</div>
      </div>
    );
  }
  if (index === 2) {
    return (
      <div className="xp-ui xp-flow">
        <div className="xp-node on">Trigger</div>
        <i className="xp-line" />
        <div className="xp-node">Condition</div>
        <i className="xp-line" />
        <div className="xp-node">Action</div>
      </div>
    );
  }
  if (index === 3) {
    return (
      <div className="xp-ui"><div className="xp-bars"><i style={{ ["--h" as string]: "80%" }} /><i style={{ ["--h" as string]: "50%" }} /><i style={{ ["--h" as string]: "96%" }} /></div></div>
    );
  }
  if (index === 5) {
    return (
      <div className="xp-ui xp-week">
        {["1", "2", "3", "4", "5"].map((day) => <div className="xp-day" key={day}>{day}{day === "3" ? <div className="xp-meet">{sample}</div> : null}</div>)}
      </div>
    );
  }
  return (
    <div className="xp-ui">
      <div className="xp-board">
        <div className="xp-side" />
        {["New", "Contacted", "Won"].map((stage, stageIndex) => (
          <div className="xp-col" key={stage}>
            <strong>{stage}</strong>
            {stageIndex === 0 ? (
              <article className="xp-card">
                <b>Noa Levi</b>
                <div>{sample}</div>
                <em>New</em>
              </article>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
