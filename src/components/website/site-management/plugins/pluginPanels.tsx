import React from "react";
import { Link } from "react-router-dom";
import {
  Accessibility,
  Bell,
  Bot,
  Compass,
  Flame,
  FormInput,
  Hash,
  HelpCircle,
  Mail,
  Route,
  Star,
  Users,
  CircleDot,
  LogIn,
} from "lucide-react";

import type { SitePanelSection } from "../../../data/sitePluginNav";
import { useSitePluginSettings } from "./useSitePluginSettings";
import SiteBenefitsWheelPanel from "./BenefitsWheelPanel";
import SiteCountdownPanel from "./CountdownPanel";
import SiteMembersPanel from "./SiteMembersPanel";
import SiteAuthFormPreview from "../../../site-plugins/site-auth/SiteAuthFormPreview";
import { SiteAuthLoginWidgetPreview } from "../../../site-plugins/site-auth/SiteAuthLoginWidget";
import { mergeSiteAuthSettings } from "../../../site-plugins/site-auth/siteAuthUtils";
import {
  SITE_AUTH_ICON_OPTIONS,
  type SiteAuthTriggerIcon,
} from "../../../site-plugins/site-auth/siteAuthTriggerIcons";
import {
  bool,
  Field,
  num,
  PluginPanelProps,
  SitePluginPanelFrame,
  str,
  TextArea,
  TextInput,
  Toggle,
} from "./SitePluginPanelFrame";
import { btnSecondary, inputBase } from "../siteManagementUi";

function ColorField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const pickerValue = /^#[0-9A-Fa-f]{6}$/.test(value) ? value : "#6366F1";

  return (
    <Field label={label}>
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 p-2">
        <input
          type="color"
          value={pickerValue}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-9 shrink-0 cursor-pointer rounded-lg border-0 bg-transparent p-0"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent font-mono text-xs font-semibold uppercase text-slate-700 outline-none"
        />
      </div>
    </Field>
  );
}

function IconPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: SiteAuthTriggerIcon) => void;
}) {
  return (
    <Field label={label}>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
        {SITE_AUTH_ICON_OPTIONS.map(({ value: iconValue, label: iconLabel, Icon }) => {
          const active = value === iconValue;
          return (
            <button
              key={iconValue}
              type="button"
              onClick={() => onChange(iconValue)}
              className={`flex flex-col items-center gap-1 rounded-xl border p-2 transition ${
                active
                  ? "border-violet-500 bg-violet-50 text-violet-700"
                  : "border-slate-200 bg-white text-slate-600 hover:border-violet-200"
              }`}
            >
              <Icon size={18} />
              <span className="text-[10px] font-bold">{iconLabel}</span>
            </button>
          );
        })}
      </div>
    </Field>
  );
}

function makePanel(
  pluginKey: string,
  icon: React.ComponentType<{ size?: number }>,
  accent: string,
  title: string,
  description: string,
  renderFields: (
    props: PluginPanelProps & {
      settings: Record<string, unknown>;
      updateField: (k: string, v: unknown) => void;
    }
  ) => React.ReactNode,
  extraActions?: (props: PluginPanelProps) => React.ReactNode
) {
  return function PluginPanel(props: PluginPanelProps) {
    const { settings, loading, saving, message, save, updateField } =
      useSitePluginSettings(props.siteId, pluginKey);
    const Icon = icon;

    return (
      <SitePluginPanelFrame
        {...props}
        icon={Icon}
        accent={accent}
        title={title}
        description={description}
        loading={loading}
        saving={saving}
        message={message}
        onSave={() => save()}
        extraActions={extraActions?.(props)}
      >
        <Toggle
          label="תוסף פעיל באתר"
          checked={bool(settings.isActive, true)}
          onChange={(v) => updateField("isActive", v)}
        />
        {renderFields({ ...props, settings, updateField })}
      </SitePluginPanelFrame>
    );
  };
}

