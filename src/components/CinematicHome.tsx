import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { normalizeMarketingLocale } from "../lib/localePathCore.mjs";
import "../styles/cinematic-home.css";

type Scene = { id: string; film: string; poster: string; title: string; body: string; cta: string; href: string };

const COPY = {
  en: {
    kicker: "The connected business platform",
    flowTitle: "From the first click to the next conversation",
    flowLead: "Enquiries from supported channels can arrive in Bizuply CRM, continue in WhatsApp, and move through the automations you set up.",
    flowNote: "Shown sources are the channels already presented on Bizuply. This is not a promise that every ad account connects automatically.",
    crm: "CRM",
    whatsapp: "WhatsApp",
    automation: "Automation",
    storyKicker: "Scroll the workspace",
    demo: "Illustrative demo data",
    pause: "Pause",
    play: "Play",
    webKicker: "Website builder",
    webTitle: "A site that still works after the first click",
    webBody: "Build a professional website, shape the design, and connect supported enquiries with the customer workflow.",
    webCta: "Build your website",
    finalTitle: "Bring the work into one place",
    finalLead: "Customers, conversations, marketing and the follow-up that comes next. One Bizuply workspace.",
    finalStart: "Get started",
    finalExplore: "Explore the platform",
    scenes: [
      { id: "crm", film: "/demo-media/home/crm.mp4", poster: "/demo-media/home/crm.jpg", title: "Every lead has a next step", body: "Keep leads, customer records and follow-up work in one CRM, with the status your team can actually use.", cta: "Explore CRM", href: "/crm" },
      { id: "whatsapp", film: "/demo-media/home/whatsapp.mp4", poster: "/demo-media/home/whatsapp.jpg", title: "The conversation stays with the customer", body: "WhatsApp Business conversations sit next to the record, so a reply is part of the workflow.", cta: "Explore WhatsApp", href: "/whatsapp-api" },
      { id: "marketing", film: "/demo-media/home/campaigns.mp4", poster: "/demo-media/home/campaigns.jpg", title: "See the campaign, then the lead", body: "Review supported Meta campaign activity and the enquiries that arrive for follow-up. Figures on screen are demo data.", cta: "Explore marketing", href: "/meta-campaigns" },
      { id: "automations", film: "/demo-media/home/automations.mp4", poster: "/demo-media/home/automations.jpg", title: "The next action can be prepared", body: "Build workflows for the triggers and actions your plan supports, instead of leaving every step manual.", cta: "Explore automations", href: "/automations" },
    ] as Scene[],
  },
  he: {
    kicker: "הפלטפורמה העסקית המחוברת",
    flowTitle: "מהקליק הראשון לשיחה הבאה",
    flowLead: "פניות מערוצים נתמכים יכולות להגיע ל־CRM של Bizuply, להמשיך ב־WhatsApp ולעבור באוטומציות שהגדרתם.",
    flowNote: "הערוצים שמוצגים הם אלה שכבר מופיעים ב־Bizuply. זו לא הבטחה שכל חשבון מודעות מתחבר אוטומטית.",
    crm: "CRM",
    whatsapp: "WhatsApp",
    automation: "אוטומציה",
    storyKicker: "גללו בתוך סביבת העבודה",
    demo: "נתוני הדגמה",
    pause: "השהיה",
    play: "הפעלה",
    webKicker: "בניית אתרים",
    webTitle: "אתר שממשיך לעבוד אחרי הקליק",
    webBody: "בנו אתר מקצועי, עצבו אותו, וחברו פניות נתמכות לתהליך העבודה מול הלקוח.",
    webCta: "לבניית האתר",
    finalTitle: "כל העבודה במקום אחד",
    finalLead: "לקוחות, שיחות, שיווק וההמשך שמגיע אחריהם. סביבת עבודה אחת של Bizuply.",
    finalStart: "מתחילים",
    finalExplore: "להכיר את הפלטפורמה",
    scenes: [
      { id: "crm", film: "/demo-media/home/crm.mp4", poster: "/demo-media/home/crm.jpg", title: "לכל ליד יש צעד הבא", body: "שמרו לידים, רשומות לקוח והמשך טיפול ב־CRM אחד, עם סטטוס שהצוות יכול לעבוד איתו.", cta: "ל־CRM", href: "/crm" },
      { id: "whatsapp", film: "/demo-media/home/whatsapp.mp4", poster: "/demo-media/home/whatsapp.jpg", title: "השיחה נשארת עם הלקוח", body: "שיחות WhatsApp Business יושבות ליד הרשומה, כך שהמענה הוא חלק מהעבודה.", cta: "ל־WhatsApp", href: "/whatsapp-api" },
      { id: "marketing", film: "/demo-media/home/campaigns.mp4", poster: "/demo-media/home/campaigns.jpg", title: "רואים את הקמפיין, ואז את הליד", body: "בדקו פעילות Meta נתמכת ואת הפניות שמגיעות להמשך טיפול. המספרים על המסך הם נתוני הדגמה.", cta: "לשיווק", href: "/meta-campaigns" },
      { id: "automations", film: "/demo-media/home/automations.mp4", poster: "/demo-media/home/automations.jpg", title: "אפשר להכין את הפעולה הבאה", body: "בנו תהליכים לטריגרים ולפעולות שהמסלול תומך בהם, במקום להשאיר כל שלב ידני.", cta: "לאוטומציות", href: "/automations" },
    ] as Scene[],
  },
  es: {
    kicker: "La plataforma de negocio conectada",
    flowTitle: "Del primer clic a la siguiente conversación",
    flowLead: "Las consultas de canales compatibles pueden llegar al CRM de Bizuply, seguir en WhatsApp y pasar por las automatizaciones que configure.",
    flowNote: "Los canales mostrados son los que Bizuply ya presenta. No es una promesa de que cada cuenta publicitaria se conecte sola.",
    crm: "CRM",
    whatsapp: "WhatsApp",
    automation: "Automatización",
    storyKicker: "Desplace el espacio de trabajo",
    demo: "Datos de demostración",
    pause: "Pausa",
    play: "Reproducir",
    webKicker: "Creador de sitios",
    webTitle: "Un sitio que sigue trabajando después del clic",
    webBody: "Cree un sitio profesional, ajuste el diseño y conecte las consultas compatibles con el trabajo con el cliente.",
    webCta: "Crear su sitio",
    finalTitle: "Reúna el trabajo en un solo lugar",
    finalLead: "Clientes, conversaciones, marketing y el seguimiento que viene después. Un espacio Bizuply.",
    finalStart: "Empezar",
    finalExplore: "Explorar la plataforma",
    scenes: [
      { id: "crm", film: "/demo-media/home/crm.mp4", poster: "/demo-media/home/crm.jpg", title: "Cada lead tiene un siguiente paso", body: "Guarde leads, fichas de cliente y seguimiento en un CRM, con un estado que el equipo pueda usar.", cta: "Explorar CRM", href: "/crm" },
      { id: "whatsapp", film: "/demo-media/home/whatsapp.mp4", poster: "/demo-media/home/whatsapp.jpg", title: "La conversación se queda con el cliente", body: "Las conversaciones de WhatsApp Business quedan junto a la ficha, así que la respuesta forma parte del trabajo.", cta: "Explorar WhatsApp", href: "/whatsapp-api" },
      { id: "marketing", film: "/demo-media/home/campaigns.mp4", poster: "/demo-media/home/campaigns.jpg", title: "Vea la campaña y después el lead", body: "Revise la actividad de Meta compatible y las consultas que llegan para el seguimiento. Las cifras son datos de demostración.", cta: "Explorar marketing", href: "/meta-campaigns" },
      { id: "automations", film: "/demo-media/home/automations.mp4", poster: "/demo-media/home/automations.jpg", title: "La siguiente acción puede quedar preparada", body: "Cree flujos para los activadores y las acciones que admite su plan, en lugar de dejar cada paso en manual.", cta: "Explorar automatizaciones", href: "/automations" },
    ] as Scene[],
  },
  "pt-BR": {
    kicker: "A plataforma de negócios conectada",
    flowTitle: "Do primeiro clique à próxima conversa",
    flowLead: "Consultas de canais compatíveis podem chegar ao CRM da Bizuply, seguir no WhatsApp e passar pelas automações que você configurar.",
    flowNote: "Os canais mostrados são os que a Bizuply já apresenta. Isso não promete que toda conta de anúncio se conecte sozinha.",
    crm: "CRM",
    whatsapp: "WhatsApp",
    automation: "Automação",
    storyKicker: "Role o espaço de trabalho",
    demo: "Dados de demonstração",
    pause: "Pausar",
    play: "Reproduzir",
    webKicker: "Criador de sites",
    webTitle: "Um site que continua trabalhando depois do clique",
    webBody: "Crie um site profissional, ajuste o visual e conecte consultas compatíveis ao fluxo com o cliente.",
    webCta: "Criar seu site",
    finalTitle: "Junte o trabalho em um só lugar",
    finalLead: "Clientes, conversas, marketing e o acompanhamento que vem depois. Um espaço Bizuply.",
    finalStart: "Começar",
    finalExplore: "Explorar a plataforma",
    scenes: [
      { id: "crm", film: "/demo-media/home/crm.mp4", poster: "/demo-media/home/crm.jpg", title: "Todo lead tem um próximo passo", body: "Guarde leads, fichas de cliente e acompanhamento em um CRM, com um status que a equipe consiga usar.", cta: "Explorar CRM", href: "/crm" },
      { id: "whatsapp", film: "/demo-media/home/whatsapp.mp4", poster: "/demo-media/home/whatsapp.jpg", title: "A conversa fica com o cliente", body: "As conversas do WhatsApp Business ficam ao lado do registro, então a resposta faz parte do trabalho.", cta: "Explorar WhatsApp", href: "/whatsapp-api" },
      { id: "marketing", film: "/demo-media/home/campaigns.mp4", poster: "/demo-media/home/campaigns.jpg", title: "Veja a campanha e depois o lead", body: "Revise a atividade de Meta compatível e as consultas que chegam para acompanhamento. Os números são dados de demonstração.", cta: "Explorar marketing", href: "/meta-campaigns" },
      { id: "automations", film: "/demo-media/home/automations.mp4", poster: "/demo-media/home/automations.jpg", title: "A próxima ação pode ficar pronta", body: "Monte fluxos para os gatilhos e as ações que o plano permite, em vez de deixar cada etapa manual.", cta: "Explorar automações", href: "/automations" },
    ] as Scene[],
  },
  ar: {
    kicker: "منصة الأعمال المتصلة",
    flowTitle: "من النقرة الأولى إلى المحادثة التالية",
    flowLead: "يمكن لاستفسارات القنوات المدعومة أن تصل إلى CRM في Bizuply، ثم تتابع في WhatsApp وتمر بالأتمتة التي تعدّونها.",
    flowNote: "القنوات المعروضة هي التي تعرضها Bizuply أصلًا. هذا ليس وعدًا بأن كل حساب إعلانات يتصل تلقائيًا.",
    crm: "CRM",
    whatsapp: "WhatsApp",
    automation: "أتمتة",
    storyKicker: "مرّروا داخل مساحة العمل",
    demo: "بيانات توضيحية",
    pause: "إيقاف",
    play: "تشغيل",
    webKicker: "منشئ المواقع",
    webTitle: "موقع يواصل العمل بعد النقرة",
    webBody: "ابنوا موقعًا احترافيًا، شكّلوا التصميم، واربطوا الاستفسارات المدعومة بسير العمل مع العميل.",
    webCta: "ابنوا موقعكم",
    finalTitle: "اجمعوا العمل في مكان واحد",
    finalLead: "العملاء والمحادثات والتسويق والمتابعة التي تأتي بعدها. مساحة عمل واحدة من Bizuply.",
    finalStart: "ابدأوا",
    finalExplore: "استكشفوا المنصة",
    scenes: [
      { id: "crm", film: "/demo-media/home/crm.mp4", poster: "/demo-media/home/crm.jpg", title: "لكل عميل محتمل خطوة تالية", body: "احتفظوا بالعملاء المحتملين وسجلات العملاء والمتابعة في CRM واحد، بحالة يستطيع الفريق استخدامها.", cta: "استكشفوا CRM", href: "/crm" },
      { id: "whatsapp", film: "/demo-media/home/whatsapp.mp4", poster: "/demo-media/home/whatsapp.jpg", title: "تبقى المحادثة مع العميل", body: "محادثات WhatsApp Business تقف بجانب السجل، فيصبح الرد جزءًا من العمل.", cta: "استكشفوا WhatsApp", href: "/whatsapp-api" },
      { id: "marketing", film: "/demo-media/home/campaigns.mp4", poster: "/demo-media/home/campaigns.jpg", title: "شاهدوا الحملة ثم العميل المحتمل", body: "راجعوا نشاط Meta المدعوم والاستفسارات التي تصل للمتابعة. الأرقام على الشاشة بيانات توضيحية.", cta: "استكشفوا التسويق", href: "/meta-campaigns" },
      { id: "automations", film: "/demo-media/home/automations.mp4", poster: "/demo-media/home/automations.jpg", title: "يمكن تجهيز الإجراء التالي", body: "ابنوا مسارات للمحفّزات والإجراءات التي تدعمها خطتكم، بدل ترك كل خطوة يدوية.", cta: "استكشفوا الأتمتة", href: "/automations" },
    ] as Scene[],
  },
} as const;

