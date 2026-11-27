import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { marketingPublicUrl, withMarketingLocale } from "../../lib/localePath.mjs";
import "./howItWorksExperience.css";

const COPY = {
  he: {
    title: "איך BizUply עובדת? כל העסק בסביבה אחת | BizUply",
    description: "גלו כיצד BizUply מחברת בין שיווק, לידים, לקוחות, WhatsApp, מכירות ואוטומציות, משלב הפנייה הראשונה ועד לניהול הפעילות העסקית.",
    h1: "כך BizUply הופכת את ניהול העסק לפשוט יותר",
    sub: "מהפנייה הראשונה ועד לניהול מערכת יחסים מתמשכת עם הלקוח – כל העסק עובד בסביבה אחת מחוברת.",
    hero: "BizUply מחברת בין ניהול לקוחות, שיווק, מכירות, תקשורת, אוטומציות ותפעול עסקי. במקום לעבור בין מערכות שונות, אפשר לבנות סביבת עבודה לפי צורכי העסק ולנהל את הפעילות ממקום אחד. מה שכלול תלוי בחבילה ובחיבורים שהוגדרו.",
    start: "התחילו עכשיו",
    platform: "הכירו את הפלטפורמה",
    demo: "קבעו הדגמה",
    plans: "השוו בין החבילות",
    open: "לעמוד המוצר",
    s2: "מערכת אחת שמחברת בין כל חלקי העסק",
    s2b: "BizUply היא פלטפורמת SaaS לניהול עסקים. המידע שנקלט דרך כלים מחוברים יכול להמשיך לעבודה במערכת, כך שהפעילות אינה מסתיימת בקבלת ליד או בשליחת הודעה.",
    flow: ["מקורות שיווק ופניות", "קליטת מידע", "ניהול לקוחות", "תקשורת ומכירות", "משימות ואוטומציות", "שירות ומעקב", "נתונים עסקיים"],
    stages: [
      ["שלב 1: מגדירים את העסק ואת סביבת העבודה", "אחרי פתיחת החשבון מגדירים את פרטי העסק, בוחרים מודולים ומחברים שירותים נתמכים. עסק עם צוות יכול להגדיר משתמשים והרשאות לפי התפקידים שהחבילה מאפשרת.", "dashboard"],
      ["שלב 2: מחברים את השיווק ואת מקורות הפניות", "טופס באתר, טופס לידים של Meta וטופס Google Ads נתמך יכולים לפתוח ליד עם מקור, כשהחיבור וההרשאות פעילים. הוצאת המדיה נשארת אצל Meta או Google.", "campaigns"],
      ["שלב 3: מנהלים לידים, לקוחות ותהליכי מכירה", "ה-CRM שומר כרטיס לקוח, סטטוס, הערות ומשימות. הסטטוסים במערכת הם חדש, נוצר קשר, מתעניין, הומר, אבד וישן.", "crm-card"],
      ["שלב 4: מנהלים תקשורת עם WhatsApp Business API", "החיבור הוא לממשק הרשמי. שיחה יכולה להיות משויכת ללקוח. הודעות נשלחות לפי תבניות מאושרות, הרשאות ומגבלות Meta. אין הודעות ללא הגבלה, וחיובי Meta נפרדים.", "whatsapp"],
      ["שלב 5: מנהלים פעילות שיווקית כחלק מהתהליך", "אחרי חיבור חשבון המודעות אפשר לערוך קמפיינים של Meta מתוך BizUply. הליד הנתמך ממשיך לטיפול ב-CRM. BizUply אינה מחליפה את מנהל המודעות.", "campaigns"],
      ["שלב 6: הופכים פעולות חוזרות לתהליכים אוטומטיים", "בחבילה העסקית העורך בנוי מאירוע, תנאי ופעולה שקיימים במערכת. לדוגמה: ליד חדש יוצר משימת טיפול, או שינוי סטטוס מפעיל פעולה שהוגדרה.", "automation"],
      ["שלב 7: מנהלים משימות, יומן ופגישות", "יומן הפגישות הוא חלק מהחבילה העסקית, לא המוצר היחיד. אפשר לשייך משימה או פגישה לאדם שכבר קיים ברשומה.", "dashboard"],
      ["שלב 8: מחברים את האתר לניהול הלקוחות", "בונה האתרים יוצר נוכחות דיגיטלית, וטופס באתר יכול להמשיך כליד. האתר מתומחר בנפרד ואינו חלק ממוצר ה-CRM.", "crm-list"],
    ],
    aiTitle: "שלב 9: משלבים כלי בינה מלאכותית שקיימים בחשבון",
    ai: "בתוך המערכת קיימים כלי AI לפי החבילה, לצד משימות והערות. הם מסייעים בעבודה. הם אינם מנהלים את העסק במקום הצוות ואינם מקבלים החלטות במקומו.",
    teamTitle: "שלב 10: מאפשרים לצוות לעבוד לפי הרשאות",
    team: "כשיש כמה משתמשים, הגישה למידע ולפעולות נקבעת לפי התפקידים שהחבילה תומכת בהם. כך אפשר להגדיר מי מטפל בלקוח ומי רואה מה.",
    dataTitle: "שלב 11: מבינים מה קורה בעסק מתוך מה שהמערכת שומרת",
    data: "מסכי הניהול מציגים את הפניות, הסטטוסים והפעילות שנשמרו. BizUply אינה מפרסמת שיעורי הצלחה או חיסכון.",
    dayTitle: "כך נראה יום עבודה בעסק שמחובר ל-BizUply",
    day: [
      ["חשיפה", "לקוח פוטנציאלי נחשף לקמפיין או לאתר."],
      ["פנייה", "הוא משאיר פרטים בטופס מחובר."],
      ["קליטה", "הפנייה נפתחת כליד עם מקור."],
      ["טיפול", "העסק מעדכן סטטוס ומתעד את הפעולה."],
      ["המשך", "נוצרת משימה או נקבעת פגישה, לפי החבילה."],
      ["אוטומציה", "אם הוגדר תהליך, האירוע מפעיל את הפעולה."],
    ],
    fitTitle: "סביבת עבודה אחת, שמתאימה לסוגים שונים של עסקים",
    fits: [
      ["עסקי שירות", "מעקב אחר פניות, תקשורת ותיאום פגישות.", "/solutions/service-businesses"],
      ["סוכנויות", "שיווק יחד עם קליטת לידים ותהליך טיפול.", "/solutions/agencies"],
      ["קליניקות", "לקוחות, תורים ותזכורות. לא מערכת לרשומות רפואיות.", "/solutions/clinics"],
      ["מכוני יופי", "יומן, לקוחות ותקשורת עסקית.", "/solutions/beauty"],
      ["נדל״ן", "פניות, מתעניינים ופגישות.", "/solutions/real-estate"],
      ["עסקים מבוססי לידים", "חיבור בין מקור הפנייה לבין המשך הטיפול.", "/solutions/lead-based"],
    ],
    whyTitle: "פחות מעבר בין מערכות. יותר המשכיות בעבודה.",
    why: "כשהמידע מפוזר, קשה לעקוב אחרי הלקוח. BizUply נועדה לחבר כלים נתמכים כך שפנייה, שיחה ומשימה יוכלו להמשיך על אותה רשומה. אין כאן הבטחה לחיסכון באחוזים.",
    faqTitle: "שאלות נפוצות",
    faq: [
      ["מה זה BizUply?", "פלטפורמת SaaS לניהול עסקים, עם כלים ללקוחות, שיווק, מכירות, תקשורת ואוטומציות בסביבה אחת. הזמינות תלויה בחבילה."],
      ["איך מתחילים?", "פותחים חשבון, בוחרים חבילה, מגדירים את סביבת העבודה ומחברים את השירותים הרלוונטיים."],
      ["האם BizUply היא רק מערכת CRM?", "לא. CRM הוא אחד המודולים. יש גם שיווק, תקשורת, אוטומציות, אתרים ומשימות, לפי החבילה."],
      ["האם אפשר לחבר WhatsApp Business API?", "כן, לממשק הרשמי, בכפוף לדרישות Meta, להרשאות ולתבניות מאושרות."],
      ["האם אפשר לנהל קמפיינים?", "אפשר לערוך קמפיינים של Meta אחרי חיבור חשבון המודעות. המדיה מחויבת בנפרד."],
      ["האם אפשר לקלוט לידים מ-Facebook ומ-Instagram?", "כן, ממקורות Meta נתמכים אחרי חיבור החשבון וההרשאות."],
      ["האם זה מתאים לעסק קטן?", "כן. אפשר להתחיל במודולים הנדרשים ולהרחיב לפי החבילות הקיימות."],
      ["האם אפשר להשתמש רק בחלק מהכלים?", "כן. בוחרים סביבה ומודולים לפי המסלול."],
      ["האם אפשר לבנות אתר?", "יש בונה אתרים במחיר שנתי נפרד. טופס באתר יכול להמשיך כליד."],
      ["האם אפשר להגדיר אוטומציות?", "בחבילה העסקית, מתוך הטריגרים, התנאים והפעולות הנתמכים."],
      ["האם זה מתאים לצוות?", "יש ניהול משתמשים והרשאות לפי המודולים והחבילה."],
      ["כמה זה עולה?", "לפי החבילה. המחירים המעודכנים נמצאים בעמוד החבילות."],
      ["האם נדרש ידע טכני?", "השימוש עסקי. חיבורים חיצוניים עשויים לדרוש הרשאות ואימות אצל השירות המחובר."],
    ],
    end: "הגיע הזמן לחבר את כל חלקי העסק",
    endb: "הכירו את סביבת העבודה, בחרו את הכלים שמתאימים לעסק והתחילו לנהל את הפעילות בצורה מחוברת.",
  },
  en: {
    title: "How BizUply Works | Connected Business Management",
    description: "Discover how BizUply connects marketing, leads, customer management, WhatsApp, sales and automation into one connected business workflow.",
    h1: "How BizUply makes running a business simpler",
    sub: "From the first inquiry to an ongoing customer relationship, the work stays in one connected workspace.",
    hero: "BizUply connects customer management, marketing, sales, communication, automation and day-to-day operations. Instead of moving between separate systems, a business can shape one workspace around its own work. What is included depends on the plan and the connections.",
    start: "Get Started",
    platform: "See the platform",
    demo: "Book a demo",
    plans: "Compare plans",
    open: "Open the product page",
    s2: "One system that connects the business",
    s2b: "BizUply is a SaaS platform for running a business. Information that arrives through a connected tool can continue inside the workspace, so the work does not stop at a new lead or a sent message.",
    flow: ["Marketing and inquiries", "Capture", "Customer management", "Communication and sales", "Tasks and automation", "Service and follow-up", "Business data"],
    stages: [
      ["Step 1: Set up the business workspace", "After the account is opened, the business details, modules and supported services are set up. A team can add users and roles that the plan supports.", "dashboard"],
      ["Step 2: Connect marketing and inquiry sources", "A website form, a Meta lead form and a supported Google Ads form can open a lead with a source when the connection and permissions are active. Media spend stays with Meta or Google.", "campaigns"],
      ["Step 3: Manage leads, customers and sales", "The CRM keeps a customer card, a status, notes and tasks. The statuses are New, Contacted, Interested, Converted, Lost and Old.", "crm-card"],
      ["Step 4: Talk to customers with the WhatsApp Business API", "The connection uses the official interface. A thread can be linked to the customer. Messages follow approved templates, permissions and Meta limits. Messages are not unlimited, and Meta fees are separate.", "whatsapp"],
      ["Step 5: Keep marketing inside the same work", "After the ad account is connected, Meta campaigns can be edited in BizUply. A supported lead continues in the CRM. BizUply does not replace Meta Ads Manager.", "campaigns"],
      ["Step 6: Turn repeated work into automations", "On the business plan, the editor is an event, a condition and an action that exist in the product. A new lead can create a follow-up task, or a status change can run a defined action.", "automation"],
      ["Step 7: Manage tasks, the calendar and meetings", "The appointment calendar is part of the business plan, not the only product. A task or a meeting can be attached to a person already on the record.", "dashboard"],
      ["Step 8: Connect the website to customer management", "The website builder creates a digital presence, and a form on that site can continue as a lead. The website has its own yearly price and is not part of the CRM product.", "crm-list"],
    ],
    aiTitle: "Step 9: Use the AI tools that exist in the account",
    ai: "The product includes AI tools according to the plan, next to tasks and notes. They help with the work. They do not run the business instead of the team or make decisions for it.",
    teamTitle: "Step 10: Let a team work by permission",
    team: "When several people use the account, access to information and actions follows the roles the plan supports.",
    dataTitle: "Step 11: See what the system has actually stored",
    data: "Management screens show the inquiries, statuses and activity that were saved. BizUply does not publish success rates or savings.",
    dayTitle: "A working day in a business connected to BizUply",
    day: [
      ["Attention", "A potential customer sees a campaign or the website."],
      ["Inquiry", "They leave details on a connected form."],
      ["Capture", "The inquiry opens as a lead with a source."],
      ["Follow-up", "The business updates the status and records the action."],
      ["Next step", "A task or a meeting is created, according to the plan."],
      ["Automation", "If a process was defined, the event runs the action."],
    ],
    fitTitle: "One workspace for different kinds of businesses",
    fits: [
      ["Service businesses", "Inquiries, communication and meetings.", "/solutions/service-businesses"],
      ["Agencies", "Marketing together with lead handling.", "/solutions/agencies"],
      ["Clinics", "Customers, appointments and reminders. Not a medical-record system.", "/solutions/clinics"],
      ["Beauty studios", "A calendar, customers and business communication.", "/solutions/beauty"],
      ["Real estate", "Inquiries, interested people and meetings.", "/solutions/real-estate"],
      ["Lead-based businesses", "A source connected to the next step of the work.", "/solutions/lead-based"],
    ],
    whyTitle: "Less switching. More continuity.",
    why: "When information is scattered, the customer is harder to follow. BizUply connects supported tools so an inquiry, a conversation and a task can continue on the same record. There is no promised percentage of savings.",
    faqTitle: "Common questions",
    faq: [
      ["What is BizUply?", "A SaaS platform for running a business, with tools for customers, marketing, sales, communication and automation in one workspace. Availability depends on the plan."],
      ["How do you start?", "Open an account, choose a plan, set up the workspace and connect the relevant services."],
      ["Is BizUply only a CRM?", "No. CRM is one module. Marketing, communication, automation, websites and tasks are also available, according to the plan."],
      ["Can I connect the WhatsApp Business API?", "Yes, through the official interface, subject to Meta’s requirements, permissions and approved templates."],
      ["Can I manage campaigns?", "Meta campaigns can be edited after the ad account is connected. Media is billed separately."],
      ["Can leads come from Facebook and Instagram?", "Yes, from supported Meta sources after the account and permissions are connected."],
      ["Does it fit a small business?", "Yes. Start with the modules you need and expand through the available plans."],
      ["Can I use only some of the tools?", "Yes. The workspace and modules follow the selected plan."],
      ["Can I build a website?", "There is a website builder with its own yearly price. A form on that site can continue as a lead."],
      ["Can I set up automations?", "On the business plan, from the triggers, conditions and actions the editor supports."],
      ["Does it fit a team?", "User and permission management follows the modules and the plan."],
      ["What does it cost?", "It depends on the plan. Current prices are on the pricing page."],
      ["Do I need technical knowledge?", "The product is for business use. External connections may require permissions and verification with that service."],
    ],
    end: "Time to connect the work",
    endb: "Look at the workspace, choose the tools that fit the business, and run the work from one place.",
  },
};