export const SiteLeadsPanel = makePanel(
  "leads",
  Mail,
  "#6366F1",
  "טופס לידים",
  "פניות מהאתר נשמרות ב-CRM וניתן להגדיר התראות ומענה אוטומטי.",
  ({ settings, updateField }) => (
    <>
      <Field label="אימייל להתראות">
        <TextInput
          value={str(settings.notifyEmail)}
          onChange={(v) => updateField("notifyEmail", v)}
          placeholder="you@business.com"
          type="email"
        />
      </Field>
      <Toggle
        label="שליחה אוטומטית ל-CRM"
        checked={bool(settings.sendToCrm, true)}
        onChange={(v) => updateField("sendToCrm", v)}
      />
      <Toggle
        label="מענה אוטומטי ללקוח"
        checked={bool(settings.autoReply, true)}
        onChange={(v) => updateField("autoReply", v)}
      />
      <Field label="טקסט מענה אוטומטי">
        <TextArea
          value={str(settings.autoReplyMessage)}
          onChange={(v) => updateField("autoReplyMessage", v)}
        />
      </Field>
      <Toggle
        label="שדה טלפון חובה"
        checked={bool(settings.requirePhone)}
        onChange={(v) => updateField("requirePhone", v)}
      />
    </>
  ),
  ({ businessId }) => (
    <Link
      to={`/business/${businessId}/dashboard/crm/leads`}
      className={btnSecondary + " h-10 text-xs"}
    >
      פתיחת לידים ב-CRM
    </Link>
  )
);

export const SiteReviewsPanel = makePanel(
  "reviews",
  Star,
  "#F59E0B",
  "ביקורות לקוחות",
  "איסוף, אישור והצגת ביקורות באתר.",
  ({ settings, updateField }) => (
    <>
      <Toggle
        label="אישור לפני פרסום (Moderation)"
        checked={bool(settings.moderation, true)}
        onChange={(v) => updateField("moderation", v)}
      />
      <Toggle
        label="הצגה באתר"
        checked={bool(settings.showOnSite, true)}
        onChange={(v) => updateField("showOnSite", v)}
      />
      <Toggle
        label="בקשת ביקורת אחרי רכישה"
        checked={bool(settings.requestAfterPurchase, true)}
        onChange={(v) => updateField("requestAfterPurchase", v)}
      />
      <Field label="דירוג מינימלי לפרסום">
        <TextInput
          value={String(num(settings.minRating, 1))}
          onChange={(v) => updateField("minRating", Number(v) || 1)}
          type="number"
        />
      </Field>
    </>
  ),
  ({ businessId }) => (
    <Link
      to={`/business/${businessId}/dashboard/build`}
      className={btnSecondary + " h-10 text-xs"}
    >
      ניהול ביקורות
    </Link>
  )
);

export const SiteClubPanel = makePanel(
  "club",
  Users,
  "#8B5CF6",
  "מועדון לקוחות",
  "אזור אישי, הטבות ונקודות ללקוחות חוזרים.",
  ({ settings, updateField }) => (
    <>
      <Field label="שם המועדון">
        <TextInput
          value={str(settings.clubName, "מועדון לקוחות")}
          onChange={(v) => updateField("clubName", v)}
        />
      </Field>
      <Field label="הודעת ברוכים הבאים">
        <TextArea
          value={str(settings.welcomeMessage)}
          onChange={(v) => updateField("welcomeMessage", v)}
        />
      </Field>
      <Toggle
        label="מערכת נקודות"
        checked={bool(settings.pointsEnabled, true)}
        onChange={(v) => updateField("pointsEnabled", v)}
      />
      <Field label="נקודות לכל רכישה">
        <TextInput
          value={String(num(settings.pointsPerPurchase, 10))}
          onChange={(v) => updateField("pointsPerPurchase", Number(v) || 0)}
          type="number"
        />
      </Field>
    </>
  )
);

