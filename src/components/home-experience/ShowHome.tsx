import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HOME_FAQ } from "../../lib/homeFaq.mjs";
import { getGuide } from "../../lib/guidesMarketing.mjs";
import { PRICING_PAGE_PACKAGES } from "../../data/pricingPackagesData";
import "./showHome.css";

const GUIDES = ["what-is-a-crm", "meta-lead-ads-to-crm", "whatsapp-cloud-api-cost", "follow-up-on-leads"];

function localeOf(language: string) {
  const value = language.toLowerCase();
  if (value.startsWith("he")) return "he";
  if (value.startsWith("es")) return "es";
  if (value.startsWith("pt")) return "pt-BR";
  if (value.startsWith("ar")) return "ar";
  return "en";
}

export default function ShowHome({ language }: { language: string }) {
  const locale = localeOf(language);
  const he = locale === "he" || locale === "ar";
  const t = (hebrew: string, english: string) => (locale === "he" ? hebrew : english);
  const screen = (name: string) => `/demo-media/home/screens/${locale === "he" ? "he" : "en"}-desktop-${name}.webp`;
  const [openFaq, setOpenFaq] = useState(0);
  const faqs = ((HOME_FAQ as Record<string, [string, string][]>)[locale] || HOME_FAQ.en).slice(0, 6);
  const guides = GUIDES.map((slug) => ({ slug, article: getGuide(slug, locale) })).filter((item) => item.article?.h1);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".sh");
    if (!root) return undefined;
    let frame = 0;
    const tick = () => {
      frame = 0;
      root.querySelectorAll<HTMLElement>("[data-scene]").forEach((scene) => {
        const rect = scene.getBoundingClientRect();
        const total = Math.max(1, scene.offsetHeight - window.innerHeight);
        const progress = Math.min(1, Math.max(0, -rect.top / total));
        scene.style.setProperty("--p", progress.toFixed(4));
      });
    };
    const request = () => {
      if (!frame) frame = window.requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    };
  }, []);

  const leads = he
    ? [
        ["נועה לוי", "Meta Lead Ads", "ייעוץ מיתוג", "חדש"],
        ["דניאל כהן", "טופס אתר", "אפיון אתר", "נוצר קשר"],
        ["מאיה אברהם", "Google Ads", "חבילה עסקית", "מעוניין"],
        ["יוסי מזרחי", "Meta Lead Ads", "חידוש שנתי", "הומר"],
      ]
    : [
        ["Noa Levi", "Meta Lead Ads", "Brand consult", "New"],
        ["Daniel Cohen", "Website form", "Site brief", "Contacted"],
        ["Maya Avraham", "Google Ads", "Business plan", "Interested"],
        ["Yossi Mizrahi", "Meta Lead Ads", "Yearly renewal", "Converted"],
      ];

  return (
    <div className="sh" dir={he ? "rtl" : "ltr"}>
      <section className="sc sc-platform" data-scene>
        <div className="sc-pin">
          <span className="plat-wash" />
          <span className="plat-wash plat-wash--b" />
          <div className="sc-wrap plat">
            <div className="plat-copy">
              <h2>{t("כל מה שהעסק שלכם צריך. עכשיו הכל מתחבר.", "Everything the business needs. Now it connects.")}</h2>
              <p>{t("ליד, שיחה, משימה, פגישה ואתר נשארים על אותו לקוח. כל שכבה היא מוצר קיים בפלטפורמה, לא מודול נפרד שצריך לייצא אליו נתונים.", "A lead, a conversation, a task, a meeting and the website stay on the same customer. Each layer is a product already in the platform.")}</p>
              <p>{t("מתאים לעסק שירות, לסוכנות ולצוות שמטפל בפניות מכמה מקורות ורוצה לראות את השלב הבא בלי לעבור בין כלים.", "It fits a service business, an agency, or a team handling enquiries from several sources.")}</p>
            </div>
            <div className="stack">
              {[
                ["crm-list", "CRM", t("שישה סטטוסים, מקור הגעה ומשימה על הכרטיס.", "Six statuses, a source, and the next task on the card."), ["/crm", t("למערכת ה־CRM", "Open the CRM")]],
                ["whatsapp", "WhatsApp", t("שיחה שמורה על הלקוח, עם תבנית מאושרת.", "The thread stays on the customer, with an approved template."), ["/whatsapp-api", "WhatsApp"]],
                ["automation", t("אוטומציות", "Automations"), t("טריגר, תנאי ופעולה על מה שהמערכת יודעת לבצע.", "A trigger, a condition and an action the product can run."), ["/automations", t("לעורך האוטומציות", "Open automations")]],
                ["campaigns", "Meta", t("ליד ממודעה נכנס עם המקור שלו.", "A lead from an ad arrives with its source."), ["/meta-campaigns", t("לשיווק", "Open marketing")]],
                ["ai", "AI", t("היועץ העסקי ואוטומציות AI בחבילה העסקית.", "The business advisor and AI automations in the business plan."), ["/agents", t("לכלי ה־AI", "Open AI tools")]],
              ].map(([shot, title, body, link], index) => (
                <article className="stack-card" style={{ ["--i" as string]: index }} key={String(title)}>
                  <div>
                    <h3>{title}</h3>
                    <ul>
                      <li>{body}</li>
                      <li>{t("הנתונים נשארים בסביבת העבודה.", "The record stays in the workspace.")}</li>
                    </ul>
                    <Link className="sh-go" to={(link as string[])[0]}>{(link as string[])[1]}</Link>
                  </div>
                  <div className="stack-shot"><img src={screen(String(shot))} alt="" /></div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="sc sc-crm" data-scene>
        <div className="sc-pin">
          <div className="sc-wrap">
            <div className="crm">
              <div className="crm-copy">
                <h2>{t("יותר הזדמנויות. פחות לידים שמתפספסים.", "More opportunities. Fewer leads left behind.")}</h2>
                <p>{t("ה־CRM מרכז לידים ולקוחות, שישה סטטוסים, מקור הגעה, תגיות, היסטוריית טיפול ומשימת המשך. כרטיס הלקוח נפתח מתוך הלוח בלי לעזוב את תהליך המכירה.", "The CRM holds leads and customers, six statuses, the source, tags, the activity history and the next task. The customer card opens from the board.")}</p>
                <p>{t("מתאים למי שמקבל פניות ממודעות, מטופס באתר ומשיחות, ורוצה לדעת מי ממתין לטיפול.", "It fits a team taking enquiries from ads, a website form and conversations.")}</p>
                <Link className="sh-go" to="/crm">{t("גלו את מערכת ה־CRM", "Explore the CRM")}</Link>
              </div>
              <div className="board" aria-label={t("לוח לידים", "Lead board")}>
                {[
                  [t("חדש", "New"), [leads[0]]],
                  [t("נוצר קשר", "Contacted"), [leads[1]]],
                  [t("מעוניין", "Interested"), [leads[2]]],
                  [t("הומר", "Converted"), [leads[3]]],
                ].map(([stage, cards], column) => (
                  <div className="col" key={String(stage)}>
                    <header><span>{stage as string}</span><span>{(cards as string[][]).length}</span></header>
                    {(cards as string[][]).map((card, index) => (
                      <article className="lead" style={{ ["--i" as string]: column + index }} key={card[0]}>
                        <b>{card[0]}</b>
                        <span>{card[1]}</span>
                        <small>{card[2]}</small>
                        <em className="pill">{card[3]}</em>
                      </article>
                    ))}
                  </div>
                ))}
                <aside className="drawer">
                  <div className="drawer-in">
                    <h3>{t("נועה לוי", "Noa Levi")}</h3>
                    <p>052-448-2190</p>
                    <p>{t("מקור: Meta Lead Ads · תגית: מיתוג", "Source: Meta Lead Ads · Tag: branding")}</p>
                    <p>{t("26.11 בשעה 10:30 — לחזור אחרי שיחת האפיון ולשמור את הסיכום על הכרטיס.", "26 Nov, 10:30 — call back after the briefing and keep the note on the card.")}</p>
                    <p>{t("היסטוריה: הליד נכנס ב־25.11 בשעה 09:12 והסטטוס עדיין חדש.", "History: the lead arrived on 25 Nov at 09:12 and the status is still New.")}</p>
                  </div>
                </aside>
              </div>
            </div>
          </div>
          <div className="exit exit-pink" />
        </div>
      </section>

      <section className="sc sc-wa" data-scene>
        <div className="sc-pin">
          <div className="arc" />
          <div className="sc-wrap">
            <h2>{t("כל שיחה מקרבת אתכם ללקוח.", "Every conversation brings the customer closer.")}</h2>
            <p>{t("שיחות WhatsApp Business נפתחות מתוך סביבת העבודה, על אותו כרטיס לקוח. תבנית יוצאת רק אחרי אישור Meta. מנוי ה־API הוא 29$ לחודש למספר, וחיובי Meta אינם כלולים.", "WhatsApp Business threads open from the workspace, on the same customer card. An outbound template goes out only after Meta approval. The API subscription is $29 per month per number. Meta fees are not included.")}</p>
            <div className="wa phone-grow">
              <div className="wa-list">
                {[
                  [t("נועה לוי", "Noa Levi"), "09:22", true],
                  [t("דניאל כהן", "Daniel Cohen"), "08:41", false],
                  [t("מאיה אברהם", "Maya Avraham"), t("אתמול", "Yesterday"), false],
                ].map(([name, time, on]) => (
                  <div className={`chat-row${on ? " is-on" : ""}`} key={String(name)}>
                    <span className="avatar">{String(name).slice(0, 1)}</span>
                    <div><b>{name}</b><small>{time}</small></div>
                  </div>
                ))}
              </div>
              <div className="wa-thread">
                <p className="bubble" style={{ ["--d" as string]: 0.05 }}>{t("היי, ראיתי את המודעה לייעוץ מיתוג. אפשר פרטים על שיחת אפיון?", "Hi, I saw the branding ad. Can I get details on a briefing call?")}<small>09:14</small></p>
                <p className="bubble me" style={{ ["--d" as string]: 0.22 }}>{t("היי נועה, השיחה אורכת 45 דקות. יש מקום ב־26.11 בשעה 10:30.", "Hi Noa, the call is 45 minutes. 26 Nov at 10:30 is open.")}<small>09:16</small></p>
                <p className="bubble" style={{ ["--d" as string]: 0.4 }}>{t("מתאים. תשמרו את זה על הכרטיס שלי.", "That works. Please keep it on my card.")}<small>09:21</small></p>
                <p className="bubble me" style={{ ["--d" as string]: 0.55 }}>{t("נשמר. הפגישה ביומן והסטטוס יתעדכן אחרי השיחה.", "Saved. The meeting is on the calendar and the status updates after the call.")}<small>09:22</small></p>
              </div>
              <aside className="wa-side">
                <h3>{t("נועה לוי", "Noa Levi")}</h3>
                <p>052-448-2190</p>
                <p>{t("משויכת לכרטיס ב־CRM. תבנית: אישור פגישה, אחרי אישור Meta.", "Linked to the CRM card. Template: meeting confirmation, after Meta approval.")}</p>
                <p>{t("מצב טיפול: ממתין לשיחה ב־26.11, 10:30.", "Follow-up: waiting for the call on 26 Nov, 10:30.")}</p>
              </aside>
            </div>
          </div>
          <div className="exit exit-navy" />
        </div>
      </section>

      <section className="sc sc-auto" data-scene>
        <div className="sc-pin">
          <div className="sc-wrap">
            <h2>{t("העסק שלכם לא צריך לעצור. גם כשאתם עסוקים.", "The business does not have to stop while you are busy.")}</h2>
            <p>{t("כשליד עובר לסטטוס מעוניין ויש לו טלפון, האוטומציה יוצרת משימת המשך על אותו כרטיס. זה תהליך שהמוצר יודע להריץ, בלי לשלוח הודעה ללקוח אמיתי מתוך העמוד הזה.", "When a lead moves to Interested and has a phone number, the automation creates the next task on that card. The product can run this. This page does not message a real customer.")}</p>
            <div className="flow">
              <svg viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M0 4 H100" /></svg>
              {[
                [t("טריגר", "Trigger"), t("הסטטוס השתנה למעוניין", "Status changed to Interested"), t("נועה לוי, 25.11 בשעה 11:05", "Noa Levi, 25 Nov at 11:05")],
                [t("תנאי", "Condition"), t("קיים מספר טלפון בכרטיס", "The card has a phone number"), "052-448-2190"],
                [t("פעולה", "Action"), t("נפתחת משימה ליום העסקים הבא, 09:00", "A task opens for the next business day, 09:00"), t("אחראית: צוות המכירות", "Owner: sales")],
                [t("תוצאה", "Result"), t("המשימה שמורה על כרטיס נועה לוי", "The task is stored on Noa Levi’s card"), t("השיחה ב־WhatsApp נשארת מקושרת", "The WhatsApp thread stays linked")],
              ].map(([kicker, title, detail], index) => (
                <article className="node" style={{ ["--i" as string]: index }} key={kicker}>
                  <em>{kicker}</em>
                  <h3>{title}</h3>
                  <p>{detail}</p>
                </article>
              ))}
            </div>
            <Link className="sh-go" to="/automations">{t("גלו את האוטומציות", "Explore automations")}</Link>
          </div>
        </div>
      </section>

      <section className="sc sc-meta" data-scene>
        <div className="sc-pin">
          <div className="sc-wrap meta">
            <div>
              <h2>{t("מהפרסום ועד המכירה. תראו את התמונה המלאה.", "From the ad to the sale. See the whole picture.")}</h2>
              <p>{t("לידים ממודעות Meta ומטפסי Google Ads נכנסים ל־CRM עם המקור. ההוצאה על המדיה מחויבת אצל Meta או Google, לא בחשבון Bizuply.", "Leads from Meta Lead Ads and Google Ads forms enter the CRM with their source. Media spend is billed by Meta or Google, not by Bizuply.")}</p>
              <div className="chart" aria-hidden="true">
                {(he ? [["א׳", "42%"], ["ב׳", "68%"], ["ג׳", "54%"], ["ד׳", "90%"], ["ה׳", "73%"], ["ו׳", "61%"]] : [["Mon", "42%"], ["Tue", "68%"], ["Wed", "54%"], ["Thu", "90%"], ["Fri", "73%"], ["Sat", "61%"]]).map(([day, height]) => (
                  <span key={day} data-d={day} style={{ ["--h" as string]: height }} />
                ))}
              </div>
            </div>
            <div className="camps">
              {[
                [t("מיתוג לעסקים קטנים", "Branding for small businesses"), "18", "Meta Lead Ads"],
                [t("אפיון אתר", "Website briefing"), "11", "Google Ads"],
                [t("טופס באתר לומינה", "Lumina site form"), "7", "Bizuply"],
              ].map(([name, count, source], index) => (
                <article className="camp" style={{ ["--i" as string]: index }} key={name}>
                  <h3>{name}</h3>
                  <b>{count}</b>
                  <p>{t("לידים שנקלטו השבוע", "Leads received this week")} · {source}</p>
                  <p>{t("כל ליד נפתח בסטטוס חדש ומחכה לטיפול באותו לוח.", "Each lead opens as New and waits on the same board.")}</p>
                </article>
              ))}
              <Link className="sh-go" to="/meta-campaigns">{t("גלו את כלי השיווק", "Explore marketing")}</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="sc sc-cal" data-scene>
        <div className="sc-pin">
          <div className="sc-wrap">
            <h2>{t("פחות תיאומים. יותר זמן לדברים החשובים.", "Fewer back-and-forths. More time for what matters.")}</h2>
            <p>{t("מגדירים שירות, משך וזמינות. המערכת מציגה חלונות פנויים, והתור נשמר עם הלקוח, השירות והשעה על אותו כרטיס.", "You set the service, the duration and the availability. Open times are offered, and the booking is stored with the customer, the service and the time.")}</p>
            <div className="cal">
              <div className="week">
                {[
                  [t("א׳ 23.11", "Sun 23 Nov"), t("11:00 רינת אזולאי", "11:00 Rinat Azulai"), t("שיחת אפיון · 45 דק׳", "Briefing · 45 min")],
                  [t("ב׳ 24.11", "Mon 24 Nov"), t("15:30 עידו פרץ", "15:30 Ido Peretz"), t("הצגת חבילה · 30 דק׳", "Plan review · 30 min")],
                  [t("ג׳ 25.11", "Tue 25 Nov"), t("10:30 נועה לוי", "10:30 Noa Levi"), t("שיחת אפיון · 45 דק׳", "Briefing · 45 min")],
                  [t("ד׳ 26.11", "Wed 26 Nov"), t("14:00 דניאל כהן", "14:00 Daniel Cohen"), t("אפיון אתר · 30 דק׳", "Site brief · 30 min")],
                  [t("ה׳ 27.11", "Thu 27 Nov"), t("16:15 מאיה אברהם", "16:15 Maya Avraham"), t("פגישת המשך · 30 דק׳", "Follow-up · 30 min")],
                ].map(([day, who, what], index) => (
                  <div className="day" style={{ ["--i" as string]: index }} key={day}>
                    <strong>{day}</strong>
                    <div className={index === 4 ? "evt new" : "evt"}><b>{who}</b><span>{what}</span></div>
                  </div>
                ))}
              </div>
              <aside className="book">
                <h3>{t("קביעת 27.11", "Booking 27 Nov")}</h3>
                <ul>
                  <li>15:00 · {t("תפוס", "Taken")}</li>
                  <li>16:15 · {t("מאיה אברהם · פגישת המשך", "Maya Avraham · follow-up")}</li>
                  <li>17:00 · {t("פנוי", "Open")}</li>
                </ul>
                <p>{t("חלון של 15 דקות. השירות והמחיר נשמרים עם התור.", "15-minute slots. The service and price are stored with the booking.")}</p>
              </aside>
            </div>
            <Link className="sh-go" to="/appointments" style={{ background: "#edff00", color: "#111936" }}>{t("גלו את מערכת הפגישות", "Explore meetings")}</Link>
          </div>
        </div>
      </section>

      <section className="sc sc-site" data-scene>
        <div className="sc-pin">
          <span className="dot-y" />
          <div className="sc-wrap">
            <h2>{t("האתר שלכם. המותג שלכם. הכל מחובר.", "Your site. Your brand. Connected.")}</h2>
            <p>{t("עורך ויזואלי, תבניות, עמודים וטפסים. טופס באתר יכול להיפתח כליד ב־CRM. אתר בלבד הוא 129$ לשנה, ודומיין כלול לשנה הראשונה.", "A visual editor, templates, pages and forms. A form on the site can open as a lead in the CRM. Website only is $129 a year, with a domain included for the first year.")}</p>
            <div className="editor">
              <aside className="rail">
                <strong>{t("עמודים", "Pages")}</strong>
                <button type="button">{t("דף הבית", "Home")}</button>
                <button type="button">{t("שירותים", "Services")}</button>
                <button type="button">{t("צור קשר", "Contact")}</button>
              </aside>
              <div className="stage">
                <div className="frames">
                  <div className="desk"><img src={`/demo-media/home/sites/lashora-${locale === "he" ? "he" : "en"}-desk.webp`} alt={t("תצוגת האתר בדסקטופ", "Desktop site")} /></div>
                  <div className="mob"><img src={`/demo-media/home/sites/lashora-${locale === "he" ? "he" : "en"}-phone.webp`} alt={t("תצוגת האתר במובייל", "Mobile site")} /></div>
                </div>
              </div>
              <aside className="props">
                <strong>{t("רכיבים", "Blocks")}</strong>
                <div>{t("כותרת", "Heading")}</div>
                <div>{t("גלריה", "Gallery")}</div>
                <div>{t("טופס יצירת קשר", "Contact form")}</div>
                <p>{t("הטופס שולח את השם, הטלפון והבקשה ל־CRM.", "The form sends the name, phone and request to the CRM.")}</p>
              </aside>
            </div>
            <Link className="sh-go" to="/website-builder">{t("גלו את בניית האתרים", "Explore the website builder")}</Link>
          </div>
        </div>
      </section>

      <section className="sc sc-ai" data-scene>
        <div className="sc-pin">
          <div className="sc-wrap">
            <h2>{t("בינה מלאכותית. שעובדת יחד איתכם.", "Artificial intelligence. Working with you.")}</h2>
            <p>{t("בחבילה העסקית כלולים היועץ העסקי ואוטומציות AI, לצד משימות ותיעוד. כאן רואים בקשה, עיבוד ותוצאה בתוך הכלים האלה, לא את כפתור הייעוץ הצף.", "The business plan includes the business advisor and AI automations, alongside tasks and notes. This is a request, the work, and a result inside those tools.")}</p>
            <div className="ai">
              <article style={{ ["--i" as string]: 0 }}>
                <h3>{t("בקשה", "Request")}</h3>
                <p>{t("אילו לידים מ־25.11 עדיין בסטטוס חדש, ומה כדאי לעשות הבוקר?", "Which leads from 25 Nov are still New, and what should happen this morning?")}</p>
              </article>
              <article style={{ ["--i" as string]: 1 }}>
                <h3>{t("עיבוד", "Working")}</h3>
                <p>{t("היועץ קורא את הסטטוס, המקור והאם יש טלפון בכרטיס.", "The advisor reads the status, the source, and whether the card has a phone number.")}</p>
              </article>
              <article style={{ ["--i" as string]: 2 }}>
                <h3>{t("תוצאה", "Result")}</h3>
                <ul>
                  <li>{t("נועה לוי · Meta · עדיין חדש · יש טלפון", "Noa Levi · Meta · still New · phone on file")}</li>
                  <li>{t("משימה קיימת: חזרה ב־26.11 בשעה 10:30", "Existing task: call on 26 Nov at 10:30")}</li>
                </ul>
              </article>
            </div>
            <Link className="sh-go" to="/agents">{t("גלו את כלי ה־AI", "Explore the AI tools")}</Link>
          </div>
        </div>
      </section>

      <section className="sc sc-sol" data-scene>
        <div className="sc-pin">
          <div className="sc-wrap" style={{ overflow: "hidden" }}>
            <h2>{t("עסקים שונים. אינסוף דרכים לעבוד חכם.", "Different businesses. Many ways to work smarter.")}</h2>
            <div className="sol-track">
              {[
                [t("עסקים קטנים", "Small businesses"), t("פנייה אחת, כרטיס אחד, ומשימה שלא הולכת לאיבוד בין הוואטסאפ למייל.", "One enquiry, one card, and a task that does not get lost between WhatsApp and email."), "noodlix"],
                [t("נותני שירות", "Service providers"), t("שירות, משך ופגישה ביומן, והלקוח נשאר מקושר לשיחה.", "A service, a duration and a meeting, with the customer still linked to the thread."), "lashora"],
                [t("סוכנויות שיווק", "Marketing agencies"), t("ליד ממודעה נכנס עם המקור, והצוות רואה אותו באותו לוח.", "A lead from an ad arrives with its source, and the team sees it on the same board."), "primeview"],
                [t("צוותים", "Teams"), t("סטטוס, הערה ומשימה גלויים למי שמטפל, בלי גיליון נפרד.", "Status, a note and a task are visible to the person handling it."), "advisora"],
              ].map(([title, body, site]) => (
                <article className="sol-card" key={title}>
                  <div>
                    <h3 style={{ fontSize: "clamp(28px, 3vw, 44px)" }}>{title}</h3>
                    <p>{body}</p>
                    <p>{t("החבילה העסקית כוללת CRM, יומן, אוטומציות ו־AI. אתר הוא חבילה נפרדת או תוספת.", "The business plan includes CRM, calendar, automations and AI. A website is a separate package or an add-on.")}</p>
                  </div>
                  <img src={`/demo-media/home/sites/${site}-${locale === "he" ? "he" : "en"}-desk.webp`} alt="" />
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="sc sc-trip" data-scene>
        <div className="sc-pin">
          <div className="sc-wrap">
            <h2>{t("מהפנייה הראשונה ועד המשך הטיפול.", "From the first enquiry through the next step.")}</h2>
            <p>{t("אותה לקוחה, נועה לוי, עוברת בין המוצרים בלי להעתיק את הפרטים. כל שלב נשמר על הכרטיס.", "The same customer, Noa Levi, moves through the products without the details being copied by hand. Each step stays on the card.")}</p>
            <div className="trip">
              {[
                ["01", t("לחיצה על מודעה", "Ad click"), t("Meta Lead Ads, קמפיין מיתוג, 25.11 בשעה 09:12.", "Meta Lead Ads, branding campaign, 25 Nov at 09:12.")],
                ["02", t("ליד בלוח", "Lead on the board"), t("סטטוס חדש, טלפון 052-448-2190, תגית מיתוג.", "Status New, phone 052-448-2190, branding tag.")],
                ["03", t("עדכון סטטוס", "Status update"), t("אחרי השיחה הראשונה הסטטוס עובר לנוצר קשר.", "After the first reply the status moves to Contacted.")],
                ["04", "WhatsApp", t("התשובה נשמרת בשיחה המשויכת לכרטיס.", "The reply stays in the thread linked to the card.")],
                ["05", t("משימה", "Task"), t("26.11, 10:30, לחזור אחרי שיחת האפיון.", "26 Nov, 10:30, call back after the briefing.")],
                ["06", t("פגישה", "Meeting"), t("45 דקות ביומן, על אותו לקוח.", "45 minutes on the calendar, on the same customer.")],
              ].map(([num, title, body], index) => (
                <article className="step" style={{ ["--i" as string]: index }} key={num}>
                  <small>{num}</small>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="sc sc-int" data-scene>
        <div className="sc-pin">
          <div className="sc-wrap">
            <h2>{t("החיבורים שעובדים היום.", "The connections that work today.")}</h2>
            <div className="orbit">
              <article className="hub">
                <h3>Bizuply</h3>
                <p>{t("הליד נפתח ב־CRM עם המקור, והמשך הטיפול נשאר שם.", "The lead opens in the CRM with its source, and the follow-up stays there.")}</p>
              </article>
              <article className="sat sat-a"><h3>Meta Lead Ads</h3><p>{t("טופס לידים מהמודעה נכנס עם שם המודעה.", "The lead form from the ad arrives with the ad name.")}</p></article>
              <article className="sat sat-b"><h3>Google Ads</h3><p>{t("טופס לידים של גוגל נכנס לאותו לוח.", "A Google lead form enters the same board.")}</p></article>
              <article className="sat sat-c"><h3>{t("טופס באתר", "Site form")}</h3><p>{t("טופס באתר Bizuply נפתח כליד.", "A form on a Bizuply site opens as a lead.")}</p></article>
              <article className="sat sat-d"><h3>WhatsApp Cloud API</h3><p>{t("השיחה משויכת לכרטיס. 29$ לחודש למספר.", "The thread is linked to the card. $29 per month per number.")}</p></article>
            </div>
          </div>
        </div>
      </section>

      <section className="sc sc-price" data-scene>
        <div className="sc-pin">
          <div className="sc-wrap">
            <h2>{t("הפתרון שמתאים לעסק שלכם.", "The fit for the business.")}</h2>
            <p>{t("המחירים מתוך הקטלוג המפורסם. חבילה עסקית אינה כוללת אתר. אתר בלבד אינו כולל את מערכת ה־CRM המלאה.", "Prices are the published catalog. A business plan does not include a website. Website only does not include the full CRM.")}</p>
            <div className="plans">
              {PRICING_PAGE_PACKAGES.map((plan, index) => (
                <article className="plan" style={{ ["--i" as string]: index }} key={plan.type}>
                  <h3>{locale === "he" ? plan.nameHe : plan.nameEn}</h3>
                  <b>${plan.price}</b>
                  <span>{locale === "he" ? plan.pricePeriodHe : plan.pricePeriodEn}</span>
                  <ul>{(locale === "he" ? plan.featuresHe : plan.featuresEn).slice(0, 4).map((feature) => <li key={feature}>{feature}</li>)}</ul>
                </article>
              ))}
            </div>
            <Link className="sh-go" to="/pricing">{t("לכל המחירים", "See pricing")}</Link>
          </div>
        </div>
      </section>

      <section className="sc sc-part" data-scene>
        <div className="sc-pin">
          <div className="sc-wrap part">
            <div className="part-photo"><img src={screen("dashboard")} alt="" /></div>
            <div>
              <h2>{t("הזדמנויות גדולות מתחילות בשיתוף פעולה.", "Big opportunities start with a partnership.")}</h2>
              <p>{t("אחרי אישור, הסכם חתום ותשלום שאומת, חברות Business Partner פותחת את מרכז השותפים. העמלה היא על הכנסה זכאית שהתקבלה בפועל. אין כאן קוד מקור, White Label, טריטוריה בלעדית או הבטחת הכנסה.", "After approval, a signed agreement and a verified payment, Business Partner membership opens the partner center. Commission is on eligible revenue actually received. There is no source code, white label, exclusive territory or income guarantee.")}</p>
              <p>{t("מסלול Affiliate הוא מינוי אחר, בלי דמי חברות. שליחת טופס אינה מאשרת את השותפות.", "Affiliate is a different track, without a membership fee. Sending the form does not approve the partnership.")}</p>
              <Link className="sh-go" to="/partners">{t("לתוכנית השותפים", "Partner program")}</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="sc sc-mag" data-scene>
        <div className="sc-pin">
          <div className="sc-wrap">
            <h2>{t("ידע שעוזר לעסק להתקדם.", "Knowledge that helps the business move.")}</h2>
            <div className="mag">
              {guides.map((guide, index) => (
                <Link key={guide.slug} to={`/guides/${guide.slug}`} style={{ ["--i" as string]: index }}>{guide.article.h1}</Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="sc sc-faq" data-scene>
        <div className="sc-pin">
          <div className="sc-wrap">
            <h2>{t("כל מה שרציתם לדעת.", "What people ask before they start.")}</h2>
            {faqs.map(([question, answer], index) => (
              <details key={question} open={openFaq === index} onToggle={(event) => { if (event.currentTarget.open) setOpenFaq(index); }}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="sc sc-end" data-scene>
        <div className="sc-pin">
          <div className="end-shapes" aria-hidden="true"><span /><span /></div>
          <div className="sc-wrap end-in">
            <h2>{t("הגיע הזמן לקחת את העסק שלכם קדימה.", "It’s time to move the business forward.")}</h2>
            <p>{t("אפשר להתחיל לבד, או לקבוע הדגמה ולראות את הלוח, השיחה והיומן על אותו לקוח.", "Start on your own, or book a demo and see the board, the thread and the calendar on the same customer.")}</p>
            <Link className="sh-go" to="/register">{t("התחילו בחינם", "Start for free")}</Link>
            <Link className="sh-go" to="/contact">{t("קבעו הדגמה אישית", "Schedule a personal demo")}</Link>
          </div>
          <div className="navy-join" />
        </div>
      </section>
    </div>
  );
}
