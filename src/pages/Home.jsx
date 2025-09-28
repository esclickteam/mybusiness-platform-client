import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/home.css"; // אם לא תרצה/י קובץ חדש – ראו הערה בסוף

export default function Home() {
  // קריאה/שמירה של שפה בלוקאל-סטורג'
  const [lang, setLang] = useState(
    () => localStorage.getItem("lang") || "he"
  );
  const isHeb = lang === "he";

  useEffect(() => {
    localStorage.setItem("lang", lang);
    // עדכון כיוון המסמך
    document.documentElement.dir = isHeb ? "rtl" : "ltr";
    document.documentElement.lang = isHeb ? "he" : "en";
  }, [lang, isHeb]);

  const t = useMemo(() => ({
    he: {
      brand: "עסקליק",
      subhero: "כל מה שהעסק שלך צריך — ניהול חכם, שיתופי פעולה והזדמנויות חדשות במקום אחד.",
      ctaPrimary: "התחילו בחינם",
      ctaSecondary: "צפו איך זה עובד",
      miniLogos: "אלפי בעלים קטנים ובינוניים כבר הצטרפו.",
      // כרטיסים ליתרונות
      cards: [
        {
          title: "בעל/ת עסק?",
          body: "השתמש/י בעסקליק לניהול פגישות, הודעות, לקוחות ושיתופי פעולה — בפחות זמן, עם יותר שליטה.",
          cta: "התחילו בחינם ל-14 יום",
          to: "/register",
          badge: "ללא כרטיס אשראי"
        },
        {
          title: "איך זה עובד?",
          body: "יצירת עמוד עסקי, פתיחת יומן, ניהול לקוחות ושיגור אוטומציות — הכול מהדשבורד.",
          cta: "הדגמה קצרה",
          to: "/business/demo",
          badge: "2 דקות צפייה"
        },
        {
          title: "קצת עלינו",
          body: "עסקליק מחברת בין אנשים ועסקים — בנראות וביעילות. מחדדת תהליכים, מגדילה הזדמנויות.",
          cta: "קראו עוד",
          to: "/about",
          badge: "מי אנחנו"
        }
      ],
      // איך זה עובד
      howTitle: "איך זה עובד?",
      howSteps: [
        { title: "פותחים חשבון", desc: "נרשמים תוך דקה ומקבלים דשבורד אישי." },
        { title: "בונים עמוד עסקי", desc: "מוסיפים שירותים, שעות פעילות ותמונות." },
        { title: "מפעילים יומן והודעות", desc: "ניהול פגישות, תורים ושיחות מול לקוחות." },
        { title: "AI שעוזר לגדול", desc: "המלצות פעולה אוטומטיות ושיתופי פעולה חכמים." }
      ],
      featuresTitle: "למה עסקליק?",
      features: [
        { k: "appointments", title: "ניהול פגישות", desc: "יומן חכם, ביטולים/תזכורות, סנכרון קל." },
        { k: "messages", title: "מרכז הודעות", desc: "כל השיחות במקום אחד — עם אוטומציות." },
        { k: "crm", title: "CRM קליל", desc: "לקוחות, היסטוריה, תיוגים ומשימות." },
        { k: "insights", title: "תובנות ו-AI", desc: "פעולות מומלצות לשיפור תוצאות." },
      ],
      testimonialsTitle: "מה לקוחות אומרים",
      testimonials: [
        { name: "אורית, מאמנת", text: "סוף-סוף מערכת אחת שעושה סדר. החזרתי זמן לעצמי." },
        { name: "אלון, מעצב", text: "קבענו יותר פגישות תוך שבועיים. ה-AI נותן הצעות בול." },
        { name: "הדס, קליניקה", text: "ההודעות והיומן מחוברים — הלקוחות מרוצים ואני רגועה." },
      ],
      faqTitle: "שאלות נפוצות",
      faq: [
        { q: "האם יש ניסיון חינם?", a: "כן. 14 ימים ללא צורך בכרטיס אשראי." },
        { q: "אפשר לעבוד גם במובייל?", a: "ברור. האתר רספונסיבי לחלוטין ותומך בכל המכשירים." },
        { q: "איך מתחילים?", a: "נרשמים, עוברים מדריך קצר, ומתחילים לעבוד תוך דקות." },
        { q: "האם יש תמיכה?", a: "כן. מרכז עזרה, מדריכים וצ'אט תמיכה." },
      ],
      pricingTeaser: { title: "כמה זה עולה?", desc: "התחלה חינם. תכניות מתקדמות במחירים הוגנים כשאתם גדלים.", cta: "ראו מחירים" },
      footer: {
        links: ["איך זה עובד", "שאלות נפוצות", "תמיכה", "תנאי שימוש", "פרטיות"],
        rights: "© כל הזכויות שמורות עסקליק"
      },
      langToggle: "English"
    },
    en: {
      brand: "Esclick",
      subhero: "Everything your business needs — smart management, collaborations, and new opportunities in one place.",
      ctaPrimary: "Start Free",
      ctaSecondary: "See How It Works",
      miniLogos: "Trusted by thousands of small & mid businesses.",
      cards: [
        {
          title: "Business Owner?",
          body: "Use Esclick to run bookings, messages, clients and partnerships — less hassle, more control.",
          cta: "Start 14-day Free Trial",
          to: "/register",
          badge: "No credit card"
        },
        {
          title: "How does it work?",
          body: "Create a business page, open your calendar, manage clients and launch automations — all in one dashboard.",
          cta: "Watch Demo",
          to: "/business/demo",
          badge: "2-minute video"
        },
        {
          title: "About us",
          body: "Esclick connects people and businesses — clearer processes, more opportunities.",
          cta: "Read more",
          to: "/about",
          badge: "Who we are"
        }
      ],
      howTitle: "How it works",
      howSteps: [
        { title: "Create account", desc: "Sign up in under a minute and get your dashboard." },
        { title: "Build your page", desc: "Add services, hours and images." },
        { title: "Enable calendar & chat", desc: "Manage bookings, queues and customer chats." },
        { title: "AI to grow", desc: "Suggested actions & smart collaborations." }
      ],
      featuresTitle: "Why Esclick?",
      features: [
        { k: "appointments", title: "Bookings", desc: "Smart calendar, reminders & cancellations." },
        { k: "messages", title: "Message Hub", desc: "All conversations in one place with automations." },
        { k: "crm", title: "Light CRM", desc: "Clients, history, tags and tasks." },
        { k: "insights", title: "Insights & AI", desc: "Recommended actions to improve results." },
      ],
      testimonialsTitle: "What customers say",
      testimonials: [
        { name: "Or, Coach", text: "Finally one system that brings order. I got my time back." },
        { name: "Alon, Designer", text: "More bookings within two weeks. AI suggestions are spot on." },
        { name: "Hadas, Clinic", text: "Messages and calendar connected — clients are happy and I’m calm." },
      ],
      faqTitle: "FAQ",
      faq: [
        { q: "Is there a free trial?", a: "Yes. 14 days, no credit card required." },
        { q: "Mobile friendly?", a: "Absolutely. Fully responsive on all devices." },
        { q: "How do I start?", a: "Sign up, follow the quick guide and you’re ready in minutes." },
        { q: "Support?", a: "Yes. Help Center, guides and chat support." },
      ],
      pricingTeaser: { title: "Pricing", desc: "Start free. Fair plans as you grow.", cta: "See pricing" },
      footer: {
        links: ["How it works", "FAQ", "Support", "Terms", "Privacy"],
        rights: "© Esclick. All rights reserved."
      },
      langToggle: "עברית"
    }
  })[lang], [lang]);

  const navigate = useNavigate();

  return (
    <div className="home-root" dir={isHeb ? "rtl" : "ltr"}>
      {/* Header bar */}
      <header className="home-topbar">
        <div className="home-brand">
          <img src="/logo192.png" alt={t.brand} />
          <span>{t.brand}</span>
        </div>
        <div className="home-actions">
          <button className="btn ghost" onClick={() => setLang(isHeb ? "en" : "he")}>
            {t.langToggle}
          </button>
          <Link className="btn" to="/login">{isHeb ? "התחברות" : "Log in"}</Link>
          <Link className="btn primary" to="/register">{t.ctaPrimary}</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="home-hero">
        <h1 className="home-title">{t.brand}</h1>
        <p className="home-sub">{t.subhero}</p>
        <div className="home-ctas">
          <Link to="/register" className="btn primary lg">{t.ctaPrimary}</Link>
          <Link to="/business/demo" className="btn outline lg">{t.ctaSecondary}</Link>
        </div>
        <p className="home-trust">{t.miniLogos}</p>
      </section>

      {/* Three cards */}
      <section className="home-cards">
        {t.cards.map((c,i)=>(
          <article key={i} className="home-card">
            <div className="badge">{c.badge}</div>
            <h3>{c.title}</h3>
            <p>{c.body}</p>
            <Link to={c.to} className="btn soft">{c.cta}</Link>
          </article>
        ))}
      </section>

      {/* Features */}
      <section className="home-features">
        <h2>{t.featuresTitle}</h2>
        <div className="features-grid">
          {t.features.map((f)=>(
            <div key={f.k} className="feature">
              <div className="ico" aria-hidden>★</div>
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="home-how">
        <h2>{t.howTitle}</h2>
        <ol className="how-steps">
          {t.howSteps.map((s,idx)=>(
            <li key={idx}>
              <span className="num">{idx+1}</span>
              <div>
                <h5>{s.title}</h5>
                <p>{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Testimonials */}
      <section className="home-testimonials">
        <h2>{t.testimonialsTitle}</h2>
        <div className="testi-grid">
          {t.testimonials.map((tm,i)=>(
            <blockquote key={i} className="testi">
              <p>“{tm.text}”</p>
              <footer>— {tm.name}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="home-pricing">
        <div className="pricing-card">
          <h3>{t.pricingTeaser.title}</h3>
          <p>{t.pricingTeaser.desc}</p>
          <Link to="/pricing" className="btn primary">{t.pricingTeaser.cta}</Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="home-faq">
        <h2>{t.faqTitle}</h2>
        <div className="faq-list">
          {t.faq.map((item, i)=>(
            <details key={i} className="faq-item">
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <nav className="foot-links">
          {t.footer.links.map((l,i)=>(
            <Link key={i} to={["/how","/faq","/help","/terms","/privacy"][i] || "/"}>{l}</Link>
          ))}
        </nav>
        <div className="copy">{t.footer.rights}</div>
      </footer>
    </div>
  );
}