function SiteSiteAuthSettingsPanel(props: PluginPanelProps) {
  const { settings, loading, saving, message, save, updateField } =
    useSitePluginSettings(props.siteId, "site-auth");
  const Icon = LogIn;
  const merged = mergeSiteAuthSettings(settings);

  return (
    <div className="space-y-6">
      <SitePluginPanelFrame
        {...props}
        icon={Icon}
        accent="#6366F1"
        title="התחברות לקוחות האתר"
        description="מערכת נפרדת לגמרי מ-BizUply — ללקוחות שגולשים באתר שלך בלבד."
        loading={loading}
        saving={saving}
        message={message}
        onSave={() => save()}
      >
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-bold leading-relaxed text-amber-900">
          זו לא ההתחברות של BizUply. כאן מגדירים כניסה ללקוחות שמבקרים באתר המפורסם
          שלך — משתמשים, סיסמאות וטокנים נפרדים לחלוטין מהחשבון שלך בפלטפורמה.
        </div>

        <Toggle
          label="תוסף פעיל באתר"
          checked={bool(settings.isActive, true)}
          onChange={(v) => updateField("isActive", v)}
        />

        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-4">
          <p className="mb-2 text-sm font-black text-indigo-900">1. כפתור התחברות</p>
          <p className="mb-4 text-xs font-bold leading-relaxed text-indigo-700">
            בעורך: תוספים → «הפעלת תוסף צף» → גררו את האייקון (כמו גלגל המזל). הכפתור
            מוביל לדף התחברות.
          </p>
          <Toggle
            label="הצג כפתור באתר"
            checked={bool(settings.showLoginButton, true)}
            onChange={(v) => updateField("showLoginButton", v)}
          />
          <Toggle
            label="כפתור צף (גרירה בעורך)"
            checked={bool(settings.showTrigger, true)}
            onChange={(v) => updateField("showTrigger", v)}
          />
          <Field label="טקסט על הכפתור">
            <TextInput
              value={str(settings.loginButtonLabel, "התחברות")}
              onChange={(v) => updateField("loginButtonLabel", v)}
            />
          </Field>
          <Field label="סוג כפתור">
            <select
              className={inputBase}
              value={str(settings.buttonDisplay, "icon")}
              onChange={(e) => updateField("buttonDisplay", e.target.value)}
            >
              <option value="icon">אייקון בלבד</option>
              <option value="button">אייקון + טקסט</option>
              <option value="text">טקסט בלבד</option>
            </select>
          </Field>
          <Field label="גודל כפתור">
            <select
              className={inputBase}
              value={str(settings.buttonSize, "md")}
              onChange={(e) => updateField("buttonSize", e.target.value)}
            >
              <option value="sm">קטן</option>
              <option value="md">בינוני</option>
              <option value="lg">גדול</option>
            </select>
          </Field>
          <IconPicker
            label="אייקון התחברות"
            value={str(settings.loginIcon, "log-in")}
            onChange={(v) => updateField("loginIcon", v)}
          />
          <IconPicker
            label="אייקון התנתקות"
            value={str(settings.logoutIcon, "log-out")}
            onChange={(v) => updateField("logoutIcon", v)}
          />
          <Toggle
            label="ללא רקע (שקוף)"
            checked={bool(settings.buttonTransparent, true)}
            onChange={(v) => updateField("buttonTransparent", v)}
          />
          {!bool(settings.buttonTransparent, true) ? (
            <ColorField
              label="צבע רקע כפתור"
              value={str(settings.buttonBackgroundColor, "#6366F1")}
              onChange={(v) => updateField("buttonBackgroundColor", v)}
            />
          ) : null}
          <Field label="עיגול פינות כפתור (px)">
            <TextInput
              value={String(num(settings.buttonBorderRadius, 999))}
              onChange={(v) => updateField("buttonBorderRadius", Number(v) || 999)}
              type="number"
            />
          </Field>
          <Field label="צבע אייקון/טקסט (ריק = צבע מותג)">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 p-2">
              <input
                type="color"
                value={
                  /^#[0-9A-Fa-f]{6}$/.test(str(settings.buttonTextColor))
                    ? str(settings.buttonTextColor)
                    : "#6366F1"
                }
                onChange={(e) => updateField("buttonTextColor", e.target.value)}
                className="h-9 w-9 shrink-0 cursor-pointer rounded-lg border-0 bg-transparent p-0"
              />
              <input
                type="text"
                value={str(settings.buttonTextColor)}
                onChange={(e) => updateField("buttonTextColor", e.target.value)}
                placeholder="צבע מותג"
                className="min-w-0 flex-1 bg-transparent font-mono text-xs font-semibold uppercase text-slate-700 outline-none"
              />
            </div>
          </Field>
          <div className="mt-4 rounded-xl border border-dashed border-indigo-200 bg-white p-4">
            <p className="mb-3 text-xs font-bold text-slate-500">תצוגה מקדימה — כפתור</p>
            <div className="flex min-h-[72px] items-center justify-center rounded-xl bg-slate-100/80 p-4">
              <SiteAuthLoginWidgetPreview settings={merged} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
          <p className="mb-3 text-sm font-black text-slate-800">2. טפסים</p>
          <Toggle
            label="אפשר הרשמה עצמית"
            checked={bool(settings.allowSelfRegister)}
            onChange={(v) => updateField("allowSelfRegister", v)}
          />
          <Toggle
            label="אפשר «שכחתי סיסמה»"
            checked={bool(settings.forgotPasswordEnabled, true)}
            onChange={(v) => updateField("forgotPasswordEnabled", v)}
          />
          <div className="mt-3 space-y-2 rounded-xl border border-dashed border-slate-200 bg-white p-3 text-xs font-bold text-slate-600">
            <p>
              <span className="text-slate-800">התחברות:</span> אימייל + סיסמה
            </p>
            {settings.allowSelfRegister ? (
              <p>
                <span className="text-slate-800">הרשמה:</span> שם מלא + טלפון + אימייל + סיסמה
              </p>
            ) : null}
            {settings.forgotPasswordEnabled ? (
              <p>
                <span className="text-slate-800">שכחתי סיסמה:</span> אימייל
              </p>
            ) : null}
          </div>
          <Field label="נתיב אחרי התחברות">
            <TextInput
              value={str(settings.memberAreaPath, "/member")}
              onChange={(v) => updateField("memberAreaPath", v)}
              placeholder="/member"
            />
          </Field>
          {settings.allowSelfRegister ? (
            <>
              <Field label="טקסט קישור להרשמה (בדף התחברות)">
                <TextInput
                  value={str(settings.registerLinkText, "אין לכם משתמש? הירשמו עכשיו")}
                  onChange={(v) => updateField("registerLinkText", v)}
                />
              </Field>
              <Field label="טקסט קישור להתחברות (בדף הרשמה)">
                <TextInput
                  value={str(settings.loginLinkText, "יש לכם משתמש? התחברו")}
                  onChange={(v) => updateField("loginLinkText", v)}
                />
              </Field>
            </>
          ) : null}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
          <p className="mb-3 text-sm font-black text-slate-800">3. עיצוב דפים</p>
          <Field label="כותרת — התחברות">
            <TextInput
              value={str(settings.loginPageTitle, "התחברות")}
              onChange={(v) => updateField("loginPageTitle", v)}
            />
          </Field>
          <Field label="כותרת משנה — התחברות">
            <TextInput
              value={str(settings.loginSubtitle)}
              onChange={(v) => updateField("loginSubtitle", v)}
            />
          </Field>
          <Field label="כותרת — הרשמה">
            <TextInput
              value={str(settings.registerTitle, "הרשמה")}
              onChange={(v) => updateField("registerTitle", v)}
            />
          </Field>
          <Field label="כותרת משנה — הרשמה">
            <TextInput
              value={str(settings.registerSubtitle)}
              onChange={(v) => updateField("registerSubtitle", v)}
            />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <ColorField
              label="צבע רקע טופס"
              value={str(settings.formBackgroundColor, "#ffffff")}
              onChange={(v) => updateField("formBackgroundColor", v)}
            />
            <ColorField
              label="צבע טקסט"
              value={str(settings.formTextColor, "#1e293b")}
              onChange={(v) => updateField("formTextColor", v)}
            />
            <ColorField
              label="צבע תוויות"
              value={str(settings.formLabelColor, "#334155")}
              onChange={(v) => updateField("formLabelColor", v)}
            />
            <ColorField
              label="צבע כפתור שליחה"
              value={str(settings.formAccentColor, "#6366F1")}
              onChange={(v) => updateField("formAccentColor", v)}
              placeholder="צבע מותג"
            />
            <ColorField
              label="צבע טקסט כפתור"
              value={str(settings.formButtonTextColor, "#ffffff")}
              onChange={(v) => updateField("formButtonTextColor", v)}
            />
            <ColorField
              label="צבע מסגרת"
              value={str(settings.formBorderColor, "#e2e8f0")}
              onChange={(v) => updateField("formBorderColor", v)}
            />
            <Field label="עיגול פינות (px)">
              <TextInput
                value={String(num(settings.formBorderRadius, 16))}
                onChange={(v) => updateField("formBorderRadius", Number(v) || 16)}
                type="number"
              />
            </Field>
          </div>
          <div className="mt-4">
            <SiteAuthFormPreview settings={merged} />
          </div>
        </div>

        <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-xs font-bold text-slate-500">
          ניהול משתמשים ו-CRM: «משתמשי האתר» בתפריט.
        </p>
      </SitePluginPanelFrame>
    </div>
  );
}

