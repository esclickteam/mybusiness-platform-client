import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { getTextDirection } from "../../i18n/localeUtils";
import { platformStory } from "../../lib/platformStory.mjs";
import { industryNav } from "../../lib/marketingNav.mjs";
import { getGuide } from "../../lib/guidesMarketing.mjs";
import {
  MARKETING_LOCALE_PREFIXES,
  marketingPublicUrl,
  splitMarketingLocale,
  withMarketingLocale,
} from "../../lib/localePath.mjs";
import "./platformExperience.css";

const GUIDES = [
  "crm-and-business-platform",
  "what-is-a-crm",
  "follow-up-on-leads",
  "whatsapp-cloud-api-cost",
  "business-automation",
  "manage-meta-campaigns",
];

function line(locale, he, en, es, pt, ar) {
  if (locale === "he") return he;
  if (locale === "es") return es;
  if (locale === "pt-BR") return pt;
  if (locale === "ar") return ar;
  return en;
}

function shot(locale, name) {
  const folder = locale === "he" || locale === "ar" ? "he" : "en";
  return `/demo-media/home/screens/${folder}-desktop-${name}.webp`;
}

function siteShot(locale, name) {
  const folder = locale === "he" || locale === "ar" ? "he" : "en";
  return `/demo-media/home/sites/${name}-${folder}-desk.webp`;
}

