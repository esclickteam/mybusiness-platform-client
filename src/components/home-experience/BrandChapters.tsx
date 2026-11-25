import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../i18n/localeUtils";
import { cinematicFor } from "../../lib/homeCinematic.mjs";

type Slot = "platform" | "journey" | "close";

type Pack = { he: string; en: string; es: string; pt: string; ar: string };

function say(language: string, pack: Pack) {
  const value = language.toLowerCase();
  if (value.startsWith("he") || value.startsWith("iw")) return pack.he;
  if (value.startsWith("es")) return pack.es;
  if (value.startsWith("pt")) return pack.pt;
  if (value.startsWith("ar")) return pack.ar;
  return pack.en;
}

function useReduced() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false,
  );
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(query.matches);
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);
  return reduced;
}

function useNarrow() {
  const [match, setMatch] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 860px)").matches : false,
  );
  useEffect(() => {
    const list = window.matchMedia("(max-width: 860px)");
    const apply = () => setMatch(list.matches);
    apply();
    list.addEventListener("change", apply);
    return () => list.removeEventListener("change", apply);
  }, []);
  return match;
}

const PRODUCTS: { to: string; title: Pack; body: Pack }[] = [
  {
    to: "/crm",
    title: { he: "CRM", en: "CRM", es: "CRM", pt: "CRM", ar: "CRM" },
    body: {
      he: "ליד נכנס, כרטיס לקוח נפתח, והסטטוס מתעדכן באותו תהליך מכירה.",
      en: "A lead arrives, the customer card opens, and the status moves in the same sales flow.",
      es: "Entra un lead, se abre la ficha y el estado avanza en el mismo flujo.",
      pt: "Um lead entra, a ficha abre e o status avança no mesmo fluxo.",
      ar: "يصل عميل محتمل، وتفتح البطاقة، ويتقدم الوضع في المسار نفسه.",
    },
  },
  {
    to: "/whatsapp-api",
    title: { he: "WhatsApp", en: "WhatsApp", es: "WhatsApp", pt: "WhatsApp", ar: "WhatsApp" },
    body: {
      he: "שיחה, תבניות מאושרות והמשך טיפול שמקושר לכרטיס הלקוח.",
      en: "A thread, approved templates, and follow-up tied to the customer card.",
      es: "Una conversación, plantillas aprobadas y seguimiento ligado a la ficha.",
      pt: "Uma conversa, modelos aprovados e acompanhamento ligado à ficha.",
      ar: "محادثة وقوالب معتمدة ومتابعة مرتبطة ببطاقة العميل.",
    },
  },
  {
    to: "/automations",
    title: { he: "אוטומציות", en: "Automations", es: "Automatización", pt: "Automações", ar: "الأتمتة" },
    body: {
      he: "טריגר, תנאי ופעולה — למשל ליד חדש שיוצר משימת המשך בחבילה העסקית.",
      en: "A trigger, a condition and an action — a new lead can create a follow-up task on the business plan.",
      es: "Un disparador, una condición y una acción. Un lead nuevo puede crear una tarea.",
      pt: "Um gatilho, uma condição e uma ação. Um lead novo pode criar uma tarefa.",
      ar: "مشغّل وشرط وإجراء. يمكن لعميل محتمل جديد أن ينشئ مهمة متابعة.",
    },
  },
  {
    to: "/meta-campaigns",
    title: { he: "Meta ושיווק", en: "Meta and marketing", es: "Meta y marketing", pt: "Meta e marketing", ar: "Meta والتسويق" },
    body: {
      he: "קמפיינים של Meta, עם לידים שיכולים להיכנס ל־CRM.",
      en: "Meta campaigns, with leads that can enter the CRM.",
      es: "Campañas de Meta, con leads que pueden entrar al CRM.",
      pt: "Campanhas da Meta, com leads que podem entrar no CRM.",
      ar: "حملات Meta، مع عملاء محتملين يمكن أن يدخلوا إلى CRM.",
    },
  },
  {
    to: "/agents",
    title: { he: "AI", en: "AI", es: "IA", pt: "IA", ar: "الذكاء الاصطناعي" },
    body: {
      he: "תובנות והצעות לפעולה הבאה, מתוך מה שכבר קיים במערכת.",
      en: "Insights and a suggested next step, from what is already in the system.",
      es: "Ideas y un siguiente paso sugerido, a partir de lo que ya está en el sistema.",
      pt: "Insights e um próximo passo sugerido, a partir do que já está no sistema.",
      ar: "رؤى وخطوة تالية مقترحة، مما هو موجود أصلاً في النظام.",
    },
  },
  {
    to: "/appointments",
    title: { he: "יומן ופגישות", en: "Calendar", es: "Calendario", pt: "Agenda", ar: "التقويم" },
    body: {
      he: "קובעים מועד, מנהלים זמינות ומעדכנים את היומן.",
      en: "Pick a time, manage availability, and update the calendar.",
      es: "Elija un horario, gestione la disponibilidad y actualice el calendario.",
      pt: "Escolha um horário, gerencie a disponibilidade e atualize a agenda.",
      ar: "اختيار موعد وإدارة التوفر وتحديث التقويم.",
    },
  },
  {
    to: "/website-builder",
    title: { he: "בניית אתרים", en: "Websites", es: "Sitios", pt: "Sites", ar: "المواقع" },
    body: {
      he: "עורך האתר, תבניות, וטופס נתמך שיכול ליצור ליד ב־CRM.",
      en: "The site editor, templates, and a supported form that can create a CRM lead.",
      es: "El editor, plantillas y un formulario compatible que puede crear un lead.",
      pt: "O editor, modelos e um formulário compatível que pode criar um lead.",
      ar: "المحرر والقوالب ونموذج مدعوم يمكن أن ينشئ عميلاً محتملاً.",
    },
  },
];

