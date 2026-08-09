import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation, Trans } from "react-i18next";

function Terms() {
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

  const strongComponents = { strong: <strong />, br: <br /> };

  const sectionsRaw = t("termsPage.sections", { returnObjects: true });
  const sections = Array.isArray(sectionsRaw) ? sectionsRaw : [];

  const asArray = (key) => {
    const value = t(key, { returnObjects: true });
    return Array.isArray(value) ? value : [];
  };

  const s3List = asArray("termsPage.s3.list");
  const s5List1 = asArray("termsPage.s5.list1");
  const s5List2 = asArray("termsPage.s5.list2");
  const s5List3 = asArray("termsPage.s5.list3");
  const s5Rights = asArray("termsPage.s5.rightsList");
  const s6List = asArray("termsPage.s6.list");
  const s8List = asArray("termsPage.s8.list");
  const s12List = asArray("termsPage.s12.list");
  const s15List = asArray("termsPage.s15.list");

  return (
    <main
      dir={i18n.language === "he" ? "rtl" : "ltr"}
      className="relative min-h-screen overflow-hidden bg-[#F7F4EE] text-start text-slate-800"
    >
      <Helmet>
        <title>{t("termsPage.seoTitle")}</title>
        <meta name="description" content={t("termsPage.seoDesc")} />
        <link rel="canonical" href="https://bizuply.com/terms" />
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
          {t("termsPage.badge")}
        </div>

        <h1 className="mx-auto max-w-5xl text-5xl font-black leading-[1.03] tracking-[-0.05em] text-slate-800 sm:text-6xl lg:text-7xl">
          {t("termsPage.title")}
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-8 text-slate-600 sm:text-xl">
          {t("termsPage.intro")}
        </p>

        <div className="mx-auto mt-8 inline-flex rounded-2xl border border-white/80 bg-white/70 px-5 py-3 text-sm font-black text-slate-700 shadow-sm backdrop-blur">
          {t("termsPage.lastUpdatedChip")}
        </div>
      </section>

      <section className="relative mx-auto grid max-w-7xl gap-8 px-5 pb-24 sm:px-8 lg:grid-cols-[0.34fr_0.66fr] lg:px-10">
        {/* Sidebar */}
        <aside className="h-fit rounded-[2.5rem] border border-white/80 bg-white/70 p-6 shadow-xl shadow-slate-900/5 backdrop-blur lg:sticky lg:top-24">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 text-2xl shadow-lg shadow-slate-900/20">
            ⚖️
          </div>

          <h2 className="text-2xl font-black tracking-[-0.03em] text-slate-800">
            {t("termsPage.asideTitle")}
          </h2>

          <p className="mt-3 text-sm font-medium leading-6 text-slate-500">
            {t("termsPage.asideText")}
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
              {t("termsPage.contactLabel")}
            </p>
            <p className="mt-2 break-all text-sm font-bold text-black/80">
              support@bizuply.com
            </p>
          </div>
        </aside>

        {/* Content */}
        <div className="space-y-6">
          <section id="section-1" className={sectionBase}>
            <h2 className={h2Base}>{t("termsPage.s1.h")}</h2>

            <p className={pBase}>
              <Trans i18nKey="termsPage.s1.p1" components={strongComponents} />
            </p>

            <p className={pBase}>{t("termsPage.s1.p2")}</p>

            <p className={pBase}>{t("termsPage.s1.p3")}</p>

            <p className={pBase}>
              <Trans i18nKey="termsPage.s1.p4" components={strongComponents} />
            </p>

            <p className={pBase}>{t("termsPage.s1.p5")}</p>

            <p className={pBase}>
              <Trans i18nKey="termsPage.s1.p6" components={strongComponents} />
            </p>

            <p className={pBase}>{t("termsPage.s1.p7")}</p>
          </section>

          <section id="section-2" className={sectionBase}>
            <h2 className={h2Base}>{t("termsPage.s2.h")}</h2>

            <p className={pBase}>{t("termsPage.s2.intro")}</p>

            <p className={pBase}>
              <Trans i18nKey="termsPage.s2.defs" components={strongComponents} />
            </p>
          </section>

          <section id="section-3" className={sectionBase}>
            <h2 className={h2Base}>{t("termsPage.s3.h")}</h2>

            <p className={pBase}>
              <Trans i18nKey="termsPage.s3.p1" components={strongComponents} />
            </p>

            <ul className={ulBase}>
              {s3List.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <p className={pBase}>{t("termsPage.s3.p2")}</p>

            <p className={pBase}>
              <Trans i18nKey="termsPage.s3.p3" components={strongComponents} />
            </p>

            <p className={pBase}>{t("termsPage.s3.p4")}</p>
          </section>

          <section id="section-4" className={sectionBase}>
            <h2 className={h2Base}>{t("termsPage.s4.h")}</h2>

            <p className={pBase}>{t("termsPage.s4.p1")}</p>
            <p className={pBase}>{t("termsPage.s4.p2")}</p>
            <p className={pBase}>{t("termsPage.s4.p3")}</p>
            <p className={pBase}>{t("termsPage.s4.p4")}</p>
            <p className={pBase}>{t("termsPage.s4.p5")}</p>
            <p className={pBase}>{t("termsPage.s4.p6")}</p>

            <p className={pBase}>
              <Trans i18nKey="termsPage.s4.p7" components={strongComponents} />
            </p>
          </section>

          <section id="section-5" className={sectionBase}>
            <h2 className={h2Base}>{t("termsPage.s5.h")}</h2>

            <p className={pBase}>
              <Trans i18nKey="termsPage.s5.p1" components={strongComponents} />
            </p>

            <p className={pBase}>{t("termsPage.s5.p2")}</p>

            <ul className={ulBase}>
              {s5List1.map((item, index) => (
                <li key={index}>
                  <Trans
                    i18nKey={`termsPage.s5.list1.${index}`}
                    components={strongComponents}
                  />
                </li>
              ))}
            </ul>

            <p className={pBase}>{t("termsPage.s5.p3")}</p>

            <ul className={ulBase}>
              {s5List2.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <p className={pBase}>{t("termsPage.s5.p4")}</p>

            <ul className={ulBase}>
              {s5List3.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h3 className={h3Base}>{t("termsPage.s5.rightsTitle")}</h3>

            <ul className={ulBase}>
              {s5Rights.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <p className={pBase}>
              <Trans i18nKey="termsPage.s5.p6" components={strongComponents} />
            </p>

            <h3 className={h3Base}>{t("termsPage.s5.cookiesTitle")}</h3>

            <p className={pBase}>{t("termsPage.s5.p7")}</p>
            <p className={pBase}>{t("termsPage.s5.p8")}</p>

            <p className={pBase}>
              <Trans i18nKey="termsPage.s5.p9" components={strongComponents} />
            </p>

            <p className={pBase}>
              <Trans i18nKey="termsPage.s5.p10" components={strongComponents} />
            </p>
          </section>

          <section id="section-6" className={sectionBase}>
            <h2 className={h2Base}>{t("termsPage.s6.h")}</h2>

            <p className={pBase}>{t("termsPage.s6.p1")}</p>
            <p className={pBase}>{t("termsPage.s6.p2")}</p>

            <ul className={ulBase}>
              {s6List.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <p className={pBase}>{t("termsPage.s6.p3")}</p>
            <p className={pBase}>{t("termsPage.s6.p4")}</p>
            <p className={pBase}>{t("termsPage.s6.p5")}</p>
          </section>

          <section id="section-7" className={sectionBase}>
            <h2 className={h2Base}>{t("termsPage.s7.h")}</h2>

            <div className="mb-6 rounded-3xl border border-amber-200 bg-amber-50 px-5 py-4 text-base font-bold leading-7 text-amber-900">
              <Trans i18nKey="termsPage.s7.notice" components={strongComponents} />
            </div>

            <p className={pBase}>{t("termsPage.s7.p1")}</p>

            <p className={pBase}>
              <Trans i18nKey="termsPage.s7.p2" components={strongComponents} />
            </p>

            <p className={pBase}>
              <Trans i18nKey="termsPage.s7.p3" components={strongComponents} />
            </p>

            <p className={pBase}>
              <Trans i18nKey="termsPage.s7.p4" components={strongComponents} />
            </p>

            <p className={pBase}>{t("termsPage.s7.p5")}</p>

            <h3 className={h3Base}>{t("termsPage.s7.trialsTitle")}</h3>

            <p className={pBase}>{t("termsPage.s7.p6")}</p>
            <p className={pBase}>{t("termsPage.s7.p7")}</p>
            <p className={pBase}>{t("termsPage.s7.p8")}</p>

            <h3 className={h3Base}>{t("termsPage.s7.priceTitle")}</h3>

            <p className={pBase}>{t("termsPage.s7.p9")}</p>

            <p className={pBase}>
              <Trans i18nKey="termsPage.s7.p10" components={strongComponents} />
            </p>

            <p className={pBase}>{t("termsPage.s7.p11")}</p>
          </section>

          <section id="section-8" className={sectionBase}>
            <h2 className={h2Base}>{t("termsPage.s8.h")}</h2>

            <p className={pBase}>
              <Trans i18nKey="termsPage.s8.p1" components={strongComponents} />
            </p>

            <p className={pBase}>{t("termsPage.s8.p2")}</p>
            <p className={pBase}>{t("termsPage.s8.p3")}</p>

            <ul className={ulBase}>
              {s8List.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <p className={pBase}>
              <Trans i18nKey="termsPage.s8.p4" components={strongComponents} />
            </p>

            <p className={pBase}>{t("termsPage.s8.p5")}</p>
            <p className={pBase}>{t("termsPage.s8.p6")}</p>
            <p className={pBase}>{t("termsPage.s8.p7")}</p>
          </section>

          <section id="section-9" className={sectionBase}>
            <h2 className={h2Base}>{t("termsPage.s9.h")}</h2>

            <p className={pBase}>{t("termsPage.s9.p1")}</p>
            <p className={pBase}>{t("termsPage.s9.p2")}</p>
            <p className={pBase}>{t("termsPage.s9.p3")}</p>
          </section>

          <section id="section-10" className={sectionBase}>
            <h2 className={h2Base}>{t("termsPage.s10.h")}</h2>

            <p className={pBase}>{t("termsPage.s10.p1")}</p>
            <p className={pBase}>{t("termsPage.s10.p2")}</p>
            <p className={pBase}>{t("termsPage.s10.p3")}</p>
            <p className={pBase}>{t("termsPage.s10.p4")}</p>
            <p className={pBase}>{t("termsPage.s10.p5")}</p>
            <p className={pBase}>{t("termsPage.s10.p6")}</p>
          </section>

          <section id="section-11" className={sectionBase}>
            <h2 className={h2Base}>{t("termsPage.s11.h")}</h2>

            <p className={pBase}>
              <Trans i18nKey="termsPage.s11.p1" components={strongComponents} />
            </p>

            <p className={pBase}>{t("termsPage.s11.p2")}</p>

            <p className={pBase}>
              <Trans i18nKey="termsPage.s11.p3" components={strongComponents} />
            </p>

            <p className={pBase}>{t("termsPage.s11.p4")}</p>
          </section>

          <section id="section-12" className={sectionBase}>
            <h2 className={h2Base}>{t("termsPage.s12.h")}</h2>

            <p className={pBase}>{t("termsPage.s12.p1")}</p>
            <p className={pBase}>{t("termsPage.s12.p2")}</p>
            <p className={pBase}>{t("termsPage.s12.p3")}</p>

            <ul className={ulBase}>
              {s12List.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <p className={pBase}>{t("termsPage.s12.p4")}</p>
            <p className={pBase}>{t("termsPage.s12.p5")}</p>
          </section>

          <section id="section-13" className={sectionBase}>
            <h2 className={h2Base}>{t("termsPage.s13.h")}</h2>

            <p className={pBase}>{t("termsPage.s13.p1")}</p>

            <p className={pBase}>
              <Trans i18nKey="termsPage.s13.p2" components={strongComponents} />
            </p>

            <p className={pBase}>
              <Trans i18nKey="termsPage.s13.p3" components={strongComponents} />
            </p>

            <p className={pBase}>{t("termsPage.s13.p4")}</p>

            <p className={pBase}>
              <Trans i18nKey="termsPage.s13.p5" components={strongComponents} />
            </p>
          </section>

          <section id="section-14" className={sectionBase}>
            <h2 className={h2Base}>{t("termsPage.s14.h")}</h2>

            <p className={pBase}>
              <Trans i18nKey="termsPage.s14.p1" components={strongComponents} />
            </p>

            <p className={pBase}>
              <Trans i18nKey="termsPage.s14.p2" components={strongComponents} />
            </p>

            <p className={pBase}>{t("termsPage.s14.p3")}</p>
            <p className={pBase}>{t("termsPage.s14.p4")}</p>

            <p className={pBase}>
              <Trans i18nKey="termsPage.s14.p5" components={strongComponents} />
            </p>
          </section>

          <section id="section-15" className={sectionBase}>
            <h2 className={h2Base}>{t("termsPage.s15.h")}</h2>

            <p className={pBase}>{t("termsPage.s15.intro")}</p>

            <ul className={ulBase}>
              {s15List.map((item, index) => (
                <li key={index}>
                  <Trans
                    i18nKey={`termsPage.s15.list.${index}`}
                    components={strongComponents}
                  />
                </li>
              ))}
            </ul>

            <p className={pBase}>
              <Trans i18nKey="termsPage.s15.p1" components={strongComponents} />
            </p>

            <p className={pBase}>{t("termsPage.s15.p2")}</p>

            <div className="mt-6 rounded-3xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 px-5 py-4 text-start text-slate-800">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-300">
                {t("termsPage.s15.lastUpdatedLabel")}
              </p>
              <p className="mt-2 text-xl font-black">
                {t("termsPage.s15.lastUpdatedValue")}
              </p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

export default Terms;
