import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import referenceUrl from "./approved-reference.png";
import "./loginCompare.css";

type Lang = "en" | "he";

type Frame = {
  id: string;
  title: string;
  lang: Lang;
  x: number;
  y: number;
  w: number;
  h: number;
};

const FRAMES: Frame[] = [
  { id: "en-desktop", title: "Desktop — English (LTR)", lang: "en", x: 44, y: 84, w: 436, h: 615 },
  { id: "he-desktop", title: "Desktop — עברית (RTL)", lang: "he", x: 497, y: 84, w: 406, h: 615 },
  { id: "en-mobile", title: "Mobile — English", lang: "en", x: 939, y: 87, w: 267, h: 613 },
  { id: "he-mobile", title: "Mobile — עברית", lang: "he", x: 1240, y: 87, w: 269, h: 613 },
];

const COPY = {
  en: {
    title: "Welcome back",
    sub: "Sign in to your Bizuply workspace.",
    email: "Email",
    password: "Password",
    codeLink: "Use email code instead",
    passwordLink: "Use password instead",
    remember: "Remember me",
    forgot: "Forgot password?",
    signIn: "Sign in",
    noAccount: "Don't have an account yet?",
    signUp: "Sign up",
    or: "or",
    google: "Continue with Google",
    microsoft: "Continue with Microsoft",
    show: "Show password",
    hide: "Hide password",
  },
  he: {
    title: "ברוכים הבאים",
    sub: "התחברו לסביבת העבודה של Bizuply.",
    email: "אימייל",
    password: "סיסמה",
    codeLink: "התחברות באמצעות קוד למייל",
    passwordLink: "התחברות עם סיסמה",
    remember: "זכור אותי",
    forgot: "שכחתם סיסמה?",
    signIn: "התחברות",
    noAccount: "אין לכם חשבון?",
    signUp: "הרשמה",
    or: "or",
    google: "המשך עם Google",
    microsoft: "המשך עם Microsoft",
    show: "הצג סיסמה",
    hide: "הסתר סיסמה",
  },
} as const;

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 23 23" aria-hidden="true">
      <path fill="#F25022" d="M1 1h10v10H1z" />
      <path fill="#7FBA00" d="M12 1h10v10H12z" />
      <path fill="#00A4EF" d="M1 12h10v10H1z" />
      <path fill="#FFB900" d="M12 12h10v10H12z" />
    </svg>
  );
}