const SOLUTIONS: { to: string; title: Pack }[] = [
  { to: "/solutions/clinics", title: { he: "קליניקות", en: "Clinics", es: "Clínicas", pt: "Clínicas", ar: "عيادات" } },
  { to: "/solutions/beauty", title: { he: "מכוני יופי", en: "Beauty", es: "Belleza", pt: "Beleza", ar: "التجميل" } },
  { to: "/solutions/real-estate", title: { he: "נדל״ן", en: "Real estate", es: "Inmuebles", pt: "Imóveis", ar: "العقارات" } },
  { to: "/solutions/restaurants", title: { he: "מסעדות", en: "Restaurants", es: "Restaurantes", pt: "Restaurantes", ar: "المطاعم" } },
  { to: "/solutions/service", title: { he: "נותני שירות", en: "Service businesses", es: "Servicios", pt: "Serviços", ar: "الخدمات" } },
  { to: "/solutions/agencies", title: { he: "סוכנויות", en: "Agencies", es: "Agencias", pt: "Agências", ar: "الوكالات" } },
];

function Platform({ language }: { language: string }) {
  return (
    <section className="bz-platform" data-bz-tone="paper" aria-labelledby="bz-platform-title">
      <div className="bz-platform__mark" aria-hidden="true">
        <img src="/brand/mark.png" alt="" width="679" height="819" />
      </div>
      <p className="bz-kicker">{say(language, { he: "הפלטפורמה", en: "The platform", es: "La plataforma", pt: "A plataforma", ar: "المنصة" })}</p>
      <h2 id="bz-platform-title">
        {say(language, {
          he: "לא עוד מערכת לכל משימה.",
          en: "Not another tool for every task.",
          es: "No otra herramienta para cada tarea.",
          pt: "Não mais uma ferramenta para cada tarefa.",
          ar: "ليس أداة أخرى لكل مهمة.",
        })}
      </h2>
      <p className="bz-lead">
        {say(language, {
          he: "ליד, לקוח, שיחה, משימה ואוטומציה יושבים באותו מקום. הגלילה הבאה מראה איך זה נראה בתוך BizUply.",
          en: "A lead, a customer, a conversation, a task and an automation sit in one place. The next scroll shows that inside BizUply.",
          es: "Un lead, un cliente, una conversación, una tarea y una automatización viven juntos.",
          pt: "Um lead, um cliente, uma conversa, uma tarefa e uma automação ficam no mesmo lugar.",
          ar: "العميل المحتمل والعميل والمحادثة والمهمة والأتمتة في مكان واحد.",
        })}
      </p>
      <ol className="bz-flow">
        {[
          { he: "פנייה", en: "Inquiry", es: "Consulta", pt: "Contato", ar: "استفسار" },
          { he: "CRM", en: "CRM", es: "CRM", pt: "CRM", ar: "CRM" },
          { he: "המשך", en: "Follow-up", es: "Seguimiento", pt: "Retorno", ar: "متابعة" },
          { he: "שיחה", en: "Conversation", es: "Conversación", pt: "Conversa", ar: "محادثة" },
          { he: "פגישה", en: "Meeting", es: "Reunión", pt: "Reunião", ar: "اجتماع" },
        ].map((item, index) => (
          <li key={item.en}>
            <span>0{index + 1}</span>
            {say(language, { ...item, pt: item.pt })}
          </li>
        ))}
      </ol>
    </section>
  );
}