export const SiteSiteAuthPanel = SiteSiteAuthSettingsPanel;
export const SiteSiteMembersPanel = SiteMembersPanel;

export const SiteHeatmapPanel = makePanel(
  "heatmap",
  Flame,
  "#EF4444",
  "מפת חום",
  "ראו היכן מקליקים וגלולים הגולשים בעמודי האתר.",
  ({ settings, updateField }) => (
    <>
      <Toggle
        label="מעקב קליקים"
        checked={bool(settings.trackClicks, true)}
        onChange={(v) => updateField("trackClicks", v)}
      />
      <Toggle
        label="מעקב גלילה"
        checked={bool(settings.trackScroll, true)}
        onChange={(v) => updateField("trackScroll", v)}
      />
      <Field label="שמירת נתונים (ימים)">
        <TextInput
          value={String(num(settings.retentionDays, 30))}
          onChange={(v) => updateField("retentionDays", Number(v) || 30)}
          type="number"
        />
      </Field>
      <div className="rounded-xl border border-dashed border-orange-200 bg-orange-50/50 p-4 text-sm text-slate-600">
        לאחר פרסום האתר, מפת החום תתמלא בנתונים אמיתיים. כרגע המערכת מוכנה
        לאיסוף.
      </div>
    </>
  )
);