function shot(language, name) {
  const folder = language === "he" ? "he" : "en";
  return `/demo-media/home/screens/${folder}-desktop-${name}.webp`;
}

export default function HowItWorksExperience({ language }: { language: "he" | "en" }) {
  const copy = COPY[language] || COPY.en;
  const href = (path) => withMarketingLocale(path, language);
  const [step, setStep] = useState(0);
  const canonical = marketingPublicUrl("/how-it-works", language);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const tick = () => {
      frame = 0;
      const node = document.getElementById("workday");
      if (!node) return;
      if (reduce) {
        setStep(copy.day.length - 1);
        return;
      }
      const vh = window.innerHeight || 800;
      const box = node.getBoundingClientRect();
      const range = Math.max(node.offsetHeight - vh * 0.62, 1);
      const p = Math.min(1, Math.max(0, (72 - box.top) / range));
      const last = copy.day.length - 1;
      const next = p >= 0.72 ? last : Math.min(last - 1, Math.floor((p / 0.72) * last));
      setStep((current) => (current === next ? current : next));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(tick);
    };
    tick();
    const area = document.querySelector(".app-scroll-area");
    window.addEventListener("scroll", onScroll, { passive: true });
    area?.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      area?.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [copy.day.length]);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: copy.faq.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <article className="hw" dir={language === "he" ? "rtl" : "ltr"} lang={language}>
      <Helmet>
        <title>{copy.title}</title>
        <meta name="description" content={copy.description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={copy.title} />
        <meta property="og:description" content={copy.description} />
        <meta property="og:url" content={canonical} />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <header className="hw-hero">
        <div className="hw-wrap hw-split">
          <div>
            <h1>{copy.h1}</h1>
            <p className="hw-sub">{copy.sub}</p>
            <p>{copy.hero}</p>
            <div className="hw-actions">
              <Link className="hw-btn" to={href("/register")}>{copy.start}</Link>
              <Link className="hw-btn hw-btn-ghost" to={href("/platform")}>{copy.platform}</Link>
            </div>
          </div>
          <figure>
            <img src={shot(language, "dashboard")} alt="" width="1440" height="900" />
          </figure>
        </div>
      </header>

      <section className="hw-band mint">
        <div className="hw-wrap">
          <h2>{copy.s2}</h2>
          <p>{copy.s2b}</p>
          <ol className="hw-flow">
            {copy.flow.map((item) => <li key={item}>{item}</li>)}
          </ol>
        </div>
      </section>

      {copy.stages.map(([title, body, image], index) => (
        <section key={title} className={index % 2 ? "hw-band pink" : "hw-band"}>
          <div className="hw-wrap hw-split">
            <div>
              <h2>{title}</h2>
              <p>{body}</p>
            </div>
            <figure>
              <img src={shot(language, image)} alt="" width="1440" height="900" loading="lazy" />
            </figure>
          </div>
        </section>
      ))}

      <section className="hw-band soft">
        <div className="hw-wrap hw-grid">
          <article>
            <h2>{copy.aiTitle}</h2>
            <p>{copy.ai}</p>
          </article>
          <article>
            <h2>{copy.teamTitle}</h2>
            <p>{copy.team}</p>
          </article>
          <article>
            <h2>{copy.dataTitle}</h2>
            <p>{copy.data}</p>
          </article>
        </div>
      </section>

      <section id="workday" className="hw-day">
        <div className="hw-pin">
          <div className="hw-wrap hw-split">
            <div>
              <h2>{copy.dayTitle}</h2>
              <ol>
                {copy.day.map(([title, body], index) => (
                  <li key={title} className={index === step ? "is-on" : ""}>
                    <strong>{title}</strong>
                    <span>{body}</span>
                  </li>
                ))}
              </ol>
            </div>
            <figure>
              <img src={shot(language, step < 3 ? "crm-list" : step < 5 ? "crm-card" : "automation")} alt="" width="1440" height="900" />
            </figure>
          </div>
        </div>
      </section>

      <section className="hw-band">
        <div className="hw-wrap">
          <h2>{copy.fitTitle}</h2>
          <div className="hw-fits">
            {copy.fits.map(([name, body, path]) => (
              <Link key={path} to={href(path)}>
                <h3>{name}</h3>
                <p>{body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="hw-band mint">
        <div className="hw-wrap">
          <h2>{copy.whyTitle}</h2>
          <p>{copy.why}</p>
          <Link to={href("/platform")}>{copy.platform}</Link>
        </div>
      </section>

      <section className="hw-band">
        <div className="hw-wrap hw-faq">
          <h2>{copy.faqTitle}</h2>
          {copy.faq.map(([q, a]) => (
            <details key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="hw-end">
        <div className="hw-wrap">
          <h2>{copy.end}</h2>
          <p>{copy.endb}</p>
          <div className="hw-actions">
            <Link className="hw-btn" to={href("/register")}>{copy.start}</Link>
            <Link className="hw-btn hw-btn-line" to={href("/contact")}>{copy.demo}</Link>
            <Link className="hw-btn hw-btn-line" to={href("/pricing")}>{copy.plans}</Link>
          </div>
        </div>
      </section>
    </article>
  );
}