function Journey({ language }: { language: string }) {
  const reduced = useReduced();
  const narrow = useNarrow();
  const ref = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const cine = cinematicFor(language);
  const steps = (cine.hero.processCopy || []) as [string, string][];
  const labels = (cine.hero.processSteps || []) as [string, string][];

  useEffect(() => {
    const node = ref.current;
    if (!node || reduced || narrow) return undefined;
    const read = () => {
      const rect = node.getBoundingClientRect();
      const total = node.offsetHeight - window.innerHeight;
      const next = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      setProgress(next);
    };
    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, [narrow, reduced]);

  const count = Math.max(steps.length, 1);
  const active = reduced || narrow ? 0 : Math.min(count - 1, Math.floor(progress * count));
  const stack = reduced || narrow;

  return (
    <section
      className={stack ? "bz-journey is-stack" : "bz-journey"}
      data-bz-tone="pink"
      ref={ref}
      aria-labelledby="bz-journey-title"
    >
      <div className="bz-journey__sticky">
        <div className="bz-journey__copy">
          <p className="bz-kicker">
            {say(language, { he: "מסע אחד", en: "One journey", es: "Un recorrido", pt: "Uma jornada", ar: "مسار واحد" })}
          </p>
          <h2 id="bz-journey-title">
            {say(language, {
              he: "מהפנייה הראשונה עד הרשומה המעודכנת.",
              en: "From the first inquiry to the updated record.",
              es: "De la primera consulta a la ficha actualizada.",
              pt: "Do primeiro contato ao registo atualizado.",
              ar: "من أول استفسار حتى السجل المحدّث.",
            })}
          </h2>
          <p>{steps[active]?.[1]}</p>
        </div>
        <ol className="bz-journey__steps">
          {steps.map((step, index) => (
            <li key={step[0]} className={index === active ? "is-on" : index < active ? "is-done" : ""}>
              <span>{labels[index]?.[1] || String(index + 1)}</span>
              <strong>{step[0]}</strong>
            </li>
          ))}
        </ol>
        <svg className="bz-journey__line" viewBox="0 0 120 640" aria-hidden="true">
          <path d="M60 16 V624" />
          <path
            d="M60 16 V624"
            style={{ strokeDashoffset: stack ? 0 : 608 - progress * 608 }}
          />
        </svg>
      </div>
    </section>
  );
}

function Close({ language }: { language: string }) {
  const reduced = useReduced();
  const narrow = useNarrow();
  const railRef = useRef<HTMLDivElement | null>(null);
  const [shift, setShift] = useState(0);
  const dir = getTextDirection(language);

  useEffect(() => {
    const node = railRef.current;
    if (!node || reduced || narrow) return undefined;
    const read = () => {
      const rect = node.getBoundingClientRect();
      const total = node.offsetHeight - window.innerHeight;
      const progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      const track = node.querySelector<HTMLElement>(".bz-rail__track");
      const travel = track ? Math.max(0, track.scrollWidth - node.clientWidth + 48) : 0;
      setShift(progress * travel);
    };
    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, [narrow, reduced]);

  const stack = reduced || narrow;

  return (
    <>
      <section
        className={stack ? "bz-rail is-stack" : "bz-rail"}
        data-bz-tone="yellow"
        ref={railRef}
        aria-labelledby="bz-rail-title"
      >
        <div className="bz-rail__sticky">
          <h2 id="bz-rail-title">
            {say(language, {
              he: "כל מודול. אותה מערכת.",
              en: "Every module. The same system.",
              es: "Cada módulo. El mismo sistema.",
              pt: "Cada módulo. O mesmo sistema.",
              ar: "كل وحدة. النظام نفسه.",
            })}
          </h2>
          <div className="bz-rail__window">
            <div
              className="bz-rail__track"
              style={stack ? undefined : { transform: `translate3d(${dir === "rtl" ? shift : -shift}px,0,0)` }}
            >
              {PRODUCTS.map((item) => (
                <Link key={item.to} to={item.to} className="bz-rail__card">
                  <b>{say(language, item.title)}</b>
                  <span>{say(language, item.body)}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bz-solutions" data-bz-tone="paper" aria-labelledby="bz-solutions-title">
        <h2 id="bz-solutions-title">
          {say(language, {
            he: "לפי סוג העסק",
            en: "By the kind of business",
            es: "Según el tipo de negocio",
            pt: "Pelo tipo de negócio",
            ar: "حسب نوع العمل",
          })}
        </h2>
        <div className="bz-solutions__grid">
          {SOLUTIONS.map((item) => (
            <Link key={item.to} to={item.to}>
              {say(language, item.title)}
            </Link>
          ))}
        </div>
        <div className="bz-links">
          <Link to="/partners">
            {say(language, { he: "תוכנית שותפים", en: "Partner program", es: "Programa de socios", pt: "Programa de parceiros", ar: "برنامج الشركاء" })}
          </Link>
          <Link to="/guides">
            {say(language, { he: "מרכז הידע", en: "Knowledge center", es: "Centro de conocimiento", pt: "Central de conhecimento", ar: "مركز المعرفة" })}
          </Link>
          <Link to="/pricing">
            {say(language, { he: "מחירים", en: "Pricing", es: "Precios", pt: "Preços", ar: "الأسعار" })}
          </Link>
          <Link to="/contact">
            {say(language, { he: "יצירת קשר", en: "Contact", es: "Contacto", pt: "Contato", ar: "تواصل" })}
          </Link>
        </div>
      </section>

      <section className="bz-final" data-bz-tone="navy" aria-labelledby="bz-final-title">
        <h2 id="bz-final-title">
          {say(language, {
            he: "מתחילים ממקום אחד.",
            en: "Start from one place.",
            es: "Empiece desde un solo lugar.",
            pt: "Comece de um só lugar.",
            ar: "ابدأوا من مكان واحد.",
          })}
        </h2>
        <p>
          {say(language, {
            he: "ההקמה, ההתחברות והמעבר לחשבון נשארים כמו שהיו. בוחרים מסלול ונכנסים למערכת.",
            en: "Setup, sign-in and the path into the account stay as they are. Pick a plan and open the workspace.",
            es: "La configuración, el acceso y el camino a la cuenta siguen igual.",
            pt: "A configuração, o acesso e o caminho até a conta continuam iguais.",
            ar: "الإعداد وتسجيل الدخول والانتقال إلى الحساب يبقون كما هم.",
          })}
        </p>
        <div className="bz-final__actions">
          <Link to="/register">{say(language, { he: "התחילו עכשיו", en: "Get Started", es: "Empieza ahora", pt: "Comece agora", ar: "ابدأ الآن" })}</Link>
          <Link to="/pricing">{say(language, { he: "למחירים", en: "See pricing", es: "Ver precios", pt: "Ver preços", ar: "الأسعار" })}</Link>
        </div>
      </section>
    </>
  );
}

export default function BrandChapters({ slot }: { slot: Slot }) {
  const { i18n } = useTranslation();
  const language = i18n.language || "en";
  if (slot === "platform") return <Platform language={language} />;
  if (slot === "journey") return <Journey language={language} />;
  return <Close language={language} />;
}