export const SiteFormAbandonmentPanel = makePanel(
  "form-abandonment",
  FormInput,
  "#F97316",
  "מנתח נטישת טפסים",
  "גלו למה ממלאים לא משלימים טפסים באתר.",
  ({ settings, updateField }) => (
    <>
      <Field label="מינימום שדות שהתחילו למלא">
        <TextInput
          value={String(num(settings.minFieldsFilled, 2))}
          onChange={(v) => updateField("minFieldsFilled", Number(v) || 2)}
          type="number"
        />
      </Field>
      <Field label="אימייל להתראות">
        <TextInput
          value={str(settings.alertEmail)}
          onChange={(v) => updateField("alertEmail", v)}
          type="email"
        />
      </Field>
      <Toggle
        label="שמירת טיוטות חלקיות"
        checked={bool(settings.trackPartialSubmissions, true)}
        onChange={(v) => updateField("trackPartialSubmissions", v)}
      />
    </>
  )
);

export const SiteJourneyRecordingPanel = makePanel(
  "journey-recording",
  Route,
  "#EC4899",
  "הקלטת מסע לקוח",
  "צפייה במסלול הגולשים באתר (בהתאם לפרטיות).",
  ({ settings, updateField }) => (
    <>
      <Toggle
        label="הסתרת שדות רגישים (סיסמאות וכו')"
        checked={bool(settings.maskInputs, true)}
        onChange={(v) => updateField("maskInputs", v)}
      />
      <Field label="מקסימום הקלטות">
        <TextInput
          value={String(num(settings.maxRecordings, 100))}
          onChange={(v) => updateField("maxRecordings", Number(v) || 100)}
          type="number"
        />
      </Field>
      <Field label="משך הקלטה מקסימלי (שניות)">
        <TextInput
          value={String(num(settings.recordDurationSec, 300))}
          onChange={(v) => updateField("recordDurationSec", Number(v) || 300)}
          type="number"
        />
      </Field>
    </>
  )
);

