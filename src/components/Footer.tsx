import React from "react";
import { Link } from "react-router-dom";

type FooterLink = {
  label: string;
  to: string;
};

type SocialLink = FooterLink & {
  icon: string;
};

type FooterColumnProps = {
  title: string;
  links: FooterLink[];
};

export default function Footer() {
  const productLinks: FooterLink[] = [
    { label: "איך זה עובד", to: "/how-it-works" },
    { label: "פיצ׳רים", to: "/features" },
    { label: "מחירים", to: "/pricing" },
    { label: "פתרונות", to: "/solutions" },
  ];

  const companyLinks: FooterLink[] = [
    { label: "עלינו", to: "/about" },
    { label: "הצטרפות כעסק", to: "/business" },
  ];

  const supportLinks: FooterLink[] = [
    { label: "שאלות נפוצות", to: "/faq" },
    { label: "יצירת קשר", to: "/contact" },
    { label: "תנאי שימוש", to: "/terms" },
    { label: "מדיניות פרטיות", to: "/privacy-policy" },
    { label: "נגישות", to: "/accessibility" },
  ];

  const socialLinks: SocialLink[] = [
    { label: "פייסבוק", icon: "f", to: "#" },
    { label: "אינסטגרם", icon: "◎", to: "#" },
    { label: "לינקדאין", icon: "in", to: "#" },
  ];

  return (
    <footer
      dir="rtl"
      className="relative overflow-hidden bg-[radial-gradient(circle_at_top,#ffffff_0%,#f7f8ff_42%,#eef3ff_76%,#ffffff_100%)] text-right text-slate-950"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[360px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-200/35 blur-3xl" />
        <div className="absolute -left-40 top-24 h-[320px] w-[320px] rounded-full bg-cyan-200/35 blur-3xl" />
        <div className="absolute -right-40 bottom-0 h-[320px] w-[320px] rounded-full bg-violet-200/35 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 pb-8 pt-16 sm:px-6 lg:px-8 lg:pt-20">
        <div className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/75 p-2 shadow-[0_28px_90px_rgba(79,70,229,0.14)] backdrop-blur-xl sm:rounded-[2.5rem] sm:p-3">
          <div className="rounded-[1.6rem] border border-slate-100 bg-white/90 px-5 py-8 sm:rounded-[2rem] sm:px-8 sm:py-10 lg:px-10">
            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.75fr_0.75fr_0.8fr_1.1fr]">
              {/* Brand */}
              <div>
                <Link to="/" className="inline-flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-cyan-500 text-lg font-black text-white shadow-xl shadow-indigo-100">
                    B
                  </span>

                  <span className="text-2xl font-black tracking-[-0.04em] text-slate-950">
                    Bizuply
                  </span>
                </Link>

                <p className="mt-5 max-w-sm text-base font-semibold leading-7 text-slate-600">
                  כל מה שהעסק שלך צריך — במקום אחד יפה, חכם ומחובר.
                </p>

                <div className="mt-6 flex items-center gap-3">
                  {socialLinks.map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      aria-label={item.label}
                      className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-sm font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      {item.icon}
                    </Link>
                  ))}
                </div>
              </div>

              <FooterColumn title="המוצר" links={productLinks} />
              <FooterColumn title="החברה" links={companyLinks} />
              <FooterColumn title="תמיכה" links={supportLinks} />

              {/* CTA card */}
              <div className="rounded-[1.75rem] border border-indigo-100 bg-gradient-to-br from-white via-violet-50 to-sky-50 p-6 text-slate-950 shadow-xl shadow-indigo-100">
                <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-xl text-white">
                  ✦
                </div>

                <h4 className="text-xl font-black tracking-[-0.03em]">
                  בנה את מערכת הניהול של העסק שלך.
                </h4>

                <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
                  התחל לנהל עמוד עסקי, CRM, שיתופי פעולה וכלי AI במקום אחד.
                </p>

                <Link
                  to="/register"
                  className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-indigo-600 px-6 py-3.5 text-sm font-black text-white shadow-xl shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700"
                >
                  התחלה בחינם
                  <span className="mr-2">←</span>
                </Link>
              </div>
            </div>

            <div className="my-8 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

            <div className="flex flex-col gap-5 text-sm font-semibold text-slate-500 lg:flex-row lg:items-center lg:justify-between">
              <p>© {new Date().getFullYear()} Bizuply. כל הזכויות שמורות.</p>

              <p className="max-w-2xl leading-6 lg:text-left">
                1007 N Orange Street, 4th Floor, Ste 1382, Wilmington, DE
                19801, United States.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <h4 className="mb-5 text-sm font-black uppercase tracking-[0.18em] text-slate-400">
        {title}
      </h4>

      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className="group inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-indigo-700"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-200 transition group-hover:bg-indigo-600" />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}