function ApprovedCard({ lang, compact }: { lang: Lang; compact: boolean }) {
  const copy = COPY[lang];
  const dir = lang === "he" ? "rtl" : "ltr";
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [codeMode, setCodeMode] = useState(false);

  return (
    <form className={compact ? "lcm-card is-compact" : "lcm-card"} dir={dir} onSubmit={(event) => event.preventDefault()}>
      <img className="lcm-logo" src="/logo-mark.svg" alt="BizUply" />
      <h3>{copy.title}</h3>
      <p className="lcm-sub">{copy.sub}</p>
      <label className="lcm-label" htmlFor={`${lang}-${compact}-email`}>{copy.email}</label>
      <div className="lcm-field">
        <Mail className="lcm-ico" size={16} aria-hidden="true" />
        <input
          id={`${lang}-${compact}-email`}
          name="email"
          type="email"
          autoComplete="email"
          dir="ltr"
          defaultValue="jane@company.com"
        />
      </div>
      {codeMode ? (
        <p className="lcm-sub" style={{ textAlign: "start", marginTop: 0 }}>
          {lang === "he"
            ? "נשלח קוד בן 6 ספרות אל jane@company.com."
            : "We'll send a 6-digit code to jane@company.com."}
        </p>
      ) : (
        <>
          <label className="lcm-label" htmlFor={`${lang}-${compact}-password`}>{copy.password}</label>
          <div className="lcm-field">
            <Lock className="lcm-ico" size={16} aria-hidden="true" />
            <input
              id={`${lang}-${compact}-password`}
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              dir="ltr"
              defaultValue="password12"
            />
            <button
              type="button"
              className="lcm-eye"
              aria-label={showPassword ? copy.hide : copy.show}
              onClick={() => setShowPassword((value) => !value)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </>
      )}
      <button type="button" className="lcm-code" onClick={() => setCodeMode((value) => !value)}>
        {codeMode ? copy.passwordLink : copy.codeLink}
      </button>
      <div className="lcm-row">
        <label className="lcm-check">
          <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />
          {copy.remember}
        </label>
        <Link to="/forgot-password">{copy.forgot}</Link>
      </div>
      <button className="lcm-submit" type="submit">
        <span>{copy.signIn}</span>
        <ArrowRight size={16} aria-hidden="true" style={dir === "rtl" ? { transform: "scaleX(-1)" } : undefined} />
      </button>
      <p className="lcm-foot">
        {copy.noAccount} <Link to="/pricing">{copy.signUp}</Link>
      </p>
      <p className="lcm-or">{copy.or}</p>
      <div className="lcm-social">
        <button type="button"><GoogleIcon /><span>{copy.google}</span></button>
        <button type="button"><MicrosoftIcon /><span>{copy.microsoft}</span></button>
      </div>
    </form>
  );
}

export default function LoginCompare() {
  return (
    <div className="lcm" dir="rtl">
      <Helmet>
        <title>Login sketch comparison | BizUply</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="lcm-page">
        <h1>השוואת סקיצת התחברות</h1>
        <p className="lcm-lead">
          בכל זוג, הכרטיס הימני הוא קטע מהתמונה המאושרת בגודל הפיקסל המקורי, בלי שינוי קנה מידה.
          הכרטיס השמאלי הוא אותו רוחב, עם הלוגו והפונט של Bizuply.
        </p>
        {FRAMES.map((frame) => (
          <section className="lcm-pair" key={frame.id} id={frame.id}>
            <h2>{frame.title}</h2>
            <div className="lcm-cols">
              <figure className="lcm-col">
                <figcaption>הסקיצה המקורית · {frame.w}×{frame.h}</figcaption>
                <div className="lcm-crop" style={{ width: frame.w, height: frame.h }}>
                  <img
                    src={referenceUrl}
                    alt=""
                    style={{ left: -frame.x, top: -frame.y }}
                  />
                </div>
              </figure>
              <figure className="lcm-col">
                <figcaption>מימוש מוצע · רוחב {frame.w}px</figcaption>
                <div className="lcm-stage" style={{ width: frame.w }}>
                  <ApprovedCard lang={frame.lang} compact={frame.w < 320} />
                </div>
              </figure>
            </div>
          </section>
        ))}
        <h2>סטיות מהסקיצה המקורית</h2>
        <ul className="lcm-notes">
          <li>הסקיצה מציגה את המילה Bizuply בלבד. כאן מופיע לוגו המוצר האמיתי, סימן ומילה, כי זה הלוגו שקיים בפרויקט.</li>
          <li>הפונט הוא Assistant, הפונט שנטען באתר. הסקיצה צוירה בגופן גיאומטרי דומה, לא בקובץ הפונט של המוצר.</li>
          <li>כפתור ההתחברות שומר על הגרדיאנט הסגול של הסקיצה, לא על הכפתור השטוח של דף ההתחברות החי.</li>
          <li>המילה or נשארה באנגלית גם בכרטיס העברי, כמו בתמונה. בממשק החי המחרוזת היא «או».</li>
          <li>הכותרת היא Welcome back / ברוכים הבאים כמו בסקיצה, ולא Login / התחברות מהממשק החי.</li>
          <li>«זכור אותי» ו«המשך עם Google» הם ניסוח הסקיצה. בממשק החי: «זכרו אותי» ו«המשיכו עם Google».</li>
          <li>במובייל אין שורת השעה ומסגרת המכשיר שמופיעות בתמונה. לכן הכרטיס קצר בכ־40 פיקסלים מהפריים, אבל רוחבו זהה.</li>
          <li>הכרטיס העברי בדסקטופ צר ב־30 פיקסלים מהכרטיס האנגלי כבר בתמונה המקורית. כל זוג נשאר ברוחב הפריים שלו.</li>
        </ul>
      </div>
    </div>
  );
}