function keptHero() {
  if (typeof document === "undefined") return false;
  return Boolean(document.querySelector("#bizuply-first-paint .home-hero, [data-kept-hero]"));
}

function Hero({ kicker, title, lead, note, start, explore }: { kicker: string; title: string; lead: string; note: string; start: string; explore: string }) {
  const stage = useRef<HTMLDivElement>(null);
  return (
    <section
      className="home-hero cine-hero"
      onPointerMove={(event) => {
        const node = stage.current;
        if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const box = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - box.left) / box.width - 0.5;
        const y = (event.clientY - box.top) / box.height - 0.5;
        node.style.transform = `rotateY(${x * 7}deg) rotateX(${-y * 5}deg)`;
      }}
      onPointerLeave={() => {
        if (stage.current) stage.current.style.transform = "";
      }}
    >
      <div className="cine-hero__light" aria-hidden="true" />
      <div className="cine-hero__copy">
        <p className="cine-kicker">{kicker}</p>
        <h1 className="home-hero__title">{title}</h1>
        <p className="home-hero__lead">{lead}</p>
        <p className="home-hero__note">{note}</p>
        <div className="cine-hero__actions">
          <Link className="cine-btn cine-btn--solid" to="/register">{start}</Link>
          <Link className="cine-btn cine-btn--line" to="/platform">{explore}</Link>
        </div>
      </div>
      <div className="cine-stage" ref={stage} aria-hidden="true">
        <article className="cine-panel cine-panel--crm">
          <header><i /><i /><i /><b>CRM</b></header>
          <ul>
            <li><span>Charlotte Davis</span><em>New</em></li>
            <li><span>Michael Anderson</span><em>Contacted</em></li>
            <li><span>Emily Parker</span><em>Interested</em></li>
          </ul>
        </article>
        <article className="cine-phone">
          <header>WhatsApp</header>
          <p>Can we review the proposal this week?</p>
          <p className="is-out">Thursday at 11:00 works.</p>
        </article>
        <article className="cine-panel cine-panel--ads">
          <header>Campaign</header>
          <div className="cine-bars"><span /><span /><span /><span /></div>
          <small>Demo data</small>
        </article>
      </div>
    </section>
  );
}

