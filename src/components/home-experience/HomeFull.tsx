import { useState } from "react";
import { Link } from "react-router-dom";
import { HOME_FAQ } from "../../lib/homeFaq.mjs";
import { PRICING_PACKAGES } from "../../data/pricingPackagesData";
import { homeText } from "./homeCopy";

const MEDIA = "/demo-media/home/screens";

function openBizi(message?: string) {
  window.dispatchEvent(new CustomEvent("bizuply:openSupportChat", { detail: { message: message || "" } }));
}

export default function HomeFull({ language }: { language: string }) {
  const he = language.toLowerCase().startsWith("he");
  const lang = he ? "he" : "en";
  const locale = language.toLowerCase().startsWith("he") ? "he"
    : language.toLowerCase().startsWith("es") ? "es"
    : language.toLowerCase().startsWith("pt") ? "pt-BR"
    : language.toLowerCase().startsWith("ar") ? "ar"
    : "en";
  const faqs = ((HOME_FAQ as Record<string, [string, string][]>)[locale] || HOME_FAQ.en).slice(0, 6);
  const [open, setOpen] = useState(0);
  const t = (hebrew: string, english: string) => homeText(language, hebrew, english);
  const plans = PRICING_PACKAGES.slice(0, 3);

  return (
    <>
      <section className="bz-band bz-band--yellow">
        <div className="bz-rest bz-split">
          <div>
            <h2>{t("כל ליד הוא הזדמנות. אל תפספסו אותה.", "Every lead is an opportunity. Don’t miss it.")}</h2>
            <p>{t("נהלו את הלידים והלקוחות במקום אחד, עקבו אחר שלבי המכירה ודעו מה הפעולה הבאה.", "Keep leads and customers in one place, follow the sales stages, and see the next action.")}</p>
            <Link className="bz-link" to="/crm">{t("גלו את מערכת ה־CRM", "Explore the CRM")}</Link>
          </div>
          <img src={`${MEDIA}/${lang}-desktop-crm-card.webp`} alt="" />
        </div>
      </section>

      <section className="bz-band bz-band--pink">
        <div className="bz-rest bz-split">
          <video src="/demo-media/home/whatsapp.mp4" poster="/demo-media/home/whatsapp.jpg" muted playsInline controls />
          <div>
            <h2>{t("כל שיחה היא הזדמנות. כל לקוח חשוב.", "Every conversation is an opportunity. Every customer matters.")}</h2>
            <p>{t("נהלו שיחות WhatsApp Business מתוך סביבת העבודה, עם תבניות מאושרות וחיבור להמשך הטיפול.", "Run WhatsApp Business conversations from the workspace, with approved templates and a link to the next step.")}</p>
            <Link className="bz-link" to="/whatsapp-api">{t("גלו את WhatsApp Business", "Explore WhatsApp Business")}</Link>
          </div>
        </div>
      </section>

      <section className="bz-band bz-band--navy">
        <div className="bz-rest bz-split">
          <div>
            <h2>{t("פחות עבודה ידנית. יותר זמן לצמוח.", "Less manual work. More time to grow.")}</h2>
            <p>{t("חברו בין תהליכים עסקיים והפכו פעולות שחוזרות על עצמן לתהליך אחד.", "Connect business steps and turn repeated actions into one workflow.")}</p>
            <Link className="bz-link" to="/automations" style={{ background: "#edff00", color: "#111936" }}>{t("גלו את האוטומציות", "Explore automations")}</Link>
          </div>
          <img src={`${MEDIA}/${lang}-desktop-automation.webp`} alt="" />
        </div>
      </section>

      <section className="bz-band">
        <div className="bz-rest bz-split">
          <img src={`${MEDIA}/${lang}-desktop-campaigns.webp`} alt="" />
          <div>
            <h2>{t("מהקליק הראשון ועד ההזדמנות הבאה.", "From the first click to the next opportunity.")}</h2>
            <p>{t("חברו את פעילות הפרסום לניהול הלקוחות ועקבו אחר הקמפיינים והלידים שנכנסים.", "Connect advertising activity to customer management and follow the campaigns and incoming leads.")}</p>
            <Link className="bz-link" to="/meta-campaigns">{t("גלו את כלי השיווק", "Explore the marketing tools")}</Link>
          </div>
        </div>
      </section>

      <section className="bz-band" style={{ background: "#2541f5", color: "#fff" }}>
        <div className="bz-rest bz-split">
          <div>
            <h2>{t("פחות תיאומים. יותר זמן לעסק.", "Fewer back-and-forths. More time for the business.")}</h2>
            <p>{t("נהלו פגישות, שירותים וזמינות ביומן אחד.", "Manage meetings, services and availability in one calendar.")}</p>
            <Link className="bz-link" to="/appointments" style={{ background: "#edff00", color: "#111936" }}>{t("גלו את מערכת הפגישות", "Explore meetings")}</Link>
          </div>
          <img src={`${MEDIA}/${lang}-mobile-campaigns.webp`} alt="" />
        </div>
      </section>

      <section className="bz-band bz-band--blush">
        <div className="bz-rest bz-split">
          <img src="/demo-media/home/websites.jpg" alt="" />
          <div>
            <h2>{t("אתר יפה הוא רק ההתחלה. חברו אותו לעסק.", "A good-looking site is only the start. Connect it to the business.")}</h2>
            <p>{t("צרו אתר בעורך החזותי ובתבניות של Bizuply. טופס באתר יכול להיקלט ב־CRM.", "Build a site with Bizuply’s visual editor and templates. A form on the site can be received in the CRM.")}</p>
            <Link className="bz-link" to="/website-builder">{t("גלו את מערכת בניית האתרים", "Explore the website builder")}</Link>
          </div>
        </div>
      </section>

      <section className="bz-band bz-band--navy">
        <div className="bz-rest bz-split">
          <div>
            <h2>{t("בינה מלאכותית. בתוך יום העבודה.", "Artificial intelligence. Inside the working day.")}</h2>
            <p>{t("בחבילה העסקית קיימים היועץ העסקי ואוטומציות AI, לצד משימות ותיעוד. אין כאן הבטחה ליכולת שלא מופיעה במוצר.", "The business plan includes the business advisor and AI automations, alongside tasks and records. This does not promise a capability that is not in the product.")}</p>
            <Link className="bz-link" to="/agents" style={{ background: "#edff00", color: "#111936" }}>{t("גלו את כלי ה־AI", "Explore the AI tools")}</Link>
          </div>
          <img src={`${MEDIA}/${lang}-desktop-ai.webp`} alt="" />
        </div>
      </section>

      <section className="bz-band bz-band--mist" id="bizi">
        <div className="bz-rest bz-bizi">
          <img src="/brand/bizi.png" alt="Bizi" />
          <div>
            <h2>{t("תכירו את Bizi. היועצת העסקית החכמה שלכם.", "Meet Bizi. Your business advisor.")}</h2>
            <p>{t("לא בטוחים איזו חבילה מתאימה? Bizi מחוברת לצ'אט הקיים של Bizuply ויכולה לענות על שאלות על המערכת.", "Not sure which plan fits? Bizi uses Bizuply’s existing chat and can answer questions about the system.")}</p>
            <button type="button" className="bz-link" onClick={() => openBizi()}>{t("בואו להתייעץ איתי", "Let’s talk")}</button>
          </div>
        </div>
      </section>

      <section className="bz-band">
        <div className="bz-rest">
          <h2>{t("הפתרון הנכון. במחיר שמתאים לעסק.", "The right fit. At the published price.")}</h2>
          <div className="bz-plans">
            {plans.map((plan) => (
              <article className="bz-plan" key={plan.type}>
                <h3>{he ? plan.nameHe : plan.nameEn}</h3>
                <b>${plan.price}</b>
                <span>{he ? plan.pricePeriodHe : plan.pricePeriodEn}</span>
                <p>{he ? plan.descriptionHe : plan.descriptionEn}</p>
              </article>
            ))}
          </div>
          <Link className="bz-link" to="/pricing">{t("לכל המחירים", "See pricing")}</Link>
        </div>
      </section>

      <section className="bz-band bz-band--yellow">
        <div className="bz-rest">
          <h2>{t("צומחים טוב יותר ביחד.", "Grow better together.")}</h2>
          <p>{t("תוכנית השותפים נשארת לפי התנאים שכבר מפורסמים. אין כאן שינוי מחיר או תנאי.", "The partner program stays on the terms already published. Nothing here changes a price or a term.")}</p>
          <Link className="bz-link" to="/partners">{t("לתוכנית השותפים", "Partner program")}</Link>
        </div>
      </section>

      <section className="bz-band">
        <div className="bz-rest">
          <h2>{t("ידע שעוזר לעסק להתקדם.", "Knowledge that helps the business move.")}</h2>
          <p>{t("המדריכים הקיימים נשארים במרכז הידע. לא נוספו כאן כתבות חדשות.", "The existing guides stay in the knowledge center. No new articles were added here.")}</p>
          <Link className="bz-link" to="/guides">{t("לכל המדריכים", "All guides")}</Link>
        </div>
      </section>

      <section className="bz-band bz-band--mist bz-faq">
        <div className="bz-rest">
          <h2>{t("כל מה שרציתם לדעת.", "What people ask before they start.")}</h2>
          {faqs.map(([question, answer], index) => (
            <details key={question} open={open === index} onToggle={(event) => { if (event.currentTarget.open) setOpen(index); }}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
          <button type="button" className="bz-link" onClick={() => openBizi()}>{t("לא מצאתם תשובה? שאלו את Bizi", "Didn’t find an answer? Ask Bizi")}</button>
        </div>
      </section>

      <section className="bz-band bz-band--pink">
        <div className="bz-rest" style={{ textAlign: "center" }}>
          <h2>{t("הגיע הזמן לחבר את כל העסק שלכם.", "It’s time to connect the whole business.")}</h2>
          <p style={{ marginInline: "auto" }}>{t("כלים לניהול לקוחות, שיווק, תקשורת ותהליכי עבודה — בפלטפורמה אחת.", "Tools for customers, marketing, communication and workflows — on one platform.")}</p>
          <div style={{ display: "flex", gap: "0.7rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link className="bz-link" to="/register">{t("התחילו בחינם", "Start for free")}</Link>
            <Link className="bz-link" to="/contact" style={{ background: "transparent", color: "#111936", border: "2px solid #111936" }}>{t("קבעו הדגמה אישית", "Schedule a personal demo")}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
