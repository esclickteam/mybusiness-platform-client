import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { BellRing, Loader2, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../i18n/localeUtils";

import {
  getPermission,
  isIos,
  isPushSupported,
  isStandalone,
  isSubscribed,
  subscribeToPush,
} from "../utils/push";

const DISMISS_KEY = "bizuply-admin-push-banner-dismissed";

const PUSH_COPY = {
  he: {
    title: "הפעילו התראות Push באדמין",
    body: "קבלו בטלפון התראות על שיחות חדשות, תזכורות ופניות תמיכה.",
    iosBody: "באייפון צריך לפתוח את האפליקציה מהמסך הבית כדי לקבל התראות על שיחות וצ׳אט.",
    enable: "אפשרו התראות עכשיו",
    install: "איך מתקינים PWA",
    close: "סגור",
    iosShare: "באייפון: Safari → שיתוף → הוסף למסך הבית, ואז פתחו מהאייקון",
    iosHome: "באייפון: הוסיפו למסך הבית ופתחו מהאייקון",
    denied: "התראות חסומות — אשרו בהגדרות האתר (🔒 ליד הכתובת)",
    failed: "לא הצלחנו להפעיל התראות — נסו שוב",
  },
  en: {
    title: "Turn on admin push alerts",
    body: "Get phone alerts for new calls, reminders, and support requests.",
    iosBody: "On iPhone, open the app from the Home Screen to receive call and chat alerts.",
    enable: "Allow alerts now",
    install: "How to install the PWA",
    close: "Close",
    iosShare: "On iPhone: Safari → Share → Add to Home Screen, then open it from the icon",
    iosHome: "On iPhone: add it to the Home Screen and open it from the icon",
    denied: "Alerts are blocked. Allow them in the site settings next to the address.",
    failed: "Alerts could not be turned on. Try again.",
  },
  es: {
    title: "Activen las alertas push de administración",
    body: "Reciban en el teléfono alertas de llamadas nuevas, recordatorios y solicitudes de soporte.",
    iosBody: "En iPhone, abran la app desde la pantalla de inicio para recibir alertas de llamadas y chat.",
    enable: "Permitir alertas ahora",
    install: "Cómo instalar la PWA",
    close: "Cerrar",
    iosShare: "En iPhone: Safari → Compartir → Añadir a pantalla de inicio, y ábranla desde el icono",
    iosHome: "En iPhone: añádanla a la pantalla de inicio y ábranla desde el icono",
    denied: "Las alertas están bloqueadas. Permítanlas en los ajustes del sitio, junto a la dirección.",
    failed: "No se pudieron activar las alertas. Inténtelo de nuevo.",
  },
  pt: {
    title: "Ativem os alertas push da administração",
    body: "Recebam no telefone alertas de novas chamadas, lembretes e pedidos de suporte.",
    iosBody: "No iPhone, abram o app pela Tela de Início para receber alertas de chamadas e chat.",
    enable: "Permitir alertas agora",
    install: "Como instalar o PWA",
    close: "Fechar",
    iosShare: "No iPhone: Safari → Compartilhar → Adicionar à Tela de Início e abram pelo ícone",
    iosHome: "No iPhone: adicionem à Tela de Início e abram pelo ícone",
    denied: "Os alertas estão bloqueados. Permitam nos ajustes do site, ao lado do endereço.",
    failed: "Não foi possível ativar os alertas. Tente de novo.",
  },
  ar: {
    title: "فعّلوا تنبيهات الإدارة",
    body: "استلموا على الهاتف تنبيهات بالمكالمات الجديدة والتذكيرات وطلبات الدعم.",
    iosBody: "على آيفون، افتحوا التطبيق من الشاشة الرئيسية لتصل تنبيهات المكالمات والدردشة.",
    enable: "السماح بالتنبيهات الآن",
    install: "كيفية تثبيت التطبيق",
    close: "إغلاق",
    iosShare: "على آيفون: Safari ← مشاركة ← إضافة إلى الشاشة الرئيسية، ثم افتحوه من الأيقونة",
    iosHome: "على آيفون: أضيفوه إلى الشاشة الرئيسية وافتحوه من الأيقونة",
    denied: "التنبيهات محظورة. اسمحوا بها من إعدادات الموقع بجانب العنوان.",
    failed: "تعذر تفعيل التنبيهات. حاولوا مرة أخرى.",
  },
} as const;

function pushCopy(language?: string) {
  const code = String(language || "").toLowerCase();
  if (code.startsWith("he")) return PUSH_COPY.he;
  if (code.startsWith("es")) return PUSH_COPY.es;
  if (code.startsWith("pt")) return PUSH_COPY.pt;
  if (code.startsWith("ar")) return PUSH_COPY.ar;
  return PUSH_COPY.en;
}

function shouldShowBanner() {
  if (!isPushSupported()) return false;
  if (typeof window === "undefined") return false;
  if (sessionStorage.getItem(DISMISS_KEY) === "1") return false;

  const permission = getPermission();
  if (permission === "denied") return false;

  if (isIos() && !isStandalone()) return true;

  return permission !== "granted";
}

/**
 * Persistent admin PWA prompt — portaled to body so header blur cannot trap it.
 * Shown on /admin until push permission is granted and the device is subscribed.
 */
export default function AdminPushPermissionBanner() {
  const { i18n } = useTranslation();
  const copy = pushCopy(i18n.resolvedLanguage || i18n.language);
  const dir = getTextDirection(i18n.resolvedLanguage || i18n.language);
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [iosInstall, setIosInstall] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      if (!shouldShowBanner()) {
        if (!cancelled) setVisible(false);
        return;
      }

      const permission = getPermission();
      if (permission === "granted") {
        const subscribed = await isSubscribed();
        if (!cancelled) setVisible(!subscribed);
        return;
      }

      if (!cancelled) {
        setIosInstall(isIos() && !isStandalone());
        setVisible(true);
      }
    }

    void refresh();
    const onVis = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  function dismiss() {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  }

  async function handleEnable() {
    if (busy) return;
    setBusy(true);
    setMessage("");
    try {
      if (iosInstall) {
        setMessage(copy.iosShare);
        return;
      }
      const result = await subscribeToPush();
      if (!result.ok) {
        if (result.reason === "ios-install") {
          setIosInstall(true);
          setMessage(copy.iosHome);
          return;
        }
        if (result.reason === "denied") {
          setMessage(copy.denied);
          setVisible(false);
          return;
        }
        setMessage(copy.failed);
        return;
      }
      setVisible(false);
    } finally {
      setBusy(false);
    }
  }

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          key="admin-push-banner"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.2 }}
          dir={dir}
          className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[9990] mx-auto max-w-lg sm:inset-x-auto sm:start-6 sm:end-auto"
        >
          <div className="rounded-2xl border border-amber-200 bg-gradient-to-l from-amber-50 via-white to-white p-3 shadow-[0_16px_48px_rgba(15,23,42,0.18)] ring-1 ring-amber-100">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-red-500 shadow-sm ring-1 ring-amber-100">
                <BellRing className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black text-slate-900">{copy.title}</p>
                <p className="mt-1 text-[11px] font-semibold leading-5 text-slate-600">
                  {iosInstall ? copy.iosBody : copy.body}
                </p>
                {message ? (
                  <p className="mt-2 text-[11px] font-bold text-amber-800">
                    {message}
                  </p>
                ) : null}
                <button
                  type="button"
                  onClick={() => void handleEnable()}
                  disabled={busy}
                  className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-amber-400 to-red-500 px-3 text-xs font-black text-white shadow-sm disabled:opacity-60"
                >
                  {busy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <BellRing className="h-4 w-4" />
                  )}
                  {iosInstall ? copy.install : copy.enable}
                </button>
              </div>
              <button
                type="button"
                onClick={dismiss}
                aria-label={copy.close}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-slate-400 ring-1 ring-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
