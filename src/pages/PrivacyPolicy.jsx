import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation, Trans } from "react-i18next";

function PrivacyPolicy() {
  const { t, i18n } = useTranslation();

  const sectionBase =
    "scroll-mt-28 rounded-[2rem] border border-white/80 bg-white/75 p-6 shadow-xl shadow-slate-900/5 backdrop-blur sm:p-8";

  const h2Base =
    "mb-5 text-2xl font-black tracking-[-0.03em] text-slate-800 sm:text-3xl";

  const h3Base =
    "mb-3 mt-7 text-xl font-black tracking-[-0.02em] text-slate-900";

  const pBase = "mb-4 text-base font-medium leading-8 text-slate-600";

  const ulBase =
    "mb-5 ms-5 list-disc space-y-2 text-base font-medium leading-8 text-slate-600";

  const sections = t("privacyPage.sections", { returnObjects: true });

  return (
    <main
      dir={i18n.language === "he" ? "rtl" : "ltr"}
      className="relative min-h-screen overflow-hidden bg-[#F7F4EE] text-start text-slate-800"
    >
      <Helmet>
        <title>{t("privacyPage.metaTitle")}</title>
        <meta name="description" content={t("privacyPage.metaDescription")} />
        <link rel="canonical" href="https://bizuply.com/privacy" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* Background */}
      <div className="pointer-events-none absolute left-[-12%] top-[-10%] h-[520px] w-[520px] rounded-full bg-amber-200/55 blur-3xl" />
      <div className="pointer-events-none absolute right-[-12%] top-[16%] h-[560px] w-[560px] rounded-full bg-emerald-100/75 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-18%] left-[24%] h-[560px] w-[560px] rounded-full bg-white/85 blur-3xl" />

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-5 pb-10 pt-20 text-center sm:px-8 lg:px-10 lg:pt-24">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/70 px-4 py-2 text-sm font-black text-amber-800 shadow-sm backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          {t("privacyPage.badge")}
        </div>

        <h1 className="mx-auto max-w-5xl text-5xl font-black leading-[1.03] tracking-[-0.05em] text-slate-800 sm:text-6xl lg:text-7xl">
          {t("privacyPage.title")}
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-8 text-slate-600 sm:text-xl">
          {t("privacyPage.intro")}
        </p>

        <div className="mx-auto mt-8 inline-flex rounded-2xl border border-white/80 bg-white/70 px-5 py-3 text-sm font-black text-slate-700 shadow-sm backdrop-blur">
          {t("privacyPage.lastUpdatedLabel")} {t("privacyPage.lastUpdatedDate")}
        </div>
      </section>

      <section className="relative mx-auto grid max-w-7xl gap-8 px-5 pb-24 sm:px-8 lg:grid-cols-[0.34fr_0.66fr] lg:px-10">
        {/* Sidebar */}
        <aside className="h-fit rounded-[2.5rem] border border-white/80 bg-white/70 p-6 shadow-xl shadow-slate-900/5 backdrop-blur lg:sticky lg:top-24">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 text-2xl shadow-lg shadow-slate-900/20">
            🔐
          </div>

          <h2 className="text-2xl font-black tracking-[-0.03em] text-slate-800">
            {t("privacyPage.overviewTitle")}
          </h2>

          <p className="mt-3 text-sm font-medium leading-6 text-slate-500">
            {t("privacyPage.overviewText")}
          </p>

          <nav className="mt-6 max-h-[55vh] space-y-2 overflow-auto pr-1">
            {sections.map((section, index) => (
              <a
                key={section}
                href={`#section-${index + 1}`}
                className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/70 px-4 py-3 text-sm font-black text-slate-700 transition hover:-translate-y-0.5 hover:bg-white hover:text-slate-800"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs text-amber-800">
                  {index + 1}
                </span>
                {section}
              </a>
            ))}
          </nav>

          <div className="mt-6 rounded-3xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 px-5 py-4 text-start text-slate-800">
            <p className="text-sm font-black text-amber-300">
              {t("privacyPage.contactPrivacy")}
            </p>
            <p className="mt-2 break-all text-sm font-bold text-black/80">
              privacy@bizuply.com
            </p>
          </div>
        </aside>

        {/* Content */}
        <div className="space-y-6">
          <section id="section-1" className={sectionBase}>
            <h2 className={h2Base}>{t("privacyPage.s1.h")}</h2>

            <p className={pBase}>
              <Trans i18nKey="privacyPage.s1.p1" components={{ strong: <strong /> }} />
            </p>

            <p className={pBase}>{t("privacyPage.s1.p2")}</p>

            <p className={pBase}>{t("privacyPage.s1.p3")}</p>

            <p className={pBase}>{t("privacyPage.s1.p4")}</p>
          </section>

          <section id="section-2" className={sectionBase}>
            <h2 className={h2Base}>{t("privacyPage.s2.h")}</h2>

            <p className={pBase}>{t("privacyPage.s2.p1")}</p>

            <p className={pBase}>{t("privacyPage.s2.p2")}</p>

            <p className={pBase}>{t("privacyPage.s2.p3")}</p>
          </section>

          <section id="section-3" className={sectionBase}>
            <h2 className={h2Base}>{t("privacyPage.s3.h")}</h2>

            <p className={pBase}>
              <Trans i18nKey="privacyPage.s3.p1" components={{ strong: <strong /> }} />
            </p>

            <p className={pBase}>
              <Trans i18nKey="privacyPage.s3.p2" components={{ strong: <strong /> }} />
            </p>

            <p className={pBase}>
              <Trans i18nKey="privacyPage.s3.p3" components={{ strong: <strong /> }} />
            </p>

            <p className={pBase}>
              <Trans i18nKey="privacyPage.s3.p4" components={{ strong: <strong /> }} />
            </p>

            <p className={pBase}>
              <Trans i18nKey="privacyPage.s3.p5" components={{ strong: <strong /> }} />
            </p>
          </section>

          <section id="section-4" className={sectionBase}>
            <h2 className={h2Base}>{t("privacyPage.s4.h")}</h2>

            <p className={pBase}>{t("privacyPage.s4.p1")}</p>

            <h3 className={h3Base}>{t("privacyPage.s4.h1")}</h3>
            <ul className={ulBase}>
              {t("privacyPage.s4.list1", { returnObjects: true }).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>

            <h3 className={h3Base}>{t("privacyPage.s4.h2")}</h3>
            <ul className={ulBase}>
              {t("privacyPage.s4.list2", { returnObjects: true }).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>

            <h3 className={h3Base}>{t("privacyPage.s4.h3")}</h3>
            <ul className={ulBase}>
              {t("privacyPage.s4.list3", { returnObjects: true }).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          <section id="section-5" className={sectionBase}>
            <h2 className={h2Base}>{t("privacyPage.s5.h")}</h2>

            <p className={pBase}>{t("privacyPage.s5.p1")}</p>

            <ul className={ulBase}>
              {t("privacyPage.s5.list", { returnObjects: true }).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>

            <p className={pBase} dir="ltr" style={{ textAlign: "left" }}>
              For clarity, data received through Google Workspace APIs is
              excluded from any use for training, developing, or improving
              generalized AI or machine learning models.
            </p>

            <p className={pBase}>{t("privacyPage.s5.p2")}</p>
          </section>

          <section id="section-6" className={sectionBase}>
            <h2 className={h2Base}>{t("privacyPage.s6.h")}</h2>

            <p className={pBase}>{t("privacyPage.s6.p1")}</p>

            <h3 className={h3Base}>{t("privacyPage.s6.h1")}</h3>

            <p className={pBase}>{t("privacyPage.s6.p2")}</p>

            <ul className={ulBase}>
              {t("privacyPage.s6.list", { returnObjects: true }).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>

            <p className={pBase}>{t("privacyPage.s6.p3")}</p>

            <h3 className={h3Base}>{t("privacyPage.s6.h2")}</h3>

            <p className={pBase}>{t("privacyPage.s6.p4")}</p>

            <h3 className={h3Base}>{t("privacyPage.s6.h3")}</h3>

            <p className={pBase}>{t("privacyPage.s6.p5")}</p>
          </section>

          <section id="section-7" className={sectionBase}>
            <h2 className={h2Base} dir="ltr" style={{ textAlign: "left" }}>
              7. Google Workspace API Data
            </h2>

            <div dir="ltr" style={{ textAlign: "left" }}>
              <p className={pBase}>
                Bizuply&apos;s use and transfer of information received from
                Google APIs to any other app will adhere to the Google API
                Services User Data Policy, including the Limited Use
                requirements.
              </p>

              <p className={pBase}>
                Bizuply does not use Google Workspace API user data to develop,
                improve, or train generalized artificial intelligence or
                machine learning models.
              </p>

              <p className={pBase}>
                Google Workspace API user data is not transferred to
                third-party AI or machine learning providers for the purpose of
                training or improving generalized AI/ML models.
              </p>
            </div>
          </section>

          <section id="section-8" className={sectionBase}>
            <h2 className={h2Base}>{t("privacyPage.s8.h")}</h2>

            <p className={pBase}>{t("privacyPage.s8.p1")}</p>

            <h3 className={h3Base}>{t("privacyPage.s8.h1")}</h3>

            <ul className={ulBase}>
              {t("privacyPage.s8.list", { returnObjects: true }).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>

            <h3 className={h3Base}>{t("privacyPage.s8.h2")}</h3>

            <p className={pBase}>{t("privacyPage.s8.p2")}</p>

            <p className={pBase}>
              <Trans i18nKey="privacyPage.s8.p3" components={{ strong: <strong /> }} />
            </p>
          </section>

          <section id="section-9" className={sectionBase}>
            <h2 className={h2Base}>{t("privacyPage.s9.h")}</h2>

            <p className={pBase}>{t("privacyPage.s9.p1")}</p>

            <p className={pBase}>{t("privacyPage.s9.p2")}</p>

            <p className={pBase}>{t("privacyPage.s9.p3")}</p>
          </section>

          <section id="section-10" className={sectionBase}>
            <h2 className={h2Base}>{t("privacyPage.s10.h")}</h2>

            <p className={pBase}>{t("privacyPage.s10.p1")}</p>

            <ul className={ulBase}>
              {t("privacyPage.s10.list", { returnObjects: true }).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>

            <p className={pBase}>
              <Trans i18nKey="privacyPage.s10.p2" components={{ strong: <strong /> }} />
            </p>
          </section>

          <section id="section-11" className={sectionBase}>
            <h2 className={h2Base}>{t("privacyPage.s11.h")}</h2>

            <p className={pBase}>{t("privacyPage.s11.p1")}</p>

            <p className={pBase}>{t("privacyPage.s11.p2")}</p>

            <ul className={ulBase}>
              {t("privacyPage.s11.list", { returnObjects: true }).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>

            <p className={pBase}>{t("privacyPage.s11.p3")}</p>

            <p className={pBase}>{t("privacyPage.s11.p4")}</p>
          </section>

          <section id="section-12" className={sectionBase}>
            <h2 className={h2Base}>{t("privacyPage.s12.h")}</h2>

            <p className={pBase}>{t("privacyPage.s12.p1")}</p>

            <p className={pBase}>{t("privacyPage.s12.p2")}</p>

            <p className={pBase}>{t("privacyPage.s12.p3")}</p>
          </section>

          <section id="section-13" className={sectionBase}>
            <h2 className={h2Base}>{t("privacyPage.s13.h")}</h2>

            <p className={pBase}>{t("privacyPage.s13.p1")}</p>

            <p className={pBase}>{t("privacyPage.s13.p2")}</p>

            <p className={pBase}>{t("privacyPage.s13.p3")}</p>
          </section>

          <section id="section-14" className={sectionBase}>
            <h2 className={h2Base}>{t("privacyPage.s14.h")}</h2>

            <p className={pBase}>
              <Trans i18nKey="privacyPage.s14.p1" components={{ strong: <strong /> }} />
            </p>

            <p className={pBase}>{t("privacyPage.s14.p2")}</p>

            <p className={pBase}>{t("privacyPage.s14.p3")}</p>
          </section>

          <section id="section-15" className={sectionBase}>
            <h2 className={h2Base}>{t("privacyPage.s15.h")}</h2>

            <p className={pBase}>{t("privacyPage.s15.p1")}</p>

            <p className={pBase}>{t("privacyPage.s15.p2")}</p>

            <p className={pBase}>{t("privacyPage.s15.p3")}</p>
          </section>

          <section id="section-16" className={sectionBase}>
            <h2 className={h2Base}>{t("privacyPage.s16.h")}</h2>

            <p className={pBase}>{t("privacyPage.s16.p1")}</p>

            <p className={pBase}>{t("privacyPage.s16.p2")}</p>

            <p className={pBase}>{t("privacyPage.s16.p3")}</p>

            <p className={pBase}>{t("privacyPage.s16.p4")}</p>

            <p className={pBase}>{t("privacyPage.s16.p5")}</p>
          </section>

          <section id="section-17" className={sectionBase}>
            <h2 className={h2Base}>{t("privacyPage.s17.h")}</h2>

            <p className={pBase}>{t("privacyPage.s17.p1")}</p>

            <p className={pBase}>{t("privacyPage.s17.p2")}</p>

            <p className={pBase}>{t("privacyPage.s17.p3")}</p>
          </section>

          <section id="section-18" className={sectionBase}>
            <h2 className={h2Base}>{t("privacyPage.s18.h")}</h2>

            <p className={pBase}>{t("privacyPage.s18.p1")}</p>

            <div className="mb-5 rounded-3xl border border-slate-100 bg-white/80 p-5 text-base font-medium leading-8 text-slate-600">
              <p>
                <Trans
                  i18nKey="privacyPage.s18.cardTitle"
                  components={{ strong: <strong /> }}
                />
              </p>
              <p>
                <Trans
                  i18nKey="privacyPage.s18.cardEmail"
                  components={{ strong: <strong /> }}
                />
              </p>
              <p>
                <Trans
                  i18nKey="privacyPage.s18.cardSupport"
                  components={{ strong: <strong /> }}
                />
              </p>
              <p>{t("privacyPage.s18.cardHq")}</p>
            </div>

            <p className={pBase}>{t("privacyPage.s18.p2")}</p>
          </section>

          <section id="section-19" className={sectionBase}>
            <h2 className={h2Base}>{t("privacyPage.s19.h")}</h2>

            <p className={pBase}>{t("privacyPage.s19.p1")}</p>

            <p className={pBase}>{t("privacyPage.s19.p2")}</p>

            <p className={pBase}>{t("privacyPage.s19.p3")}</p>

            <div className="mt-6 rounded-3xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 px-5 py-4 text-start text-slate-800">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-300">
                {t("privacyPage.lastUpdatedBoxLabel")}
              </p>
              <p className="mt-2 text-xl font-black">
                {t("privacyPage.lastUpdatedDate")}
              </p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

export default PrivacyPolicy;
