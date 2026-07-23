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
import { mergeSiteAuthSettings } from "../../../site-plugins/site-auth/siteAuthUtils";
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

  return (
    <div className="space-y-6">
      <SitePluginPanelFrame
        {...props}
        icon={Icon}
        accent="#6366F1"
        title="התחברות ואזור אישי"
        description="מערכת התחברות נפרדת ללקוחות האתר — לא קשורה ל-BizUply."
        loading={loading}
        saving={saving}
        message={message}
        onSave={() => save()}
      >
        <Toggle
          label="תוסף פעיל באתר"
          checked={bool(settings.isActive, true)}
          onChange={(v) => updateField("isActive", v)}
        />
        <Toggle
          label="הצג כפתור התחברות באתר"
          checked={bool(settings.showLoginButton, true)}
          onChange={(v) => updateField("showLoginButton", v)}
        />
        <Toggle
          label="הצג כפתור צף (גרירה בעורך — כמו גלגל המזל)"
          checked={bool(settings.showTrigger, true)}
          onChange={(v) => updateField("showTrigger", v)}
        />
        <Toggle
          label="טופס התחברות במודאל (לא מומלץ — ברירת מחדל: דף ייעודי)"
          checked={bool(settings.useLoginModal)}
          onChange={(v) => updateField("useLoginModal", v)}
        />
        <Field label="סוג כפתור באתר">
          <select
            className={inputBase}
            value={str(settings.buttonDisplay, "icon")}
            onChange={(e) => updateField("buttonDisplay", e.target.value)}
          >
            <option value="icon">אייקון בלבד</option>
            <option value="button">כפתור עם טקסט</option>
            <option value="text">טקסט בלבד</option>
          </select>
        </Field>
        <Toggle
          label="כפתור שקוף (ללא רקע)"
          checked={bool(settings.buttonTransparent, true)}
          onChange={(v) => updateField("buttonTransparent", v)}
        />
        <Field label="צבע כפתור / אייקון (ריק = צבע מותג)">
          <TextInput
            value={str(settings.buttonTextColor)}
            onChange={(v) => updateField("buttonTextColor", v)}
            placeholder="#6366F1"
          />
        </Field>
        <Field label="מיקום הכפתור">
          <select
            className={inputBase}
            value={str(settings.buttonMode, "floating")}
            onChange={(e) => updateField("buttonMode", e.target.value)}
          >
            <option value="floating">כפתור צף (מומלץ — כמו גלגל המזל)</option>
            <option value="inline">ישן: בתוך העמוד (HTML בעורך)</option>
            <option value="both">שניהם</option>
          </select>
        </Field>
        <Toggle
          label="הצג שם משתמש על הכפתור"
          checked={bool(settings.showMemberName, true)}
          onChange={(v) => updateField("showMemberName", v)}
        />
        <Field label="כותרת דף התחברות">
          <TextInput
            value={str(settings.loginPageTitle, "התחברות")}
            onChange={(v) => updateField("loginPageTitle", v)}
          />
        </Field>
        <Field label="טקסט כפתור התחברות">
          <TextInput
            value={str(settings.loginButtonLabel, "התחברות")}
            onChange={(v) => updateField("loginButtonLabel", v)}
          />
        </Field>
        <Field label="טקסט כפתור התנתקות">
          <TextInput
            value={str(settings.logoutButtonLabel, "התנתקות")}
            onChange={(v) => updateField("logoutButtonLabel", v)}
          />
        </Field>
        <Field label="נתיב אזור אישי (לאחר התחברות)">
          <TextInput
            value={str(settings.memberAreaPath, "/member")}
            onChange={(v) => updateField("memberAreaPath", v)}
            placeholder="/member"
          />
        </Field>
        <Toggle
          label="אפשר הרשמה עצמית"
          checked={bool(settings.allowSelfRegister)}
          onChange={(v) => updateField("allowSelfRegister", v)}
        />
        <Toggle
          label="אפשר שכחתי סיסמה"
          checked={bool(settings.forgotPasswordEnabled, true)}
          onChange={(v) => updateField("forgotPasswordEnabled", v)}
        />

        <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
          <p className="mb-3 text-sm font-black text-slate-800">עיצוב טופס התחברות / הרשמה</p>
          <Field label="כותרת משנה — התחברות">
            <TextInput
              value={str(settings.loginSubtitle)}
              onChange={(v) => updateField("loginSubtitle", v)}
            />
          </Field>
          <Field label="כותרת הרשמה">
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
            <Field label="צבע רקע">
              <TextInput
                value={str(settings.formBackgroundColor, "#ffffff")}
                onChange={(v) => updateField("formBackgroundColor", v)}
                placeholder="#ffffff"
              />
            </Field>
            <Field label="צבע טקסט">
              <TextInput
                value={str(settings.formTextColor, "#1e293b")}
                onChange={(v) => updateField("formTextColor", v)}
                placeholder="#1e293b"
              />
            </Field>
            <Field label="צבע תוויות">
              <TextInput
                value={str(settings.formLabelColor, "#334155")}
                onChange={(v) => updateField("formLabelColor", v)}
              />
            </Field>
            <Field label="צבע כפתור (ריק = צבע מותג)">
              <TextInput
                value={str(settings.formAccentColor)}
                onChange={(v) => updateField("formAccentColor", v)}
                placeholder="#6366F1"
              />
            </Field>
            <Field label="צבע טקסט כפתור">
              <TextInput
                value={str(settings.formButtonTextColor, "#ffffff")}
                onChange={(v) => updateField("formButtonTextColor", v)}
              />
            </Field>
            <Field label="צבע מסגרת">
              <TextInput
                value={str(settings.formBorderColor, "#e2e8f0")}
                onChange={(v) => updateField("formBorderColor", v)}
              />
            </Field>
            <Field label="עיגול פינות (px)">
              <TextInput
                value={String(num(settings.formBorderRadius, 16))}
                onChange={(v) => updateField("formBorderRadius", Number(v) || 16)}
                type="number"
              />
            </Field>
          </div>
          <div className="mt-4">
            <SiteAuthFormPreview settings={mergeSiteAuthSettings(settings)} />
          </div>
        </div>

        <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
          <p className="mb-3 text-sm font-black text-slate-800">CRM והרשמה</p>
          <Toggle
            label="ברירת מחדל: הוסף כלקוח CRM בעת יצירת משתמש"
            checked={bool(settings.defaultAddAsCrmClient)}
            onChange={(v) => updateField("defaultAddAsCrmClient", v)}
          />
          <Toggle
            label="בהרשמה עצמית — הוסף אוטומטית ל-CRM"
            checked={bool(settings.autoAddRegisterAsCrmClient)}
            onChange={(v) => updateField("autoAddRegisterAsCrmClient", v)}
          />
          <Toggle
            label="בהרשמה — הצג שדה טלפון"
            checked={bool(settings.registerCollectPhone)}
            onChange={(v) => updateField("registerCollectPhone", v)}
          />
        </div>
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
