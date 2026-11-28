import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import API from "../../api";
import { useAuth } from "../../context/AuthContext";
import AdminPageHeader from "./shell/AdminPageHeader";
import { adminLanguageCode } from "./shell/adminShellCopy";

type AdminStats = {
  totalUsers: number;
  totalBusinesses: number;
  totalClients: number;
  totalSales: number;
  activeManagers: number;
  blockedUsers: number;
  earlyAccessCount: number;
};

const initialStats: AdminStats = {
  totalUsers: 0,
  totalBusinesses: 0,
  totalClients: 0,
  totalSales: 0,
  activeManagers: 0,
  blockedUsers: 0,
  earlyAccessCount: 0,
};

const SHORTCUT_PATHS = [
  "/admin/customers",
  "/admin/guided-demos",
  "/admin/users",
  "/admin/early-access",
  "/admin/affiliates",
  "/admin/businesses",
  "/admin/affiliate-payouts",
  "/admin/withdrawals",
] as const;

const DASHBOARD_COPY = {
  he: {
    hello: "שלום",
    fallbackName: "מנהל",
    description: "סקירה קצרה של משתמשים, עסקים, מכירות והרשמות.",
    loading: "טוען נתונים",
    connected: "מחובר לשרת",
    offline: "אין חיבור לשרת",
    earlyAccessAction: "הרשמות מוקדמות",
    loadError: "לא ניתן לטעון נתונים מהשרת",
    users: "משתמשים",
    usersNote: "כל המשתמשים הרשומים",
    businesses: "עסקים",
    businessesNote: "עסקים שנפתחו במערכת",
    clients: "לקוחות ושותפים",
    clientsNote: "לקוחות פעילים ורשומים",
    earlyAccess: "הרשמות מוקדמות",
    earlyAccessNote: "נרשמים מטופס ההשקה",
    sales: "סך מכירות",
    salesNote: "סה״כ הכנסות שנמדדו",
    managers: "מנהלים פעילים",
    managersNote: "מנהלי מערכת פעילים",
    blocked: "משתמשים חסומים",
    blockedNote: "חשבונות שנחסמו",
    shortcuts: "קיצורי דרך",
    help: "מרכז עזרה",
    privacy: "מדיניות פרטיות",
    terms: "תנאי שימוש",
    shortcutText: [
      ["לקוחות", "חשבונות, חבילות ותשלום"],
      ["דמואים", "שליחת דמו אישי לליד"],
      ["משתמשים", "צפייה, חסימה וכניסה לחשבון"],
      ["הרשמה מוקדמת", "נרשמים מטופס ההשקה"],
      ["שותפים", "אפיליאייטים ופרטנרים"],
      ["עסקים", "כניסה לפי הרשאות החבילה"],
      ["תשלומי שותפים", "מעקב אחרי עמלות"],
      ["משיכות", "בדיקה ואישור בקשות"],
    ],
  },
  en: {
    hello: "Hello",
    fallbackName: "Admin",
    description: "A short view of users, businesses, sales, and signups.",
    loading: "Loading data",
    connected: "Connected to the server",
    offline: "No server connection",
    earlyAccessAction: "Early access",
    loadError: "The server data could not be loaded",
    users: "Users",
    usersNote: "Every registered user",
    businesses: "Businesses",
    businessesNote: "Businesses opened in the system",
    clients: "Clients and partners",
    clientsNote: "Active and registered clients",
    earlyAccess: "Early access",
    earlyAccessNote: "People who joined from the launch form",
    sales: "Total sales",
    salesNote: "Measured revenue",
    managers: "Active managers",
    managersNote: "Active system managers",
    blocked: "Blocked users",
    blockedNote: "Accounts that were blocked",
    shortcuts: "Shortcuts",
    help: "Help center",
    privacy: "Privacy policy",
    terms: "Terms of use",
    shortcutText: [
      ["Customers", "Accounts, plans, and payment"],
      ["Demos", "Send a personal demo to a lead"],
      ["Users", "View, block, and enter an account"],
      ["Early access", "People from the launch form"],
      ["Partners", "Affiliates and partners"],
      ["Businesses", "Open by plan permissions"],
      ["Affiliate payouts", "Track commissions"],
      ["Withdrawals", "Review and approve requests"],
    ],
  },
  es: {
    hello: "Hola",
    fallbackName: "Admin",
    description: "Una vista breve de usuarios, negocios, ventas y registros.",
    loading: "Cargando datos",
    connected: "Conectado al servidor",
    offline: "Sin conexión con el servidor",
    earlyAccessAction: "Acceso anticipado",
    loadError: "No se pudieron cargar los datos del servidor",
    users: "Usuarios",
    usersNote: "Todos los usuarios registrados",
    businesses: "Negocios",
    businessesNote: "Negocios abiertos en el sistema",
    clients: "Clientes y socios",
    clientsNote: "Clientes activos y registrados",
    earlyAccess: "Acceso anticipado",
    earlyAccessNote: "Personas del formulario de lanzamiento",
    sales: "Ventas totales",
    salesNote: "Ingresos medidos",
    managers: "Gestores activos",
    managersNote: "Gestores activos del sistema",
    blocked: "Usuarios bloqueados",
    blockedNote: "Cuentas bloqueadas",
    shortcuts: "Accesos directos",
    help: "Centro de ayuda",
    privacy: "Política de privacidad",
    terms: "Términos de uso",
    shortcutText: [
      ["Clientes", "Cuentas, planes y pago"],
      ["Demos", "Enviar una demo personal a un lead"],
      ["Usuarios", "Ver, bloquear y entrar a una cuenta"],
      ["Acceso anticipado", "Personas del formulario de lanzamiento"],
      ["Socios", "Afiliados y socios"],
      ["Negocios", "Entrar según los permisos del plan"],
      ["Pagos de afiliados", "Seguimiento de comisiones"],
      ["Retiros", "Revisar y aprobar solicitudes"],
    ],
  },
  pt: {
    hello: "Olá",
    fallbackName: "Admin",
    description: "Uma visão curta de usuários, negócios, vendas e cadastros.",
    loading: "Carregando dados",
    connected: "Conectado ao servidor",
    offline: "Sem conexão com o servidor",
    earlyAccessAction: "Acesso antecipado",
    loadError: "Não foi possível carregar os dados do servidor",
    users: "Usuários",
    usersNote: "Todos os usuários cadastrados",
    businesses: "Negócios",
    businessesNote: "Negócios abertos no sistema",
    clients: "Clientes e parceiros",
    clientsNote: "Clientes ativos e cadastrados",
    earlyAccess: "Acesso antecipado",
    earlyAccessNote: "Pessoas do formulário de lançamento",
    sales: "Vendas totais",
    salesNote: "Receita medida",
    managers: "Gestores ativos",
    managersNote: "Gestores ativos do sistema",
    blocked: "Usuários bloqueados",
    blockedNote: "Contas bloqueadas",
    shortcuts: "Atalhos",
    help: "Central de ajuda",
    privacy: "Política de privacidade",
    terms: "Termos de uso",
    shortcutText: [
      ["Clientes", "Contas, planos e pagamento"],
      ["Demos", "Enviar uma demo pessoal a um lead"],
      ["Usuários", "Ver, bloquear e entrar em uma conta"],
      ["Acesso antecipado", "Pessoas do formulário de lançamento"],
      ["Parceiros", "Afiliados e parceiros"],
      ["Negócios", "Entrar pelas permissões do plano"],
      ["Pagamentos de afiliados", "Acompanhar comissões"],
      ["Saques", "Revisar e aprovar pedidos"],
    ],
  },
  ar: {
    hello: "مرحباً",
    fallbackName: "مدير",
    description: "نظرة قصيرة على المستخدمين والأعمال والمبيعات والتسجيلات.",
    loading: "جارٍ تحميل البيانات",
    connected: "متصل بالخادم",
    offline: "لا يوجد اتصال بالخادم",
    earlyAccessAction: "الوصول المبكر",
    loadError: "تعذر تحميل بيانات الخادم",
    users: "المستخدمون",
    usersNote: "كل المستخدمين المسجلين",
    businesses: "الأعمال",
    businessesNote: "الأعمال التي فُتحت في النظام",
    clients: "العملاء والشركاء",
    clientsNote: "عملاء نشطون ومسجلون",
    earlyAccess: "الوصول المبكر",
    earlyAccessNote: "من سجّلوا عبر نموذج الإطلاق",
    sales: "إجمالي المبيعات",
    salesNote: "الإيراد المقاس",
    managers: "المديرون النشطون",
    managersNote: "مديرو النظام النشطون",
    blocked: "مستخدمون محظورون",
    blockedNote: "حسابات تم حظرها",
    shortcuts: "اختصارات",
    help: "مركز المساعدة",
    privacy: "سياسة الخصوصية",
    terms: "شروط الاستخدام",
    shortcutText: [
      ["العملاء", "حسابات وباقات ودفع"],
      ["العروض", "إرسال عرض شخصي لعميل محتمل"],
      ["المستخدمون", "عرض وحظر والدخول إلى حساب"],
      ["الوصول المبكر", "المسجلون من نموذج الإطلاق"],
      ["الشركاء", "مسوّقون وشركاء"],
      ["الأعمال", "الدخول حسب صلاحيات الباقة"],
      ["مدفوعات المسوّقين", "متابعة العمولات"],
      ["السحوبات", "مراجعة الطلبات والموافقة عليها"],
    ],
  },
} as const;

