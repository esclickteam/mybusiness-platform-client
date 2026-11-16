import { useEffect, useRef, useState, type ReactElement } from "react";
import { Helmet } from "react-helmet-async";
import "./demoUxSketches.css";

type Sketch = {
  id: string;
  title: string;
  line: string;
  change: string;
  Screen: () => ReactElement;
};

function DashboardScreen() {
  const bars = [8, 12, 9, 15, 11, 18, 13];
  return (
    <div className="ux-screen">
      <div className="ux-metrics">
        <article><span>לידים חדשים</span><strong>13</strong><em>השבוע</em></article>
        <article><span>פגישות</span><strong>4</strong><em>קרובות</em></article>
        <article><span>WhatsApp</span><strong>28</strong><em>נשלחו</em></article>
        <article><span>המרה</span><strong>18%</strong><em>מליד לפגישה</em></article>
      </div>
      <div className="ux-panel">
        <p>לידים לפי יום</p>
        <div className="ux-bars" aria-hidden="true">
          {bars.map((value, index) => <i key={index} style={{ height: `${value * 4}px` }} />)}
        </div>
      </div>
      <ul className="ux-feed">
        <li><b>תמר לוי</b><span>ליד חדש מ־Meta</span></li>
        <li><b>הילה גולן</b><span>פגישה מחר ב־11:00</span></li>
      </ul>
    </div>
  );
}

function CrmScreen() {
  return (
    <div className="ux-screen">
      <div className="ux-pills">
        <span>חדש 6</span>
        <span>בטיפול 4</span>
        <span>פגישה 2</span>
      </div>
      <article className="ux-lead is-open">
        <header><strong>תמר לוי</strong><em>חדש</em></header>
        <p>052-5552266</p>
        <p>tamar.levi@example.com</p>
        <footer><span>Meta</span><span>ליד</span></footer>
      </article>
      <article className="ux-lead">
        <header><strong>הילה גולן</strong><em>בטיפול</em></header>
        <p>050-5550111 · שיחת היכרות</p>
      </article>
    </div>
  );
}

function WhatsAppScreen() {
  return (
    <div className="ux-screen ux-chat">
      <header className="ux-chat-top">
        <strong>תמר לוי</strong>
        <span>052-5552266</span>
      </header>
      <div className="ux-bubble is-out">שלום תמר, ראינו את הפנייה מ־Meta. נוח לך מחר ב־10:30?</div>
      <div className="ux-bubble">כן, מתאים. תודה.</div>
      <p className="ux-sent">נשלחה · 21:29</p>
      <div className="ux-reply">תשובה ללקוח</div>
    </div>
  );
}

function AutomationScreen() {
  return (
    <div className="ux-screen ux-flow">
      <article><small>טריגר</small><strong>ליד חדש</strong><span>נכנס ל־CRM</span></article>
      <i />
      <article><small>תנאי</small><strong>המקור הוא Meta</strong><span>רק לידים מהקמפיין</span></article>
      <i />
      <article><small>פעולה</small><strong>משימת מעקב</strong><span>לנציג, תוך 24 שעות</span></article>
      <i />
      <article><small>פעולה</small><strong>תבנית WhatsApp</strong><span>הודעת פתיחה ללקוח</span></article>
    </div>
  );
}

function MetaScreen() {
  const bars = [6, 9, 8, 12, 10, 14, 11];
  return (
    <div className="ux-screen">
      <header className="ux-campaign"><strong>Facebook leads</strong><em>פעיל</em></header>
      <div className="ux-metrics">
        <article><span>הוצאה</span><strong>₪2,171</strong></article>
        <article><span>חשיפות</span><strong>18,211</strong></article>
        <article><span>הקלקות</span><strong>11,291</strong></article>
        <article><span>CTR</span><strong>2.4%</strong></article>
      </div>
      <div className="ux-panel">
        <p>לידים מהקמפיין</p>
        <div className="ux-bars" aria-hidden="true">
          {bars.map((value, index) => <i key={index} style={{ height: `${value * 4}px` }} />)}
        </div>
      </div>
    </div>
  );
}

function SiteScreen() {
  return (
    <div className="ux-screen">
      <div className="ux-editor">
        <span>עריכה</span>
        <span className="is-on">תצוגה</span>
        <span>גלריה</span>
      </div>
      <article className="ux-site">
        <p>סטודיו נועה</p>
        <strong>חוויות מותאמות לעסק</strong>
        <button type="button">קביעת פגישה</button>
      </article>
      <p className="ux-template">תבנית Spalcio · עמוד הבית</p>
    </div>
  );
}

