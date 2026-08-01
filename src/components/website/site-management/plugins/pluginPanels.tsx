import React from "react";
import { Link } from "react-router-dom";
import {
  Accessibility,
  Compass,
  Flame,
  FormInput,
  Mail,
  Route,
  Star,
  Users,
  CircleDot,
  Search,
  type LucideIcon,
} from "lucide-react";

import type { SitePanelSection } from "../../../../data/sitePluginNav";
import { useSitePluginSettings } from "./useSitePluginSettings";
import SiteBenefitsWheelPanel from "./BenefitsWheelPanel";
import SiteCountdownPanel from "./CountdownPanel";
import SmartSearchPanel from "./SmartSearchPanel";
import SmartBotPanel from "./SmartBotPanel";
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
  icon: LucideIcon,
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
  "#7C3AED",
  "כלי נגישות BizUply",
  "תפריט נגישות מקצועי מובנה — ללא UserWay וללא תשלום חיצוני לכל אתר. מופעל אוטומטית בכל עמודי האתר.",
  ({ settings, updateField }) => {
    const features =
      settings.features && typeof settings.features === "object"
        ? (settings.features as Record<string, boolean>)
        : {};

    const setFeature = (key: string, value: boolean) => {
      updateField("features", { ...features, [key]: value });
    };

    return (
      <>
        <p className="rounded-xl border border-violet-100 bg-violet-50 px-3 py-2 text-xs leading-relaxed text-violet-900">
          התוסף של BizUply — שליטה מלאה בקוד, ללא מגבלת אתרים וללא הטמעת ספק חיצוני.
          קיצור מקלדת לגולשים: Ctrl+U.
        </p>
        <p className="text-xs text-slate-500">
          התפריט נפתח תמיד בצד שמאל. מיקום הכפתור הצף בלבד ניתן לשינוי.
        </p>
        <Field label="מיקום כפתור הצף">
          <select
            value={str(settings.widgetPosition, "bottom-left")}
            onChange={(e) => updateField("widgetPosition", e.target.value)}
            className={inputBase}
          >
            <option value="bottom-left">שמאל למטה</option>
            <option value="bottom-right">ימין למטה</option>
          </select>
        </Field>
        <Field label="צבע מיתוג">
          <TextInput
            value={str(settings.accentColor, "#7C3AED")}
            onChange={(v) => updateField("accentColor", v || "#7C3AED")}
          />
        </Field>
        <Toggle
          label="הדגשת קישורים"
          checked={bool(features.highlightLinks, true)}
          onChange={(v) => setFeature("highlightLinks", v)}
        />
        <Toggle
          label="ניגודיות (מחזור מצבים)"
          checked={bool(features.contrast, true)}
          onChange={(v) => setFeature("contrast", v)}
        />
        <Toggle
          label="ריווח טקסט"
          checked={bool(features.textSpacing, true)}
          onChange={(v) => setFeature("textSpacing", v)}
        />
        <Toggle
          label="טקסט גדול"
          checked={bool(features.largeText, true)}
          onChange={(v) => setFeature("largeText", v)}
        />
        <Toggle
          label="הסתרת תמונות"
          checked={bool(features.hideImages, true)}
          onChange={(v) => setFeature("hideImages", v)}
        />
        <Toggle
          label="ביטול הנפשות"
          checked={bool(features.stopAnimations, true)}
          onChange={(v) => setFeature("stopAnimations", v)}
        />
        <Toggle
          label="סמן מוגדל"
          checked={bool(features.largeCursor, true)}
          onChange={(v) => setFeature("largeCursor", v)}
        />
        <Toggle
          label="תמיכה בדיסלקציה"
          checked={bool(features.dyslexia, true)}
          onChange={(v) => setFeature("dyslexia", v)}
        />
        <Toggle
          label="גובה שורה"
          checked={bool(features.lineHeight, true)}
          onChange={(v) => setFeature("lineHeight", v)}
        />
        <Toggle
          label="תאורים"
          checked={bool(features.descriptions, true)}
          onChange={(v) => setFeature("descriptions", v)}
        />
        <Toggle
          label="רוויה / גווני אפור"
          checked={bool(features.saturation, true)}
          onChange={(v) => setFeature("saturation", v)}
        />
        <Toggle
          label="יישור טקסט"
          checked={bool(features.textAlign, true)}
          onChange={(v) => setFeature("textAlign", v)}
        />
      </>
    );
  }
);

export const PLUGIN_PANEL_MAP: Partial<
  Record<SitePanelSection, React.ComponentType<PluginPanelProps>>
> = {
  leads: SiteLeadsPanel,
  reviews: SiteReviewsPanel,
  club: SiteClubPanel,
  heatmap: SiteHeatmapPanel,
  "form-abandonment": SiteFormAbandonmentPanel,
  "journey-recording": SiteJourneyRecordingPanel,
  countdown: SiteCountdownPanel,
  "benefits-wheel": SiteBenefitsWheelPanel,
  "smart-search": SmartSearchPanel,
  "smart-bot": SmartBotPanel,
  "service-finder": SiteServiceFinderPanel,
  accessibility: SiteAccessibilityPanel,
};