export default function CinematicHome() {
  const { t, i18n } = useTranslation();
  const locale = normalizeMarketingLocale(i18n.language);
  const copy = COPY[locale as keyof typeof COPY] || COPY.en;
  const root = useRef<HTMLDivElement>(null);
  const [skipHero, setSkipHero] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => setSkipHero(keptHero()), []);

  useEffect(() => {
    if (!skipHero) return undefined;
    const hero = document.querySelector<HTMLElement>("#bizuply-first-paint .home-hero");
    const stage = hero?.querySelector<HTMLElement>(".cine-stage");
    if (!hero || !stage || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const move = (event: PointerEvent) => {
      const box = hero.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      stage.style.transform = `rotateY(${x * 7}deg) rotateX(${-y * 5}deg)`;
    };
    const leave = () => { stage.style.transform = ""; };
    hero.addEventListener("pointermove", move);
    hero.addEventListener("pointerleave", leave);
    return () => {
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", leave);
    };
  }, [skipHero]);

  useEffect(() => {
    const node = root.current;
    if (!node) return undefined;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrow = window.matchMedia("(max-width: 980px)").matches;
    if (reduce || narrow) return undefined;
    let alive = true;
    let revert: (() => void) | undefined;
    document.documentElement.classList.add("cine-motion");
    void import("gsap").then(async ({ default: gsap }) => {
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (!alive) return;
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        const scenes = gsap.utils.toArray<HTMLVideoElement>(".cine-scene");
        const panels = gsap.utils.toArray<HTMLElement>(".cine-pin__panel");
        const bar = node.querySelector<HTMLElement>(".cine-progress span");
        const stage = node.querySelector<HTMLElement>(".cine-pin__stage");
        const frame = node.querySelector<HTMLElement>(".cine-pin__frame");
        if (!scenes.length || !stage || !frame) return;
        gsap.set(scenes, { autoAlpha: 0, scale: 0.92 });
        gsap.set(scenes[0], { autoAlpha: 1, scale: 1 });
        gsap.set(panels, { autoAlpha: 0, y: 28 });
        gsap.set(panels[0], { autoAlpha: 1, y: 0 });
        gsap.fromTo(".cine-wires path", { strokeDashoffset: 420 }, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: { trigger: ".cine-flow", start: "top 80%", end: "bottom 55%", scrub: true },
        });
        gsap.fromTo(".cine-web__media", { y: 48 }, {
          y: -24,
          ease: "none",
          scrollTrigger: { trigger: ".cine-web", start: "top 85%", end: "bottom 20%", scrub: true },
        });
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: ".cine-pin",
            start: "top top",
            end: "+=320%",
            pin: stage,
            scrub: 0.65,
            anticipatePin: 1,
            onUpdate: (self) => {
              stage.style.zIndex = "1";
              if (bar) bar.style.transform = `scaleX(${self.progress})`;
              const active = Math.min(scenes.length - 1, Math.floor(self.progress * scenes.length));
              scenes.forEach((video, index) => {
                if (index === active) void video.play().catch(() => undefined);
                else video.pause();
              });
            },
          },
        });
        timeline.fromTo(frame, { scale: 0.9 }, { scale: 1.05, ease: "none", duration: scenes.length }, 0);
        timeline.to(stage, { backgroundColor: "#06281c", duration: 1 }, 1);
        timeline.to(stage, { backgroundColor: "#1a1030", duration: 1 }, 2);
        timeline.to(stage, { backgroundColor: "#0c1e33", duration: 1 }, 3);
        scenes.forEach((scene, index) => {
          if (index === 0) return;
          timeline
            .to(scenes[index - 1], { autoAlpha: 0, scale: 1.08, duration: 0.45 }, index)
            .to(panels[index - 1], { autoAlpha: 0, y: -28, duration: 0.35 }, index)
            .fromTo(scene, { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.45 }, index)
            .fromTo(panels[index], { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.4 }, index);
        });
      }, node);
      revert = () => ctx.revert();
    });
    return () => {
      alive = false;
      revert?.();
      document.documentElement.classList.remove("cine-motion");
    };
  }, [locale]);

  const marks = [
    ["Meta", "/meta-campaigns"],
    ["Facebook", "/meta-campaigns"],
    ["Instagram", "/meta-campaigns"],
    ["Google Ads", "/crm"],
    ["WhatsApp", "/whatsapp-api"],
  ] as const;

  return (
    <div className="cine" ref={root} dir={locale === "he" || locale === "ar" ? "rtl" : "ltr"}>
      {skipHero ? null : (
        <Hero
          kicker={copy.kicker}
          title={t("home.headline")}
          lead={t("home.subtitle")}
          note={t("home.supportLine")}
          start={t("home.startTrial")}
          explore={t("home.explore")}
        />
      )}

      <section className="cine-flow">
        <div className="cine-wrap">
          <div className="cine-flow__head">
            <p className="cine-kicker">{copy.kicker}</p>
            <h2>{copy.flowTitle}</h2>
            <p className="cine-lead">{copy.flowLead}</p>
          </div>
          <div className="cine-map">
            <svg className="cine-wires" viewBox="0 0 1000 280" preserveAspectRatio="none" aria-hidden="true">
              <path d="M180 40 C 320 40, 340 140, 500 140" />
              <path d="M180 110 C 330 110, 360 140, 500 140" />
              <path d="M180 180 C 330 180, 360 140, 500 140" />
              <path d="M180 250 C 320 250, 340 140, 500 140" />
              <path d="M620 140 C 740 140, 760 70, 860 70" />
              <path d="M620 140 C 740 140, 760 210, 860 210" />
            </svg>
            <div className="cine-nodes">
              {marks.slice(0, 4).map(([label, href], index) => (
                <Link key={label} className="cine-node" to={href}>
                  <Mark index={index} />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
            <span />
            <div className="cine-core">
              <Link to="/crm">{copy.crm}</Link>
            </div>
            <span />
            <div className="cine-out">
              <Link to="/whatsapp-api"><Mark index={4} /><span>{copy.whatsapp}</span></Link>
              <Link to="/automations"><span>{copy.automation}</span></Link>
            </div>
          </div>
          <p className="cine-flow__note">{copy.flowNote}</p>
        </div>
      </section>

      <section className="cine-pin">
        <div className="cine-pin__stage">
          <div className="cine-pin__copy">
            <p className="cine-kicker">{copy.storyKicker}</p>
            {copy.scenes.map((scene) => (
              <article className="cine-pin__panel" key={scene.id}>
                <h2>{scene.title}</h2>
                <p>{scene.body}</p>
                <Link className="cine-btn cine-btn--solid" to={scene.href}>{scene.cta}</Link>
              </article>
            ))}
          </div>
          <div className="cine-pin__frame">
            {copy.scenes.map((scene) => (
              <video
                key={scene.film}
                className="cine-scene"
                src={scene.film}
                poster={scene.poster}
                muted
                playsInline
                loop
                autoPlay={scene.id === "crm"}
                preload="metadata"
                aria-label={scene.title}
              />
            ))}
            <button
              type="button"
              className="cine-pin__pause"
              onClick={(event) => {
                const frame = event.currentTarget.parentElement;
                const videos = frame?.querySelectorAll("video") || [];
                const next = !paused;
                videos.forEach((video) => (next ? video.pause() : void video.play()));
                setPaused(next);
              }}
            >
              {paused ? copy.play : copy.pause}
            </button>
          </div>
          <div className="cine-progress" aria-hidden="true"><span /></div>
        </div>
      </section>

      <section className="cine-web cine-wrap">
        <div className="cine-web__media">
          <img src="/demo-media/forms/lead.webp" alt="" width="960" height="600" />
          <img className="cine-web__phone" src="/demo-media/websites/my-sites.jpg" alt="" width="360" height="640" />
        </div>
        <div>
          <p className="cine-kicker">{copy.webKicker}</p>
          <h2>{copy.webTitle}</h2>
          <p className="cine-lead">{copy.webBody}</p>
          <p className="cine-note">{copy.demo}</p>
          <Link className="cine-btn cine-btn--ink" to="/website-builder">{copy.webCta}</Link>
        </div>
      </section>

      <section className="cine-final">
        <div className="cine-wrap">
          <h2>{copy.finalTitle}</h2>
          <p>{copy.finalLead}</p>
          <div className="cine-hero__actions">
            <Link className="cine-btn cine-btn--solid" to="/register">{copy.finalStart}</Link>
            <Link className="cine-btn cine-btn--line" to="/platform">{copy.finalExplore}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Mark({ index }: { index: number }) {
  const marks = [
    <svg key="meta" className="cine-mark" viewBox="0 0 32 32" aria-hidden="true"><path fill="#0081FB" d="M7 16c0-4.2 2.3-7.2 5.4-7.2 2 0 3.4 1.3 4.6 3.2 1.4-1.9 2.8-3.2 4.8-3.2 3.1 0 5.2 3 5.2 7.2s-2.1 7.2-5.2 7.2c-2 0-3.4-1.3-4.8-3.2-1.2 1.9-2.6 3.2-4.6 3.2C9.3 23.2 7 20.2 7 16z" /></svg>,
    <svg key="fb" className="cine-mark" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#0866FF" /><path fill="#fff" d="M18.2 16.6h2.4l.5-2.6h-2.9V12.6c0-.8.3-1.3 1.4-1.3H21V8.7c-.4 0-1.1-.1-2-.1-2.3 0-3.8 1.4-3.8 3.9v1.5H13v2.6h2.2V24h3z" /></svg>,
    <svg key="ig" className="cine-mark" viewBox="0 0 32 32" aria-hidden="true"><defs><linearGradient id="ig2" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#feda75" /><stop offset="50%" stopColor="#d62976" /><stop offset="100%" stopColor="#4f5bd5" /></linearGradient></defs><rect width="32" height="32" rx="8" fill="url(#ig2)" /><rect x="8" y="8" width="16" height="16" rx="5" fill="none" stroke="#fff" strokeWidth="2" /><circle cx="16" cy="16" r="4" fill="none" stroke="#fff" strokeWidth="2" /></svg>,
    <svg key="ads" className="cine-mark" viewBox="0 0 32 32" aria-hidden="true"><path fill="#FBBC04" d="M5 25 16 6l4 7.2L11.5 25z" /><path fill="#4285F4" d="M16 6l11 19h-8l-3.5-6.2z" /><path fill="#34A853" d="M11.5 25H27l-4-7.2h-7.8z" /></svg>,
    <svg key="wa" className="cine-mark" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="16" fill="#25D366" /><path fill="#fff" d="M16 7.6a8.3 8.3 0 0 0-7.2 12.4L8 24.2l4.3-1.1A8.3 8.3 0 1 0 16 7.6zm4.6 11.6c-.2.6-1.1 1-1.6 1.1-.4 0-.9.2-3-.7-2.5-1-4-3.5-4.2-3.7-.1-.2-1.2-1.6-1.2-3.1s.8-2.2 1.1-2.5c.2-.3.6-.4.8-.4h.5c.2 0 .4 0 .6.5.2.5.7 1.9.8 2 .1.2 0 .3-.1.5l-.4.4c-.1.2-.3.3-.1.6.1.3.7 1.1 1.4 1.8.9.8 1.7 1.1 2 .1.3.1.4.1.6-.1l.6-.8c.2-.2.3-.2.6-.1.2.1 1.5.7 1.8.9.2.1.4.2.4.3.1.3.1.7-.1 1.2z" /></svg>,
  ];
  return marks[index] || null;
}