export default function PlatformExperience() {
  const language = splitMarketingLocale(typeof window === "undefined" ? "/" : window.location.pathname).locale;
  const story = platformStory(language);
  const ui = story.ui;
  const dir = getTextDirection(language);
  const href = (path) => withMarketingLocale(path, language);
  const canonical = marketingPublicUrl("/platform", language);
  const industries = industryNav(language).links || [];
  const guides = GUIDES.map((slug) => ({ slug, guide: getGuide(slug, language) })).filter((item) => item.guide?.h1);

  useEffect(() => {
    const nodes = [...document.querySelectorAll("[data-scrub]")];
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const tick = () => {
      frame = 0;
      const narrow = window.innerWidth < 860 || media.matches;
      for (const node of nodes) {
        if (narrow) {
          node.style.setProperty("--p", "1");
          continue;
        }
        const box = node.getBoundingClientRect();
        if (box.bottom < -200 || box.top > window.innerHeight + 200) continue;
        const total = Math.max(node.offsetHeight - window.innerHeight, 1);
        const passed = Math.min(Math.max(-box.top, 0), total);
        node.style.setProperty("--p", String(passed / total));
      }
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    document.title = story.title;
    const setMeta = (attr, key, content) => {
      let node = document.head.querySelector(`meta[${attr}="${key}"]`);
      if (!node) {
        node = document.createElement("meta");
        node.setAttribute(attr, key);
        document.head.appendChild(node);
      }
      node.setAttribute("content", content);
    };
    setMeta("name", "description", story.description);
    setMeta("property", "og:title", story.title);
    setMeta("property", "og:description", story.description);
    setMeta("property", "og:url", canonical);
    setMeta("property", "og:type", "website");
    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonical;
    const alternates = [
      ["en", marketingPublicUrl("/platform", "en")],
      ["x-default", marketingPublicUrl("/platform", "en")],
      ...MARKETING_LOCALE_PREFIXES.map((entry) => [entry.htmlLang, marketingPublicUrl("/platform", entry.locale)]),
    ];
    for (const [lang, hrefValue] of alternates) {
      let alt = document.head.querySelector(`link[rel="alternate"][hreflang="${lang}"]`);
      if (!alt) {
        alt = document.createElement("link");
        alt.rel = "alternate";
        alt.hreflang = lang;
        document.head.appendChild(alt);
      }
      alt.href = hrefValue;
    }
    document.documentElement.lang = language === "pt-BR" ? "pt-BR" : language;
    document.documentElement.dir = dir;
  }, [canonical, dir, language, story.description, story.title]);

  const steps = [1, 2, 3, 4, 5, 6].map((n) => ({ title: ui[`j${n}t`], body: ui[`j${n}d`] }));
  const frames = ["crm-list", "crm-card", "whatsapp", "dashboard", "automation", "crm-card"];

  return (
    <article className={`px ${dir === "rtl" ? "is-rtl" : "is-ltr"}`} lang={language === "pt-BR" ? "pt-BR" : language} dir={dir}>
      <Helmet>
        <title>{story.title}</title>
        <meta name="description" content={story.description} />
        <link rel="canonical" href={canonical} />
      </Helmet>

      <section className="scene hero" data-scrub>
        <div className="pin hero-pin">
          <div className="hero-copy">
            <p className="kicker">{ui.heroKicker}</p>
            <h1>
              <span className="rise">{ui.hero1}</span>
              <span className="rise hot">{ui.hero2}</span>
            </h1>
            <p className="lede">{ui.heroLede}</p>
            <div className="actions">
              <Link className="btn yellow" to={href("/register")}>{ui.startFree}</Link>
              <Link className="btn ghost" to={href("/contact")}>{ui.bookDemo}</Link>
            </div>
          </div>
          <div className="hero-stage" aria-hidden="true">
            <i className="shape pink" />
            <i className="shape yellow" />
            <i className="shape ring" />
            <figure className="win camp"><img src={shot(language, "campaigns")} alt="" /></figure>
            <figure className="win cal"><img src="/demo-media/home/appointments.jpg" alt="" /></figure>
            <figure className="win crm"><img src={shot(language, "crm-list")} alt="" /></figure>
            <figure className="win wa"><img src={shot(language, "whatsapp")} alt="" /></figure>
            <figure className="win auto"><img src={shot(language, "automation")} alt="" /></figure>
          </div>
          <div className="sheet" />
        </div>
      </section>

      <section className="scene why" data-scrub>
        <div className="pin why-pin">
          <div className="why-copy">
            <h2><span>{ui.why1}</span><span>{ui.why2}</span></h2>
            <p>{ui.whyA}</p>
            <p>{ui.whyB}</p>
          </div>
          <div className="gather">
            {[
              [line(language, "שיחה", "Thread", "Conversación", "Conversa", "محادثة"), "WhatsApp"],
              [line(language, "טופס", "Form", "Formulario", "Formulário", "نموذج"), "Studio North"],
              [line(language, "יומן", "Calendar", "Agenda", "Agenda", "تقويم"), "10:30"],
              [line(language, "משימה", "Task", "Tarea", "Tarefa", "مهمة"), line(language, "המשך", "Follow up", "Seguimiento", "Continuidade", "متابعة")],
              [line(language, "כרטיס", "Card", "Ficha", "Ficha", "بطاقة"), line(language, "נועה לוי", "Noa Levi", "Noa Levi", "Noa Levi", "نوعا ليفي")],
              [line(language, "קמפיין", "Campaign", "Campaña", "Campanha", "حملة"), "Meta"],
            ].map(([k, v], index) => (
              <div className="chip" style={{ "--i": index }} key={k}>
                <small>{k}</small>
                <strong>{v}</strong>
              </div>
            ))}
            <figure className="gather-core"><img src={shot(language, "dashboard")} alt="" /></figure>
          </div>
        </div>
      </section>

      <section className="scene journey" data-scrub id="journey">
        <div className="journey-head">
          <h2>{ui.journeyTitle}</h2>
          <p>{ui.journeyLede}</p>
        </div>
        <div className="pin journey-pin">
          <ol className="steps">
            {steps.map((step, index) => (
              <li key={step.title} style={{ "--i": index }}>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
          <div className="frames">
            {frames.map((name, index) => (
              <figure key={`${name}-${index}`} style={{ "--i": index }}>
                <img src={shot(language, name)} alt="" />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="scene crm" data-scrub>
        <div className="crm-layout">
          <div className="crm-copy">
            <h2>{ui.crm1}<em>{ui.crm2}</em></h2>
            <p>{ui.crmBody}</p>
            <p>{ui.crmPoints}</p>
            <Link className="btn yellow" to={href("/crm")}>{ui.crmCta}</Link>
          </div>
          <div className="crm-stage">
            <figure className="crm-list"><img src={shot(language, "crm-list")} alt="" /></figure>
            <figure className="crm-card"><img src={shot(language, "crm-card")} alt="" /></figure>
          </div>
        </div>
      </section>

      <section className="scene wa" data-scrub>
        <div className="wa-layout">
          <div className="wa-copy">
            <h2>{ui.wa1}<em>{ui.wa2}</em></h2>
            <p>{ui.waBody}</p>
            <Link className="btn ink" to={href("/whatsapp-api")}>{ui.waCta}</Link>
          </div>
          <div className="wa-stage">
            <div className="phone">
              <p className="bubble in">{line(language, "אפשר לקבוע ייעוץ ליום שלישי?", "Can we set a consultation for Tuesday?", "¿Podemos fijar una consulta el martes?", "Podemos marcar uma consulta na terça?", "هل نحدد استشارة يوم الثلاثاء؟")}</p>
              <p className="bubble out">{line(language, "יש חלון ב־10:30. לקבוע לנועה לוי?", "10:30 is open. Book it for Noa Levi?", "Hay un hueco a las 10:30. ¿Lo reservo para Noa Levi?", "Há um horário às 10:30. Marco para Noa Levi?", "الساعة 10:30 متاحة. نحجزها لنوعا ليفي؟")}</p>
              <p className="bubble in">{line(language, "כן, תודה.", "Yes, thank you.", "Sí, gracias.", "Sim, obrigada.", "نعم، شكراً.")}</p>
            </div>
            <figure className="wa-desk"><img src={shot(language, "whatsapp")} alt="" /></figure>
            <aside className="wa-card">
              <strong>{line(language, "נועה לוי", "Noa Levi", "Noa Levi", "Noa Levi", "نوعا ليفي")}</strong>
              <span>{line(language, "השיחה שויכה לכרטיס", "Thread linked to the card", "Conversación vinculada a la ficha", "Conversa ligada à ficha", "المحادثة مرتبطة بالبطاقة")}</span>
            </aside>
          </div>
        </div>
      </section>

      <section className="scene auto" data-scrub>
        <div className="auto-copy">
          <h2>{ui.auto1}<em>{ui.auto2}</em></h2>
          <p>{ui.autoBody}</p>
          <Link className="btn yellow" to={href("/automations")}>{ui.autoCta}</Link>
        </div>
        <div className="flowline">
          <div className="node" style={{ "--i": 0 }}><small>{line(language, "אירוע", "Event", "Evento", "Evento", "حدث")}</small><strong>{line(language, "ליד חדש", "New lead", "Lead nuevo", "Lead novo", "عميل محتمل جديد")}</strong></div>
          <div className="node" style={{ "--i": 1 }}><small>{line(language, "תנאי", "Condition", "Condición", "Condição", "شرط")}</small><strong>{line(language, "הסטטוס חדש", "Status is New", "El estado es Nuevo", "O status é Novo", "الحالة جديد")}</strong></div>
          <div className="node" style={{ "--i": 2 }}><small>{line(language, "פעולה", "Action", "Acción", "Ação", "إجراء")}</small><strong>{line(language, "משימת המשך", "Follow-up task", "Tarea de seguimiento", "Tarefa de continuidade", "مهمة متابعة")}</strong></div>
          <aside className="result">{line(language, "המשימה נוספה לכרטיס של נועה לוי", "The task was added to Noa Levi's card", "La tarea se añadió a la ficha de Noa Levi", "A tarefa entrou na ficha de Noa Levi", "أُضيفت المهمة إلى بطاقة نوعا ليفي")}</aside>
        </div>
      </section>

      <section className="scene camp" data-scrub>
        <div className="camp-copy">
          <h2>{ui.camp1}<em>{ui.camp2}</em></h2>
          <p>{ui.campBody}</p>
          <Link className="btn yellow" to={href("/meta-campaigns")}>{ui.campCta}</Link>
        </div>
        <div className="camp-stage">
          <figure><img src={shot(language, "campaigns")} alt="" /></figure>
          <div className="bars" aria-hidden="true">
            <i /><i /><i /><i /><i />
          </div>
          <div className="lead-fly">{line(language, "ליד חדש · Meta · נועה לוי", "New lead · Meta · Noa Levi", "Lead nuevo · Meta · Noa Levi", "Lead novo · Meta · Noa Levi", "عميل جديد · Meta · نوعا ليفي")}</div>
          <ul className="marks">
            {["meta", "facebook", "instagram", "googleads"].map((name) => (
              <li key={name}><img src={`/brand/marks/${name}.svg`} alt={name} /></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="scene cal" data-scrub>
        <div className="cal-copy">
          <h2>{ui.cal1}<em>{ui.cal2}</em></h2>
          <p>{ui.calBody}</p>
          <Link className="btn ink" to={href("/appointments")}>{ui.calCta}</Link>
        </div>
        <div className="week">
          {[
            [line(language, "שלישי", "Tue", "Mar", "Ter", "الثلاثاء"), "10:30", line(language, "נועה לוי · ייעוץ", "Noa Levi · consult", "Noa Levi · consulta", "Noa Levi · consulta", "نوعا ليفي · استشارة")],
            [line(language, "שלישי", "Tue", "Mar", "Ter", "الثلاثاء"), "12:00", line(language, "דניאל כהן · היכרות", "Daniel Cohen · intro", "Daniel Cohen · presentación", "Daniel Cohen · apresentação", "دانيال كوهين · تعارف")],
            [line(language, "שלישי", "Tue", "Mar", "Ter", "الثلاثاء"), "15:00", line(language, "מיה רז · מעקב", "Maya Raz · follow-up", "Maya Raz · seguimiento", "Maya Raz · acompanhamento", "مايا راز · متابعة")],
          ].map(([day, time, who]) => (
            <article key={who}><small>{day}</small><strong>{time}</strong><span>{who}</span></article>
          ))}
        </div>
      </section>

      <section className="scene web" data-scrub>
        <div className="web-copy">
          <h2>{ui.web1}<em>{ui.web2}</em></h2>
          <p>{ui.webBody}</p>
          <Link className="btn ink" to={href("/website-builder")}>{ui.webCta}</Link>
        </div>
        <div className="editor">
          <ol>
            <li>{line(language, "כותרת", "Headline", "Titular", "Título", "عنوان")}</li>
            <li>{line(language, "שירותים", "Services", "Servicios", "Serviços", "خدمات")}</li>
            <li>{line(language, "טופס פנייה", "Enquiry form", "Formulario", "Formulário", "نموذج")}</li>
          </ol>
          <div className="previews">
            {["lashora", "studiora", "advisora"].map((name, index) => (
              <figure key={name} style={{ "--i": index }}><img src={siteShot(localeSafe(language), name)} alt="" /></figure>
            ))}
          </div>
        </div>
      </section>

      <section className="scene ai">
        <div className="ai-copy">
          <h2>{ui.ai1}<em>{ui.ai2}</em></h2>
          <p>{ui.aiBody}</p>
          <Link className="btn yellow" to={href("/website-scan")}>{ui.aiCta}</Link>
        </div>
        <div className="ai-board">
          <article>
            <h3>{line(language, "היועץ העסקי", "Business advisor", "Asesor de negocio", "Consultor de negócios", "المستشار التجاري")}</h3>
            <p>{line(language, "קורא סטטוס, מקור, ואם יש טלפון בכרטיס. יכול לסכם לידים שממתינים.", "Reads the status, the source, and whether the card has a phone. Can summarize waiting leads.", "Lee el estado, el origen y si hay teléfono. Puede resumir los leads en espera.", "Lê o status, a origem e se há telefone. Pode resumir os leads em espera.", "يقرأ الحالة والمصدر ووجود هاتف. يمكنه تلخيص العملاء المنتظرين.")}</p>
          </article>
          <article>
            <h3>{line(language, "אוטומציות AI", "AI automations", "Automatizaciones de IA", "Automações de IA", "أتمتة الذكاء الاصطناعي")}</h3>
            <p>{line(language, "יושבות ליד משימות ותיעוד. רק פעולה שקיימת בעורך נחשבת ליכולת.", "They sit next to tasks and notes. Only an action in the editor counts.", "Están junto a las tareas. Solo cuenta una acción del editor.", "Ficam junto das tarefas. Só conta uma ação do editor.", "تقع إلى جانب المهام. يُحتسب فقط إجراء موجود في المحرر.")}</p>
          </article>
          <article>
            <h3>{line(language, "סריקת נראות", "Visibility scan", "Escaneo de visibilidad", "Varredura de visibilidade", "فحص الظهور")}</h3>
            <p>{line(language, "בודקת אתר ציבורי. מדידה חיה אינה פעילה עד שיאושר מחירון.", "Checks a public site. Live measurement is not active until a price list is approved.", "Revisa un sitio público. La medición en vivo no está activa hasta un precio aprobado.", "Verifica um site público. A medição ao vivo não está ativa até um preço aprovado.", "يفحص موقعاً عاماً. القياس الحي غير مفعّل حتى اعتماد سعر.")}</p>
          </article>
        </div>
      </section>

      <section className="scene mosaic">
        <h2>{ui.mosaic1}<em>{ui.mosaic2}</em></h2>
        <div className="mosaic-grid">
          {[
            ["/crm", ui.crmCta, ui.crmPoints, "m-crm"],
            ["/whatsapp-api", ui.waCta, ui.wa2, "m-wa"],
            ["/automations", ui.autoCta, ui.auto2, "m-auto"],
            ["/meta-campaigns", ui.campCta, ui.camp2, "m-camp"],
            ["/appointments", ui.calCta, ui.cal2, "m-cal"],
            ["/website-builder", ui.webCta, ui.web2, "m-web"],
            ["/collaborations", line(language, "שיתופי פעולה", "Collaborations", "Colaboraciones", "Colaborações", "تعاون"), line(language, "הזדמנות בין עסקים. בלי הבטחת שותף או הכנסה.", "An opportunity between businesses. No promised partner or revenue.", "Una oportunidad entre negocios. Sin socio ni ingreso prometido.", "Uma oportunidade entre negócios. Sem parceiro ou receita prometidos.", "فرصة بين الأعمال. دون شريك أو دخل مضمون."), "m-col"],
            ["/saas", line(language, "מערכות SaaS", "SaaS systems", "Sistemas SaaS", "Sistemas SaaS", "أنظمة SaaS"), line(language, "מערכות מוכנות לסוג עסק, כפי שהן בקטלוג.", "Ready systems for a kind of business, as listed in the catalog.", "Sistemas listos para un tipo de negocio, según el catálogo.", "Sistemas prontos para um tipo de negócio, conforme o catálogo.", "أنظمة جاهزة لنوع من الأعمال، كما في الكتالوج."), "m-saas"],
            ["/security-scanner", line(language, "סריקת אבטחת אתר", "Website security scan", "Escaneo de seguridad", "Varredura de segurança", "فحص أمان الموقع"), line(language, "בדיקה ציבורית של אתר. בלי הסמכת אבטחה כללית.", "A public check of a site. Not a general security certification.", "Una revisión pública de un sitio. No es una certificación general.", "Uma verificação pública de um site. Não é uma certificação geral.", "فحص عام لموقع. ليس شهادة أمان عامة."), "m-sec"],
            ["/agents", line(language, "צוות טיפול בלידים", "People who follow up leads", "Personas para el seguimiento", "Pessoas para o acompanhamento", "أشخاص لمتابعة العملاء"), line(language, "אנשים לטיפול שהוגדר מראש. לא צ'אטבוט, ובלי הבטחת אחוז מענה.", "People for a defined follow-up. Not a chatbot, and no promised reply rate.", "Personas para un seguimiento definido. No es un chatbot ni hay tasa prometida.", "Pessoas para um acompanhamento definido. Não é um chatbot nem há taxa prometida.", "أشخاص لمتابعة محددة. ليس روبوت محادثة ولا نسبة رد موعودة."), "m-people"],
          ].map(([path, title, body, tone]) => (
            <Link key={path} className={`tile ${tone}`} to={href(path)}>
              <strong>{title}</strong>
              <span>{body}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="scene flow" data-scrub>
        <h2>{ui.flow1}<em>{ui.flow2}</em></h2>
        <p className="narrow">{ui.flowBody}</p>
        <div className="pipes">
          <ul>
            {["Meta", "Facebook", "Instagram", "WhatsApp", "Google Ads"].map((name) => <li key={name}>{name}</li>)}
          </ul>
          <div className="hub">Bizuply</div>
          <ul>
            <li>CRM</li>
            <li>{line(language, "משימה", "Task", "Tarea", "Tarefa", "مهمة")}</li>
            <li>{line(language, "פגישה", "Meeting", "Cita", "Reunião", "موعد")}</li>
          </ul>
        </div>
      </section>

      <section className="scene fit" data-scrub>
        <div className="fit-copy">
          <h2>{ui.fit1}<em>{ui.fit2}</em></h2>
          <p>{ui.fitBody}</p>
        </div>
        <div className="fit-stage">
          {industries.map(([path, label, blurb], index) => (
            <Link key={path} to={href(path)} className="fit-slide" style={{ "--i": index, "--n": industries.length }}>
              <h3>{label}</h3>
              <p>{blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="scene gains">
        <h2>{ui.gain1}<em>{ui.gain2}</em></h2>
        <ol>
          {ui.gains.map(([title, body], index) => (
            <li key={title} className={`g${index}`}><h3>{title}</h3><p>{body}</p></li>
          ))}
        </ol>
      </section>

      <section className="scene compare">
        <h2>{ui.compareTitle}</h2>
        <p>{ui.compareNote}</p>
        <div className="table-wrap">
          <table>
            <thead><tr>{story.compare.columns.map((column) => <th key={column}>{column}</th>)}</tr></thead>
            <tbody>
              {story.compare.rows.map((row) => (
                <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="scene start">
        <h2>{ui.start1}<em>{ui.start2}</em></h2>
        <div className="paths">
          <div>
            <h3>{ui.pathA}</h3>
            <p>{ui.pathABody}</p>
            <Link className="btn yellow" to={href("/register")}>{ui.startFree}</Link>
          </div>
          <div className="join" aria-hidden="true" />
          <div>
            <h3>{ui.pathB}</h3>
            <p>{ui.pathBBody}</p>
            <Link className="btn ink" to={href("/contact")}>{ui.bookPersonal}</Link>
          </div>
        </div>
      </section>

      <section className="scene trust">
        <h2>{ui.trustTitle}</h2>
        <p>{ui.trustBody}</p>
        <p className="links">
          <Link to={href("/privacy")}>{ui.privacy}</Link>
          <Link to={href("/terms")}>{ui.terms}</Link>
        </p>
      </section>

      <section className="scene know">
        <h2>{ui.knowTitle}</h2>
        <div className="magazine">
          {guides.map(({ slug, guide }, index) => (
            <Link key={slug} to={href(`/guides/${slug}`)} className={index === 0 ? "feature" : "side"}>
              <strong>{guide.h1}</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="scene faq" id="faq">
        <h2>{ui.faqTitle}</h2>
        <div>
          {story.faq.map(([question, answer]) => (
            <details key={question}>
              <summary>{question}</summary>
              <div className="answer"><p>{answer}</p></div>
            </details>
          ))}
        </div>
      </section>

      <section className="scene end" data-scrub>
        <i className="shape pink" />
        <i className="shape yellow" />
        <h2>{ui.end1}<em>{ui.end2}</em></h2>
        <p>{ui.endBody}</p>
        <div className="actions">
          <Link className="btn yellow" to={href("/register")}>{ui.startFree}</Link>
          <Link className="btn ghost" to={href("/contact")}>{ui.bookDemo}</Link>
          <Link className="btn ghost" to={href("/pricing")}>{ui.plans}</Link>
        </div>
      </section>
    </article>
  );
}

function localeSafe(language) {
  return language;
}