const NUMBER_LOCALE = { he: "he-IL", en: "en-US", es: "es-ES", pt: "pt-BR", ar: "ar" } as const;

function formatNumber(value: number, locale: string) {
  return new Intl.NumberFormat(locale).format(Number(value || 0));
}

function formatMoney(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function MetricCard({
  title,
  value,
  note,
  alert = false,
}: {
  title: string;
  value: string;
  note: string;
  alert?: boolean;
}) {
  return (
    <article className={alert ? "biz-stat-card is-alert" : "biz-stat-card"}>
      <p>{title}</p>
      <strong>{value}</strong>
      <p>{note}</p>
    </article>
  );
}

function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const copy = DASHBOARD_COPY[adminLanguageCode(i18n.resolvedLanguage || i18n.language)];
  const numberLocale = NUMBER_LOCALE[adminLanguageCode(i18n.resolvedLanguage || i18n.language)];

  const [stats, setStats] = useState<AdminStats>(initialStats);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState("");
  const [connectedToServer, setConnectedToServer] = useState(false);

  const displayName = user?.name || user?.email || copy.fallbackName;

  useEffect(() => {
    if (!user) return;

    if (user.role !== "admin") {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboardStats() {
      setLoadingStats(true);
      setStatsError("");

      try {
        const { data } = await API.get("/admin/dashboard-stats");

        if (cancelled) return;

        setStats({
          totalUsers: Number(data?.totalUsers || 0),
          totalBusinesses: Number(data?.totalBusinesses || 0),
          totalClients: Number(data?.totalClients || 0),
          totalSales: Number(data?.totalSales || 0),
          activeManagers: Number(data?.activeManagers || 0),
          blockedUsers: Number(data?.blockedUsers || 0),
          earlyAccessCount: Number(data?.earlyAccessCount || 0),
        });
        setConnectedToServer(true);
      } catch (err) {
        console.error("Failed to load admin dashboard stats:", err);
        if (!cancelled) {
          setStatsError(copy.loadError);
          setConnectedToServer(false);
        }
      } finally {
        if (!cancelled) {
          setLoadingStats(false);
        }
      }
    }

    loadDashboardStats();

    return () => {
      cancelled = true;
    };
  }, [copy.loadError]);

  return (
    <div>
      <AdminPageHeader
        title={`${copy.hello}, ${displayName}`}
        description={copy.description}
        actions={
          <>
            <span className={connectedToServer ? "biz-status is-ok" : "biz-status"}>
              <i />
              {loadingStats ? copy.loading : connectedToServer ? copy.connected : copy.offline}
            </span>
            <button
              type="button"
              className="biz-btn"
              onClick={() => navigate("/admin/early-access")}
            >
              {copy.earlyAccessAction}
            </button>
          </>
        }
      />

      {statsError ? (
        <p className="mb-3 text-sm font-semibold text-amber-700">{statsError}</p>
      ) : null}

      <section className="biz-stat-grid">
        <MetricCard
          title={copy.users}
          value={loadingStats ? "…" : formatNumber(stats.totalUsers, numberLocale)}
          note={copy.usersNote}
        />
        <MetricCard
          title={copy.businesses}
          value={loadingStats ? "…" : formatNumber(stats.totalBusinesses, numberLocale)}
          note={copy.businessesNote}
        />
        <MetricCard
          title={copy.clients}
          value={loadingStats ? "…" : formatNumber(stats.totalClients, numberLocale)}
          note={copy.clientsNote}
        />
        <MetricCard
          title={copy.earlyAccess}
          value={loadingStats ? "…" : formatNumber(stats.earlyAccessCount, numberLocale)}
          note={copy.earlyAccessNote}
        />
        <MetricCard
          title={copy.sales}
          value={loadingStats ? "…" : formatMoney(stats.totalSales, numberLocale)}
          note={copy.salesNote}
        />
        <MetricCard
          title={copy.managers}
          value={loadingStats ? "…" : formatNumber(stats.activeManagers, numberLocale)}
          note={copy.managersNote}
        />
        <MetricCard
          title={copy.blocked}
          value={loadingStats ? "…" : formatNumber(stats.blockedUsers, numberLocale)}
          note={copy.blockedNote}
          alert
        />
      </section>

      <h2 className="biz-section-title">{copy.shortcuts}</h2>
      <section className="biz-shortcut-grid">
        {SHORTCUT_PATHS.map((path, index) => (
          <button
            key={path}
            type="button"
            className="biz-shortcut"
            onClick={() => navigate(path)}
          >
            <strong>{copy.shortcutText[index][0]}</strong>
            <small>{copy.shortcutText[index][1]}</small>
          </button>
        ))}
      </section>

      <footer className="biz-admin-footer">
        <nav>
          <a href="/support">{copy.help}</a>
          <a href="/privacy-policy">{copy.privacy}</a>
          <a href="/terms">{copy.terms}</a>
        </nav>
        <p>© {new Date().getFullYear()} Bizuply</p>
      </footer>
    </div>
  );
}

export default AdminDashboard;