export const SiteWhyNoLeadPanel = makePanel(
  "why-no-lead",
  HelpCircle,
  "#14B8A6",
  "למה לא השאירו פרטים?",
  "תובנות על גולשים שהתחילו למלא טופס ולא שלחו.",
  ({ settings, updateField }) => (
    <>
      <Field label="זמן מינימלי על הטופס (שניות)">
        <TextInput
          value={String(num(settings.minTimeOnFormSec, 5))}
          onChange={(v) => updateField("minTimeOnFormSec", Number(v) || 5)}
          type="number"
        />
      </Field>
      <Toggle
        label="מעקב היסוס בשדות"
        checked={bool(settings.trackFieldHesitation, true)}
        onChange={(v) => updateField("trackFieldHesitation", v)}
      />
      <Toggle
        label="הצגת תובנות בפאנל"
        checked={bool(settings.showInsights, true)}
        onChange={(v) => updateField("showInsights", v)}
      />
    </>
  )
);

export const SiteResultsCounterPanel = makePanel(
  "results-counter",
  Hash,
  "#3B82F6",
  "מונה תוצאות",
  "מספרים חיים שמחזקים אמון — לקוחות, פרויקטים, שנות ניסיון.",
  ({ settings, updateField }) => (
    <>
      <Field label="תווית">
        <TextInput
          value={str(settings.label, "לקוחות מרוצים")}
          onChange={(v) => updateField("label", v)}
        />
      </Field>
      <Field label="ערך התחלתי">
        <TextInput
          value={String(num(settings.value, 1200))}
          onChange={(v) => updateField("value", Number(v) || 0)}
          type="number"
        />
      </Field>
      <Field label="סיומת (למשל +)">
        <TextInput
          value={str(settings.suffix, "+")}
          onChange={(v) => updateField("suffix", v)}
        />
      </Field>
      <Toggle
        label="אנימציית ספירה"
        checked={bool(settings.animate, true)}
        onChange={(v) => updateField("animate", v)}
      />
    </>
  )
);

export const SiteWaitlistPanel = makePanel(
  "waitlist",
  Bell,
  "#0EA5E9",
  "רשימת המתנה",
  "לקוחות נרשמים ומקבלים התראה כשמתפנה תור.",
  ({ settings, updateField }) => (
    <>
      <Field label="כותרת">
        <TextInput
          value={str(settings.title, "רשימת המתנה")}
          onChange={(v) => updateField("title", v)}
        />
      </Field>
      <Field label="הודעה אחרי הרשמה">
        <TextArea
          value={str(settings.successMessage)}
          onChange={(v) => updateField("successMessage", v)}
        />
      </Field>
      <Toggle
        label="התראה באימייל"
        checked={bool(settings.notifyByEmail, true)}
        onChange={(v) => updateField("notifyByEmail", v)}
      />
      <Toggle
        label="התראה ב-SMS"
        checked={bool(settings.notifyBySms)}
        onChange={(v) => updateField("notifyBySms", v)}
      />
    </>
  )
);

