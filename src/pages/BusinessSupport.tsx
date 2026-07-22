import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  CheckCircle2,
  Headphones,
  Mail,
  MessageCircle,
  Send,
  UserRound,
  XCircle,
} from "lucide-react";

type SupportFormData = {
  name: string;
  email: string;
  phone: string;
  issueDescription: string;
};

type StatusMessage = {
  type: "success" | "error";
  message: string;
} | null;

export default function BusinessSupport() {
  const [formData, setFormData] = useState<SupportFormData>({
    name: "",
    email: "",
    phone: "",
    issueDescription: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<StatusMessage>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);

    const { name, email, phone, issueDescription } = formData;

    if (!name.trim() || !email.trim() || !phone.trim() || !issueDescription.trim()) {
      setStatus({
        type: "error",
        message: "יש למלא את כל השדות, כולל מספר טלפון.",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          issueDescription,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Failed to send");
      }

      setStatus({
        type: "success",
        message: "הפנייה נשלחה בהצלחה! נחזור אליך בהקדם.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        issueDescription: "",
      });
    } catch (error) {
      console.error("Support form error:", error);

      setStatus({
        type: "error",
        message: "אירעה שגיאה בשליחת הפנייה. נסה שוב מאוחר יותר.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/40 px-4 py-6 text-right text-slate-800 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <section className="relative overflow-hidden rounded-[2rem] border border-violet-100 bg-gradient-to-br from-white via-violet-50 to-sky-50 px-6 py-10 shadow-[0_24px_80px_rgba(109,40,217,0.10)] sm:px-8 lg:px-10">
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-violet-300/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -right-24 h-80 w-80 rounded-full bg-sky-300/25 blur-3xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white/80 px-4 py-1.5 text-xs font-black text-violet-700 shadow-sm backdrop-blur">
              <Headphones size={15} />
              תמיכה לעסקים
            </div>

            <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-800 sm:text-5xl">
              איך אפשר לעזור?
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
              יש לך שאלה, תקלה או משהו שצריך לבדוק? מלא את הטופס ונציג מהצוות
              יחזור אליך בהקדם.
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
          <form
            onSubmit={handleFormSubmit}
            className="rounded-[2rem] border border-white/70 bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-7"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-black tracking-tight text-slate-800">
                פתיחת פנייה לתמיכה
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                מלא את הפרטים ונחזור אליך עם מענה מסודר.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-extrabold text-slate-800">
                  שם מלא <span className="text-violet-600">*</span>
                </label>

                <div className="relative">
                  <UserRound
                    size={18}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={loading}
                    placeholder="הכנס שם מלא"
                    required
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white pr-11 pl-4 text-sm font-semibold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-extrabold text-slate-800">
                  טלפון <span className="text-violet-600">*</span>
                </label>

                <PhoneInput
                  country="il"
                  preferredCountries={["il", "us", "gb", "ca"]}
                  enableSearch
                  value={formData.phone}
                  onChange={(phone) =>
                    setFormData((prev) => ({
                      ...prev,
                      phone,
                    }))
                  }
                  inputProps={{
                    name: "phone",
                    required: true,
                    disabled: loading,
                  }}
                  containerClass="!w-full"
                  inputClass="!h-12 !w-full !rounded-2xl !border !border-slate-200 !bg-white !pr-14 !pl-4 !text-right !text-sm !font-semibold !text-slate-900 !shadow-sm !outline-none focus:!border-violet-400 focus:!ring-4 focus:!ring-violet-100 disabled:!cursor-not-allowed disabled:!bg-slate-50 disabled:!text-slate-400"
                  buttonClass="!rounded-r-2xl !border-slate-200 !bg-slate-50 hover:!bg-slate-100"
                  dropdownClass="!rounded-2xl !border-slate-200 !text-left !shadow-2xl"
                  searchClass="!rounded-xl !border-slate-200 !px-3 !py-2"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-extrabold text-slate-800">
                  אימייל <span className="text-violet-600">*</span>
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={loading}
                    placeholder="הכנס כתובת אימייל"
                    required
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white pr-11 pl-4 text-sm font-semibold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-extrabold text-slate-800">
                  הודעה <span className="text-violet-600">*</span>
                </label>

                <div className="relative">
                  <MessageCircle
                    size={18}
                    className="pointer-events-none absolute right-4 top-4 text-slate-400"
                  />

                  <textarea
                    name="issueDescription"
                    value={formData.issueDescription}
                    onChange={handleInputChange}
                    disabled={loading}
                    placeholder="תאר את השאלה או התקלה שלך"
                    required
                    rows={6}
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-white py-3 pr-11 pl-4 text-sm font-medium leading-6 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/70 px-6 text-sm font-black text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 hover:from-violet-200/80 hover:via-sky-100 hover:to-cyan-100 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
              >
                {loading ? "שולח..." : "שליחת פנייה"}
                <Send size={17} />
              </button>

              {status && (
                <div
                  className={[
                    "flex items-start gap-3 rounded-2xl px-4 py-3 text-sm font-bold leading-6",
                    status.type === "success"
                      ? "border border-emerald-100 bg-emerald-50 text-emerald-700"
                      : "border border-rose-100 bg-rose-50 text-rose-700",
                  ].join(" ")}
                >
                  {status.type === "success" ? (
                    <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
                  ) : (
                    <XCircle size={19} className="mt-0.5 shrink-0" />
                  )}

                  <span>{status.message}</span>
                </div>
              )}
            </div>
          </form>

          <aside className="rounded-[2rem] border border-violet-100 bg-gradient-to-br from-white via-violet-50 to-sky-50 p-6 shadow-[0_24px_80px_rgba(109,40,217,0.10)] sm:p-7">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
              <Headphones size={26} />
            </div>

            <h2 className="mt-5 text-2xl font-black tracking-tight text-slate-800">
              אנחנו כאן בשבילך
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              צוות התמיכה שלנו מטפל בפניות של עסקים, בעיות התחברות, תשלומים,
              תקלות במערכת, שאלות על CRM, דשבורד, עמוד עסקי וכל דבר שצריך
              בדיקה.
            </p>

            <div className="mt-6 space-y-3">
              <div className="rounded-2xl border border-white/80 bg-white/80 p-4 shadow-sm">
                <p className="text-xs font-black text-slate-400">זמן מענה</p>
                <p className="mt-1 text-sm font-black text-slate-900">
                  נחזור אליך בהקדם האפשרי
                </p>
              </div>

              <div className="rounded-2xl border border-white/80 bg-white/80 p-4 shadow-sm">
                <p className="text-xs font-black text-slate-400">
                  אימייל ישיר
                </p>
                <a
                  href="mailto:support@bizuply.com"
                  className="mt-1 inline-flex text-sm font-black text-violet-700 underline-offset-4 hover:underline"
                >
                  support@bizuply.com
                </a>
              </div>

              <div className="rounded-2xl border border-white/80 bg-white/80 p-4 shadow-sm">
                <p className="text-xs font-black text-slate-400">
                  מומלץ לצרף בפנייה
                </p>
                <p className="mt-1 text-sm font-bold leading-6 text-slate-700">
                  שם העסק, תיאור קצר של הבעיה, צילום מסך אם יש, וטלפון לחזרה.
                </p>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}