const SKETCHES: Sketch[] = [
  {
    id: "dash",
    title: "לוח בקרה",
    line: "Business Dashboard",
    change: "במקום כרטיסי מדד חתוכים, ארבעה מספרים ברורים, גרף לידים שבועי ושתי פעולות אחרונות. אלה נתונים שכבר מופיעים בלוח הבקרה.",
    Screen: DashboardScreen,
  },
  {
    id: "crm",
    title: "CRM",
    line: "לידים ולקוחות",
    change: "צינור קצר לפי סטטוס, וכרטיס ליד פתוח עם שם, טלפון, אימייל ומקור. בלי טבלה שנחתכת במובייל.",
    Screen: CrmScreen,
  },
  {
    id: "wa",
    title: "WhatsApp",
    line: "שיחה פתוחה",
    change: "השיחה עצמה במרכז: הודעה יוצאת, תשובת הלקוח, סטטוס שליחה ושדה תשובה. זה מסך תיבת הדואר, לא רשימת מספרים.",
    Screen: WhatsAppScreen,
  },
  {
    id: "auto",
    title: "אוטומציה",
    line: "טריגר, תנאי ופעולות",
    change: "תהליך אחד קריא מלמעלה למטה: ליד חדש, תנאי לפי מקור Meta, משימת מעקב ותבנית WhatsApp. אלה צמתים שקיימים בעורך.",
    Screen: AutomationScreen,
  },
  {
    id: "meta",
    title: "קמפיינים",
    line: "Meta Campaigns",
    change: "קמפיין פעיל עם הוצאה, חשיפות, הקלקות ו־CTR, וגרף לידים. בלי טבלת עמודות שנחתכת.",
    Screen: MetaScreen,
  },
  {
    id: "site",
    title: "בניית אתר",
    line: "Website Builder",
    change: "תצוגת האתר המוכן לצד מצבי העריכה, התצוגה והגלריה. לא קטלוג תבניות מרוחק.",
    Screen: SiteScreen,
  },
];

function CarouselWindow({ sketch }: { sketch: Sketch }) {
  const Screen = sketch.Screen;
  const viewRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.64);
  useEffect(() => {
    const view = viewRef.current;
    const scaled = scaleRef.current;
    const screen = scaled?.querySelector<HTMLElement>(".ux-screen");
    if (!view || !screen) return;
    const apply = () => {
      const next = Math.min(view.clientWidth / screen.offsetWidth, view.clientHeight / screen.offsetHeight);
      setScale(Number.isFinite(next) && next > 0 ? next : 0.64);
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(screen);
    observer.observe(view);
    return () => observer.disconnect();
  }, [sketch.id]);
  return (
    <div className="ux-inset">
      <article className="ux-window">
        <header>
          <span><i /><i /><i /></span>
          <strong>{sketch.title}</strong>
        </header>
        <div className="ux-window-view" ref={viewRef}>
          <div className="ux-window-scale" ref={scaleRef} style={{ transform: `translateX(-50%) scale(${scale})` }}>
            <Screen />
          </div>
        </div>
      </article>
      <p>{sketch.title}</p>
    </div>
  );
}

export default function DemoUxSketches() {
  const [current, setCurrent] = useState(SKETCHES[0].id);
  const sketch = SKETCHES.find((item) => item.id === current) || SKETCHES[0];
  const Screen = sketch.Screen;
  return (
    <main className="ux-page" lang="he" dir="rtl">
      <Helmet>
        <title>סקיצות UX למסכי ההדגמה | BizUply</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <header className="ux-top">
        <p className="ux-brand">BizUply</p>
        <h1>שש סקיצות למסכי ההדגמה</h1>
        <p className="ux-note">הצעה לתוכן שבתוך החלונות. ההדגמה האופקית באתר לא השתנתה.</p>
        <div className="ux-switch" role="tablist" aria-label="בחירת מסך">
          {SKETCHES.map((item) => (
            <button key={item.id} type="button" role="tab" aria-selected={item.id === sketch.id} onClick={() => setCurrent(item.id)}>
              {item.title}
            </button>
          ))}
        </div>
      </header>
      <section className="ux-copy" aria-live="polite">
        <p className="ux-kicker">{sketch.line}</p>
        <h2>{sketch.title}</h2>
        <p>{sketch.change}</p>
      </section>
      <section className="ux-block" aria-label="המסך המלא">
        <h3>המסך המלא</h3>
        <Screen />
      </section>
      <section className="ux-block" aria-label="אותו מסך בתוך חלון הקרוסלה">
        <h3>בתוך חלון הקרוסלה</h3>
        <CarouselWindow sketch={sketch} />
      </section>
    </main>
  );
}