export const SiteSalesAgentPanel = makePanel(
  "sales-agent",
  Bot,
  "#4F46E5",
  "סוכן מכירות AI",
  "בוט חכם שמוכר, עונה ואוסף לידים באתר.",
  ({ settings, updateField }) => (
    <>
      <Field label="שם הבוט">
        <TextInput
          value={str(settings.botName, "נציג המכירות")}
          onChange={(v) => updateField("botName", v)}
        />
      </Field>
      <Field label="הודעת פתיחה">
        <TextArea
          value={str(settings.welcomeMessage)}
          onChange={(v) => updateField("welcomeMessage", v)}
        />
      </Field>
      <Field label="סגנון (friendly / professional)">
        <TextInput
          value={str(settings.tone, "friendly")}
          onChange={(v) => updateField("tone", v)}
        />
      </Field>
      <Toggle
        label="הצעת מוצרים"
        checked={bool(settings.suggestProducts, true)}
        onChange={(v) => updateField("suggestProducts", v)}
      />
      <Toggle
        label="איסוף ליד בסיום שיחה"
        checked={bool(settings.collectLead, true)}
        onChange={(v) => updateField("collectLead", v)}
      />
    </>
  )
);

export const SiteServiceFinderPanel = makePanel(
  "service-finder",
  Compass,
  "#2563EB",
  "מצא את השירות",
  "שאלון התאמה שמכוון ללקוח לשירות הנכון.",
  ({ settings, updateField }) => (
    <>
      <Field label="כותרת השאלון">
        <TextInput
          value={str(settings.title, "מצאו את השירות המתאים")}
          onChange={(v) => updateField("title", v)}
        />
      </Field>
      <Field label="טקסט כפתור בסיום">
        <TextInput
          value={str(settings.resultCta, "צרו קשר")}
          onChange={(v) => updateField("resultCta", v)}
        />
      </Field>
      <p className="text-xs text-slate-500">
        עריכת השאלות והאפשרויות — בעורך האתר, בלוק &quot;מצא שירות&quot;.
      </p>
    </>
  )
);

export const SiteAccessibilityPanel = makePanel(
  "accessibility",
  Accessibility,
  "#0891B2",
  "כלי נגישות",
  "תפריט נגישות מקצועי לגולשים.",
  ({ settings, updateField }) => (
    <>
      <Field label="מיקום הווידג'ט">
        <select
          value={str(settings.widgetPosition, "bottom-left")}
          onChange={(e) => updateField("widgetPosition", e.target.value)}
          className={inputBase}
        >
          <option value="bottom-left">שמאל למטה</option>
          <option value="bottom-right">ימין למטה</option>
        </select>
      </Field>
      <Field label="גודל גופן ברירת מחדל (%)">
        <TextInput
          value={String(num(settings.defaultFontScale, 100))}
          onChange={(v) => updateField("defaultFontScale", Number(v) || 100)}
          type="number"
        />
      </Field>
      <Toggle
        label="ניגודיות גבוהה"
        checked={bool(settings.highContrast)}
        onChange={(v) => updateField("highContrast", v)}
      />
      <Toggle
        label="הדגשת קישורים"
        checked={bool(settings.highlightLinks, true)}
        onChange={(v) => updateField("highlightLinks", v)}
      />
      <Toggle
        label="גופן קריא"
        checked={bool(settings.readableFont, true)}
        onChange={(v) => updateField("readableFont", v)}
      />
    </>
  )
);

export const PLUGIN_PANEL_MAP: Partial<
  Record<SitePanelSection, React.ComponentType<PluginPanelProps>>
> = {
  leads: SiteLeadsPanel,
  reviews: SiteReviewsPanel,
  club: SiteClubPanel,
  "site-auth": SiteSiteAuthPanel,
  "site-members": SiteSiteMembersPanel,
  heatmap: SiteHeatmapPanel,
  "form-abandonment": SiteFormAbandonmentPanel,
  "journey-recording": SiteJourneyRecordingPanel,
  "why-no-lead": SiteWhyNoLeadPanel,
  "results-counter": SiteResultsCounterPanel,
  waitlist: SiteWaitlistPanel,
  countdown: SiteCountdownPanel,
  "benefits-wheel": SiteBenefitsWheelPanel,
  "sales-agent": SiteSalesAgentPanel,
  "service-finder": SiteServiceFinderPanel,
  accessibility: SiteAccessibilityPanel,
};
