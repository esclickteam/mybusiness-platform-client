import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HOME_FAQ } from "../../lib/homeFaq.mjs";
import { getGuide } from "../../lib/guidesMarketing.mjs";
import { PRICING_PAGE_PACKAGES } from "../../data/pricingPackagesData";
import "./showHome.css";

const GUIDES = ["what-is-a-crm", "meta-lead-ads-to-crm", "whatsapp-cloud-api-cost"];

export default function ShowHome({ language }: { language: string }) {
  const he = language.toLowerCase().startsWith("he");
  const locale = he ? "he" : language.toLowerCase().startsWith("es") ? "es" : language.toLowerCase().startsWith("pt") ? "pt-BR" : language.toLowerCase().startsWith("ar") ? "ar" : "en";
  const t = (hebrew: string, english: string) => (he ? hebrew : english);
  const [solution, setSolution] = useState(0);
  const [open, setOpen] = useState(0);
  const faqs = ((HOME_FAQ as Record<string, [string, string][]>)[locale] || HOME_FAQ.en).slice(0, 5);
  const guides = GUIDES.map((slug) => ({ slug, article: getGuide(slug, locale) })).filter((item) => item.article?.h1);
  const yearly = PRICING_PAGE_PACKAGES.find((plan) => plan.type === "yearly");
  const solutions = he
    ? [["עסקים קטנים", "לידים, משימות ושיחות במקום אחד."], ["נותני שירות", "לקוחות, פגישות וסדר יום."], ["סוכנויות שיווק", "קמפיינים ולידים שנכנסים."], ["צוותים", "רשומות ותהליכים משותפים."]]
    : [["Small businesses", "Leads, tasks and conversations in one place."], ["Service providers", "Customers, meetings and the day ahead."], ["Marketing agencies", "Campaigns and the leads that come in."], ["Teams", "Shared records and workflows."]];

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".sh");
    if (!root) return;
    let frame = 0;
    const tick = () => {
      frame = 0;
      root.querySelectorAll<HTMLElement>("[data-scene]").forEach((scene) => {
        const rect = scene.getBoundingClientRect();
        const total = Math.max(1, scene.offsetHeight - window.innerHeight * 0.4);
        const progress = Math.min(1, Math.max(0, (window.innerHeight * 0.85 - rect.top) / total));
        scene.style.setProperty("--p", progress.toFixed(3));
      });
    };
    const request = () => { if (!frame) frame = requestAnimationFrame(tick); };
    request();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    };
  }, []);

  return (
    <div className="sh">
      <section className="sh-platform" data-scene>
        <div className="sh-wrap">
          <h2>{t("כל מה שהעסק שלכם צריך. עכשיו הכל מתחבר.", "Everything the business needs. Now it connects.")}</h2>
          <p>{t("CRM, שיחות, שיווק, אוטומציות, יומן ואתר נשארים באותה סביבת עבודה. כל שכבה מובילה לעמוד המוצר.", "CRM, conversations, marketing, automations, the calendar and the site stay in one workspace. Each layer opens its product page.")}</p>
          <div className="sh-layers">
            {[
              ["/crm", "CRM", t("לידים, סטטוסים ומשימות המשך.", "Leads, statuses and follow-up tasks.")],
              ["/whatsapp-api", "WhatsApp", t("שיחה אחת, תבניות מאושרות וכרטיס לקוח.", "One thread, approved templates and the customer card.")],
              ["/automations", t("אוטומציות", "Automations"), t("טריגר, תנאי ופעולה על בסיס מה שהמערכת יודעת לעשות.", "A trigger, a condition and an action the product can actually run.")],
              ["/meta-campaigns", "Meta", t("קמפיינים ולידים שמגיעים עם מקור.", "Campaigns and leads that arrive with a source.")],
              ["/appointments", t("יומן", "Calendar"), t("שירותים, זמינות ופגישה ביומן.", "Services, availability and a meeting on the calendar.")],
              ["/website-builder", t("אתרים", "Websites"), t("עורך ויזואלי, תבניות וטופס שנקלט ב־CRM.", "A visual editor, templates and a form received in the CRM.")],
              ["/agents", "AI", t("היועץ העסקי ואוטומציות AI שכלולים בחבילה העסקית.", "The business advisor and AI automations included in the business plan.")],
            ].map(([href, title, body]) => (
              <article className="sh-layer" key={String(href)}>
                <h3>{title}</h3>
                <div>
                  <p>{body}</p>
                  <Link className="sh-go" to={String(href)}>{title}</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sh-crm" data-scene>
        <div className="sh-wrap sh-crm__frame">
          <div>
            <h2>{t("יותר הזדמנויות. פחות לידים שמתפספסים.", "More opportunities. Fewer leads left behind.")}</h2>
            <p>{t("ניהול לידים ולקוחות, מעקב אחרי שלבי המכירה, ומשימת המשך על אותו כרטיס.", "Lead and customer records, sales stages, and the next task on the same card.")}</p>
            <Link className="sh-go" to="/crm">{t("גלו את מערכת ה־CRM", "Explore the CRM")}</Link>
          </div>
          <div className="sh-board" aria-hidden="true">
            <div className="sh-rail" />
            {["New", "Contacted", "Won"].map((stage, index) => (
              <div className="sh-col" key={stage}>
                <strong>{stage}</strong>
                {index === 0 ? <article className="sh-lead"><b>Noa Levi</b><div>{t("דוגמה", "Sample")}</div></article> : null}
              </div>
            ))}
          </div>
        </div>
        <div className="sh-exit" aria-hidden="true" />
      </section>

      <section className="sh-wa" data-scene>
        <div className="sh-wrap">
          <h2>{t("כל שיחה מקרבת אתכם ללקוח.", "Every conversation brings the customer closer.")}</h2>
          <p>{t("שיחות WhatsApp Business מתוך סביבת העבודה, עם תבנית מאושרת והמשך טיפול על כרטיס הלקוח. מנוי ה־API הוא 29$ לחודש למספר, וחיובי Meta אינם כלולים.", "WhatsApp Business conversations from the workspace, with an approved template and the next step on the customer card. The API subscription is $29 per month per number. Meta fees are not included.")}</p>
          <div className="sh-wa__grid">
            <div className="sh-phone">
              <div className="sh-bubble">{t("אפשר לקבוע שיחה?", "Can we book a call?")}</div>
              <div className="sh-bubble me">{t("כן. בוחרים מועד פנוי.", "Yes. Pick an open time.")}</div>
            </div>
            <div className="sh-inbox">
              <strong>{t("כרטיס הלקוח", "Customer card")}</strong>
              <p>{t("השיחה נשארת על אותו לקוח. זו הדגמה, לא נתון אמיתי.", "The thread stays on the same customer. This is a sample, not live data.")}</p>
              <Link className="sh-go" to="/whatsapp-api">WhatsApp</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="sh-auto" data-scene>
        <div className="sh-wrap">
          <h2>{t("העסק שלכם לא צריך לעצור. גם כשאתם עסוקים.", "The business does not have to stop while you are busy.")}</h2>
          <p>{t("אוטומציה מחברת טריגר, תנאי ופעולה. ההמחשה מציגה את המבנה, לא תהליך שלא קיים במוצר.", "An automation connects a trigger, a condition and an action. This shows the structure, not a process the product does not have.")}</p>
          <div className="sh-flow">
            <article className="sh-node"><b>{t("טריגר", "Trigger")}</b><p>{t("ליד חדש", "New lead")}</p></article>
            <article className="sh-node"><b>{t("תנאי", "Condition")}</b><p>{t("יש טלפון", "A phone exists")}</p></article>
            <article className="sh-node"><b>{t("פעולה", "Action")}</b><p>{t("משימת המשך", "Follow-up task")}</p></article>
            <article className="sh-node"><b>{t("תוצאה", "Result")}</b><p>{t("רשומה מעודכנת", "Record updated")}</p></article>
          </div>
          <Link className="sh-go" to="/automations">{t("גלו את האוטומציות", "Explore automations")}</Link>
        </div>
      </section>

      <section className="sh-meta" data-scene>
        <div className="sh-wrap">
          <h2>{t("מהפרסום ועד המכירה. תראו את התמונה המלאה.", "From the ad to the sale. See the whole picture.")}</h2>
          <p>{t("לידים ממודעות Meta ומטפסי Google Ads נכנסים עם מקור. ההוצאה על המדיה מחויבת אצל Meta, לא כאן.", "Leads from Meta Lead Ads and Google Ads forms arrive with a source. Media spend is billed by Meta, not here.")}</p>
          <div className="sh-bars" aria-hidden="true"><span style={{ ["--h" as string]: "70%" }} /><span style={{ ["--h" as string]: "46%" }} /><span style={{ ["--h" as string]: "90%" }} /><span style={{ ["--h" as string]: "62%" }} /></div>
          <Link className="sh-go" to="/meta-campaigns">{t("גלו את כלי השיווק", "Explore marketing")}</Link>
        </div>
      </section>

      <section className="sh-cal" data-scene>
        <div className="sh-wrap">
          <h2>{t("פחות תיאומים. יותר זמן לדברים החשובים.", "Fewer back-and-forths. More time for what matters.")}</h2>
          <p>{t("שירותים, זמינות ופגישה ביומן אחד.", "Services, availability and the meeting in one calendar.")}</p>
          <div className="sh-week">{["1", "2", "3", "4", "5"].map((day) => <div className="sh-day" key={day}>{day}{day === "3" ? <div className="sh-slot">{t("פגישה לדוגמה", "Sample meeting")}</div> : null}</div>)}</div>
          <Link className="sh-go" to="/appointments" style={{ background: "#edff00", color: "#111936" }}>{t("גלו את מערכת הפגישות", "Explore meetings")}</Link>
        </div>
      </section>

      <section className="sh-site" data-scene>
        <div className="sh-wrap">
          <h2>{t("האתר שלכם. המותג שלכם. הכל מחובר.", "Your site. Your brand. Connected.")}</h2>
          <p>{t("עורך ויזואלי ותבניות. טופס באתר יכול להיקלט ב־CRM. אתר בלבד הוא 129$ לשנה.", "A visual editor and templates. A form on the site can be received in the CRM. Website only is $129 a year.")}</p>
          <div className="sh-site__row">
            <div className="sh-canvas"><strong>{t("תצוגת דסקטופ", "Desktop")}</strong></div>
            <div className="sh-canvas" style={{ width: "100%" }}><strong>{t("תצוגת מובייל", "Mobile")}</strong></div>
          </div>
          <Link className="sh-go" to="/website-builder">{t("גלו את בניית האתרים", "Explore the website builder")}</Link>
        </div>
      </section>

      <section className="sh-ai" data-scene>
        <div className="sh-wrap">
          <h2>{t("בינה מלאכותית. שעובדת יחד איתכם.", "Artificial intelligence. Working with you.")}</h2>
          <p>{t("בחבילה העסקית כלולים היועץ העסקי ואוטומציות AI, לצד משימות ותיעוד.", "The business plan includes the business advisor and AI automations, alongside tasks and records.")}</p>
          <div className="sh-ai__box">{t("בקשה, עיבוד ותוצאה בתוך כלי ה־AI שכבר קיימים במוצר.", "A request, the work, and a result inside the AI tools the product already has.")}</div>
          <Link className="sh-go" to="/agents">{t("גלו את כלי ה־AI", "Explore the AI tools")}</Link>
        </div>
      </section>

      <section className="sh-sol">
        <div className="sh-wrap sh-sol__grid">
          <div>
            <h2>{t("עסקים שונים. אינסוף דרכים לעבוד חכם.", "Different businesses. Many ways to work smarter.")}</h2>
            {solutions.map(([title], index) => (
              <button key={title} type="button" aria-pressed={solution === index} onClick={() => setSolution(index)}>{title}</button>
            ))}
          </div>
          <div className="sh-mask">
            <img src={`/demo-media/home/screens/${he ? "he" : "en"}-desktop-${solution % 2 ? "crm-card" : "whatsapp"}.webp`} alt="" />
            <p>{solutions[solution][1]}</p>
          </div>
        </div>
      </section>

      <section className="sh-wrap" data-scene>
        <h2>{t("מהפנייה הראשונה ועד המשך הטיפול.", "From the first enquiry through the next step.")}</h2>
        <p>{t("פנייה מגיעה ממודעות Meta, מטופס Google Ads או מטופס באתר Bizuply. אחר כך היא ליד, שיחה, משימה ופגישה.", "An enquiry can arrive from Meta Lead Ads, a Google Ads form, or a form on a Bizuply site. Then it is a lead, a conversation, a task and a meeting.")}</p>
      </section>

      <section className="sh-wrap sh-bizi" data-scene>
        <img src="/brand/bizi.png" alt="Bizi" />
        <div>
          <h2>{t("לא בטוחים מה מתאים לעסק שלכם? בואו נדבר.", "Not sure what fits the business? Let’s talk.")}</h2>
          <div className="sh-console">
            <p className="q">{t("צריך CRM ויומן, בלי אתר כרגע.", "We need CRM and a calendar, not a website yet.")}</p>
            <p className="a">{t("החבילה העסקית כוללת את שניהם. אתר הוא תוספת או חבילה נפרדת.", "The business plan includes both. A website is an add-on or a separate package.")}</p>
            <p className="price"><span>{t("לפי הקטלוג", "From the catalog")}</span><b>{yearly ? `$${yearly.price}` : ""}</b> {he ? yearly?.nameHe : yearly?.nameEn}</p>
          </div>
          <button type="button" className="sh-go" onClick={() => window.dispatchEvent(new CustomEvent("bizuply:openSupportChat"))}>{t("בואו להתייעץ איתי", "Let’s talk")}</button>
        </div>
      </section>

      <section className="sh-wrap sh-price">
        <h2>{t("הפתרון שמתאים לעסק שלכם.", "The fit for the business.")}</h2>
        <div className="sh-plans">
          {PRICING_PAGE_PACKAGES.map((plan) => (
            <article className="sh-plan" key={plan.type}>
              <h3>{he ? plan.nameHe : plan.nameEn}</h3>
              <b>${plan.price}</b>
              <span>{he ? plan.pricePeriodHe : plan.pricePeriodEn}</span>
              <p>{he ? plan.descriptionHe : plan.descriptionEn}</p>
            </article>
          ))}
        </div>
        <Link className="sh-go" to="/pricing">{t("לכל המחירים", "See pricing")}</Link>
      </section>

      <section className="sh-partner">
        <div className="sh-wrap" style={{ display: "contents" }}>
          <div className="sh-photo" />
          <div style={{ padding: "0 1.2rem" }}>
            <h2>{t("הזדמנויות גדולות מתחילות בשיתוף פעולה.", "Big opportunities start with a partnership.")}</h2>
            <p>{t("תוכנית השותפים נשארת לפי התנאים שכבר מפורסמים.", "The partner program stays on the terms already published.")}</p>
            <Link className="sh-go" to="/partners">{t("לתוכנית השותפים", "Partner program")}</Link>
          </div>
        </div>
      </section>

      <section className="sh-wrap">
        <h2>{t("ידע שעוזר לעסק להתקדם.", "Knowledge that helps the business move.")}</h2>
        <div className="sh-mag">
          {guides.map((guide) => <Link key={guide.slug} to={`/guides/${guide.slug}`}>{guide.article.h1}</Link>)}
        </div>
      </section>

      <section className="sh-wrap">
        <h2>{t("כל מה שרציתם לדעת.", "What people ask before they start.")}</h2>
        {faqs.map(([question, answer], index) => (
          <details key={question} open={open === index} onToggle={(event) => { if (event.currentTarget.open) setOpen(index); }}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </section>

      <section className="sh-end">
        <div className="sh-wrap sh-end__inner">
          <div>
            <h2>{t("הגיע הזמן לקחת את העסק שלכם קדימה.", "It’s time to move the business forward.")}</h2>
            <Link className="sh-go" to="/register">{t("התחילו בחינם", "Start for free")}</Link>{" "}
            <Link className="sh-go" to="/contact">{t("קבעו הדגמה אישית", "Schedule a personal demo")}</Link>
          </div>
          <img src="/brand/mark.png" alt="" width="120" />
        </div>
        <div className="sh-foot"><div className="sh-wrap">Bizuply</div></div>
      </section>
    </div>
  );
}
