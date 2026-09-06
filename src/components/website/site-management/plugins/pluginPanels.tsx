import React from "react";
import { useTranslation } from "react-i18next";
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
  MessageCircle,
  DoorOpen,
  Megaphone,
  FileText,
  type LucideIcon,
} from "lucide-react";

import type { SitePanelSection } from "../../../../data/sitePluginNav";
import { useSitePluginSettings } from "./useSitePluginSettings";
import SiteBenefitsWheelPanel from "./BenefitsWheelPanel";
import SiteCountdownPanel from "./CountdownPanel";
import SmartFormsInboxPanel from "./SmartFormsInboxPanel";
import {
  AnalyticsProPanel,
  BirthdayClubPanel,
  FaqProPanel,
  MultiLanguagePanel,
  QrGeneratorPanel,
  ReferAFriendPanel,
  SeoProPanel,
} from "./AddonOpsPanels";
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
  titleKey: string,
  descriptionKey: string,
  renderFields: (
    props: PluginPanelProps & {
      settings: Record<string, unknown>;
      updateField: (k: string, v: unknown) => void;
      t: (key: string) => string;
    }
  ) => React.ReactNode,
  extraActions?: (props: PluginPanelProps & { t: (key: string) => string }) => React.ReactNode
) {
  return function PluginPanel(props: PluginPanelProps) {
    const { t } = useTranslation();
    const { settings, loading, saving, message, save, updateField } =
      useSitePluginSettings(props.siteId, pluginKey);
    const Icon = icon;

    return (
      <SitePluginPanelFrame
        {...props}
        icon={Icon}
        accent={accent}
        title={t(titleKey)}
        description={t(descriptionKey)}
        loading={loading}
        saving={saving}
        message={message}
        onSave={() => save()}
        extraActions={extraActions?.({ ...props, t })}
      >
        <Toggle
          label={t("sitePlugins.pluginActive")}
          checked={bool(settings.isActive, true)}
          onChange={(v) => updateField("isActive", v)}
        />
        {renderFields({ ...props, settings, updateField, t })}
      </SitePluginPanelFrame>
    );
  };
}

export const SiteLeadsPanel = makePanel(
  "leads",
  Mail,
  "#6366F1",
  "sitePlugins.leads.title",
  "sitePlugins.leads.description",
  ({ settings, updateField, t }) => (
    <>
      <Field label={t("sitePlugins.leads.notifyEmail")}>
        <TextInput
          value={str(settings.notifyEmail)}
          onChange={(v) => updateField("notifyEmail", v)}
          placeholder="you@business.com"
          type="email"
        />
      </Field>
      <Toggle
        label={t("sitePlugins.leads.sendToCrm")}
        checked={bool(settings.sendToCrm, true)}
        onChange={(v) => updateField("sendToCrm", v)}
      />
      <Toggle
        label={t("sitePlugins.leads.autoReply")}
        checked={bool(settings.autoReply, true)}
        onChange={(v) => updateField("autoReply", v)}
      />
      <Field label={t("sitePlugins.leads.autoReplyText")}>
        <TextArea
          value={str(settings.autoReplyMessage)}
          onChange={(v) => updateField("autoReplyMessage", v)}
        />
      </Field>
      <Toggle
        label={t("sitePlugins.leads.requirePhone")}
        checked={bool(settings.requirePhone)}
        onChange={(v) => updateField("requirePhone", v)}
      />
    </>
  ),
  ({ businessId, t }) => (
    <Link
      to={`/business/${businessId}/dashboard/crm/leads`}
      className={btnSecondary + " h-10 text-xs"}
    >
      {t("sitePlugins.leads.openCrm")}
    </Link>
  )
);

export const SiteReviewsPanel = makePanel(
  "reviews",
  Star,
  "#F59E0B",
  "sitePlugins.reviews.title",
  "sitePlugins.reviews.description",
  ({ settings, updateField, t }) => (
    <>
      <Toggle
        label={t("sitePlugins.reviews.moderation")}
        checked={bool(settings.moderation, true)}
        onChange={(v) => updateField("moderation", v)}
      />
      <Toggle
        label={t("sitePlugins.reviews.showOnSite")}
        checked={bool(settings.showOnSite, true)}
        onChange={(v) => updateField("showOnSite", v)}
      />
      <Toggle
        label={t("sitePlugins.reviews.requestAfterPurchase")}
        checked={bool(settings.requestAfterPurchase, true)}
        onChange={(v) => updateField("requestAfterPurchase", v)}
      />
      <Field label={t("sitePlugins.reviews.minRating")}>
        <TextInput
          value={String(num(settings.minRating, 1))}
          onChange={(v) => updateField("minRating", Number(v) || 1)}
          type="number"
        />
      </Field>
    </>
  ),
  ({ businessId, t }) => (
    <Link
      to={`/business/${businessId}/dashboard/build`}
      className={btnSecondary + " h-10 text-xs"}
    >
      {t("sitePlugins.reviews.manage")}
    </Link>
  )
);

export const SiteClubPanel = makePanel(
  "club",
  Users,
  "#8B5CF6",
  "sitePlugins.club.title",
  "sitePlugins.club.description",
  ({ settings, updateField, t }) => (
    <>
      <Field label={t("sitePlugins.club.name")}>
        <TextInput
          value={str(settings.clubName, "מועדון לקוחות")}
          onChange={(v) => updateField("clubName", v)}
        />
      </Field>
      <Field label={t("sitePlugins.club.welcome")}>
        <TextArea
          value={str(settings.welcomeMessage)}
          onChange={(v) => updateField("welcomeMessage", v)}
        />
      </Field>
      <Toggle
        label={t("sitePlugins.club.points")}
        checked={bool(settings.pointsEnabled, true)}
        onChange={(v) => updateField("pointsEnabled", v)}
      />
      <Field label={t("sitePlugins.club.pointsPerPurchase")}>
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
  "sitePlugins.heatmap.title",
  "sitePlugins.heatmap.description",
  ({ settings, updateField, t }) => (
    <>
      <Toggle
        label={t("sitePlugins.heatmap.trackClicks")}
        checked={bool(settings.trackClicks, true)}
        onChange={(v) => updateField("trackClicks", v)}
      />
      <Toggle
        label={t("sitePlugins.heatmap.trackScroll")}
        checked={bool(settings.trackScroll, true)}
        onChange={(v) => updateField("trackScroll", v)}
      />
      <Field label={t("sitePlugins.heatmap.retention")}>
        <TextInput
          value={String(num(settings.retentionDays, 30))}
          onChange={(v) => updateField("retentionDays", Number(v) || 30)}
          type="number"
        />
      </Field>
      <div className="rounded-xl border border-dashed border-orange-200 bg-orange-50/50 p-4 text-sm text-slate-600">
        {t("sitePlugins.heatmap.readyHint")}
      </div>
    </>
  )
);

export const SiteFormAbandonmentPanel = makePanel(
  "form-abandonment",
  FormInput,
  "#F97316",
  "sitePlugins.abandonment.title",
  "sitePlugins.abandonment.description",
  ({ settings, updateField, t }) => (
    <>
      <Field label={t("sitePlugins.abandonment.minFields")}>
        <TextInput
          value={String(num(settings.minFieldsFilled, 2))}
          onChange={(v) => updateField("minFieldsFilled", Number(v) || 2)}
          type="number"
        />
      </Field>
      <Field label={t("sitePlugins.abandonment.alertEmail")}>
        <TextInput
          value={str(settings.alertEmail)}
          onChange={(v) => updateField("alertEmail", v)}
          type="email"
        />
      </Field>
      <Toggle
        label={t("sitePlugins.abandonment.partialDrafts")}
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
  "sitePlugins.journey.title",
  "sitePlugins.journey.description",
  ({ settings, updateField, t }) => (
    <>
      <Toggle
        label={t("sitePlugins.journey.maskInputs")}
        checked={bool(settings.maskInputs, true)}
        onChange={(v) => updateField("maskInputs", v)}
      />
      <Field label={t("sitePlugins.journey.maxRecordings")}>
        <TextInput
          value={String(num(settings.maxRecordings, 100))}
          onChange={(v) => updateField("maxRecordings", Number(v) || 100)}
          type="number"
        />
      </Field>
      <Field label={t("sitePlugins.journey.maxDuration")}>
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
  "sitePlugins.finder.title",
  "sitePlugins.finder.description",
  ({ settings, updateField, t }) => (
    <>
      <Field label={t("sitePlugins.finder.quizTitle")}>
        <TextInput
          value={str(settings.title, "מצאו את השירות המתאים")}
          onChange={(v) => updateField("title", v)}
        />
      </Field>
      <Field label={t("sitePlugins.finder.resultCta")}>
        <TextInput
          value={str(settings.resultCta, "צרו קשר")}
          onChange={(v) => updateField("resultCta", v)}
        />
      </Field>
      <p className="text-xs text-slate-500">
        {t("sitePlugins.finder.editHint")}
      </p>
    </>
  )
);

export const SiteAccessibilityPanel = makePanel(
  "accessibility",
  Accessibility,
  "#7C3AED",
  "sitePlugins.a11y.title",
  "sitePlugins.a11y.description",
  ({ settings, updateField, t }) => {
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
          {t("sitePlugins.a11y.intro")}
        </p>
        <p className="text-xs text-slate-500">
          {t("sitePlugins.a11y.menuSide")}
        </p>
        <Field label={t("sitePlugins.a11y.buttonPosition")}>
          <select
            value={str(settings.widgetPosition, "bottom-left")}
            onChange={(e) => {
              updateField("widgetPosition", e.target.value);
              // Clear free-drag coords so the corner pin (CSS) takes effect.
              updateField("triggerPosition", undefined);
            }}
            className={inputBase}
          >
            <option value="bottom-left">{t("sitePlugins.a11y.bottomLeft")}</option>
            <option value="bottom-right">{t("sitePlugins.a11y.bottomRight")}</option>
          </select>
        </Field>
        <Field label={t("sitePlugins.a11y.brandColor")}>
          <TextInput
            value={str(settings.accentColor, "#7C3AED")}
            onChange={(v) => updateField("accentColor", v || "#7C3AED")}
          />
        </Field>
        <Toggle
          label={t("sitePlugins.a11y.highlightLinks")}
          checked={bool(features.highlightLinks, true)}
          onChange={(v) => setFeature("highlightLinks", v)}
        />
        <Toggle
          label={t("sitePlugins.a11y.contrast")}
          checked={bool(features.contrast, true)}
          onChange={(v) => setFeature("contrast", v)}
        />
        <Toggle
          label={t("sitePlugins.a11y.textSpacing")}
          checked={bool(features.textSpacing, true)}
          onChange={(v) => setFeature("textSpacing", v)}
        />
        <Toggle
          label={t("sitePlugins.a11y.largeText")}
          checked={bool(features.largeText, true)}
          onChange={(v) => setFeature("largeText", v)}
        />
        <Toggle
          label={t("sitePlugins.a11y.hideImages")}
          checked={bool(features.hideImages, true)}
          onChange={(v) => setFeature("hideImages", v)}
        />
        <Toggle
          label={t("sitePlugins.a11y.stopAnimations")}
          checked={bool(features.stopAnimations, true)}
          onChange={(v) => setFeature("stopAnimations", v)}
        />
        <Toggle
          label={t("sitePlugins.a11y.largeCursor")}
          checked={bool(features.largeCursor, true)}
          onChange={(v) => setFeature("largeCursor", v)}
        />
        <Toggle
          label={t("sitePlugins.a11y.dyslexia")}
          checked={bool(features.dyslexia, true)}
          onChange={(v) => setFeature("dyslexia", v)}
        />
        <Toggle
          label={t("sitePlugins.a11y.lineHeight")}
          checked={bool(features.lineHeight, true)}
          onChange={(v) => setFeature("lineHeight", v)}
        />
        <Toggle
          label={t("sitePlugins.a11y.descriptions")}
          checked={bool(features.descriptions, true)}
          onChange={(v) => setFeature("descriptions", v)}
        />
        <Toggle
          label={t("sitePlugins.a11y.saturation")}
          checked={bool(features.saturation, true)}
          onChange={(v) => setFeature("saturation", v)}
        />
        <Toggle
          label={t("sitePlugins.a11y.textAlign")}
          checked={bool(features.textAlign, true)}
          onChange={(v) => setFeature("textAlign", v)}
        />
      </>
    );
  }
);

export const SiteWhatsAppFloatPanel = makePanel(
  "whatsapp-float",
  MessageCircle,
  "#22C55E",
  "WhatsApp",
  "sitePlugins.whatsapp.description",
  ({ settings, updateField, t }) => (
    <>
      <Field label={t("sitePlugins.whatsapp.phone")}>
        <TextInput
          value={str(settings.phone)}
          onChange={(v) => updateField("phone", v)}
          placeholder="97250..."
        />
      </Field>
      <Toggle
        label={t("sitePlugins.whatsapp.agentPicker")}
        checked={bool(settings.agentPicker, true)}
        onChange={(v) => updateField("agentPicker", v)}
      />
      <Toggle
        label={t("sitePlugins.whatsapp.workingHours")}
        checked={bool(settings.workingHoursEnabled, true)}
        onChange={(v) => updateField("workingHoursEnabled", v)}
      />
      <Field label={t("sitePlugins.whatsapp.offline")}>
        <TextInput
          value={str(settings.offlineMessage, "נחזור אליכם בשעות הפעילות")}
          onChange={(v) => updateField("offlineMessage", v)}
        />
      </Field>
    </>
  )
);

export const SiteExitPopupPanel = makePanel(
  "exit-popup",
  DoorOpen,
  "#EF4444",
  "sitePlugins.popup.title",
  "sitePlugins.popup.description",
  ({ settings, updateField, t }) => (
    <>
      <Field label={t("sitePlugins.popup.headline")}>
        <TextInput value={str(settings.headline)} onChange={(v) => updateField("headline", v)} />
      </Field>
      <Field label={t("sitePlugins.popup.delay")}>
        <TextInput
          type="number"
          value={String(num(settings.delaySeconds, 5))}
          onChange={(v) => updateField("delaySeconds", Number(v) || 5)}
        />
      </Field>
      <Field label={t("sitePlugins.popup.scroll")}>
        <TextInput
          type="number"
          value={String(num(settings.scrollPercent, 50))}
          onChange={(v) => updateField("scrollPercent", Number(v) || 0)}
        />
      </Field>
    </>
  )
);

export const SiteSocialProofPanel = makePanel(
  "social-proof",
  Megaphone,
  "#F97316",
  "Social Proof",
  "sitePlugins.social.description",
  ({ settings, updateField, t }) => (
    <>
      <Toggle
        label={t("sitePlugins.social.demoMode")}
        checked={bool(settings.demoMode)}
        onChange={(v) => updateField("demoMode", v)}
      />
      <Field label={t("sitePlugins.social.position")}>
        <TextInput
          value={str(settings.position, "bottom-left")}
          onChange={(v) => updateField("position", v)}
        />
      </Field>
    </>
  )
);

export const SiteFloatingContactBarPanel = makePanel(
  "floating-contact-bar",
  MessageCircle,
  "#0F172A",
  "sitePlugins.contactBar.title",
  "sitePlugins.contactBar.description",
  ({ settings, updateField, t }) => (
    <>
      <Toggle
        label="WhatsApp"
        checked={bool(settings.showWhatsapp, true)}
        onChange={(v) => updateField("showWhatsapp", v)}
      />
      <Toggle
        label={t("sitePlugins.contactBar.phone")}
        checked={bool(settings.showPhone, true)}
        onChange={(v) => updateField("showPhone", v)}
      />
      <Toggle
        label={t("sitePlugins.contactBar.email")}
        checked={bool(settings.showEmail, true)}
        onChange={(v) => updateField("showEmail", v)}
      />
      <Toggle
        label={t("sitePlugins.contactBar.form")}
        checked={bool(settings.showForm)}
        onChange={(v) => updateField("showForm", v)}
      />
      <Toggle
        label={t("sitePlugins.contactBar.booking")}
        checked={bool(settings.showBooking)}
        onChange={(v) => updateField("showBooking", v)}
      />
      <Field label={t("sitePlugins.contactBar.emailField")}>
        <TextInput value={str(settings.email)} onChange={(v) => updateField("email", v)} />
      </Field>
    </>
  )
);

export const SiteFormToPdfPanel = makePanel(
  "form-to-pdf",
  FileText,
  "#B45309",
  "Form to PDF",
  "sitePlugins.pdf.description",
  ({ settings, updateField, t }) => (
    <>
      <Toggle
        label={t("sitePlugins.pdf.includeLogo")}
        checked={bool(settings.includeLogo, true)}
        onChange={(v) => updateField("includeLogo", v)}
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
  heatmap: SiteHeatmapPanel,
  "form-abandonment": SiteFormAbandonmentPanel,
  "journey-recording": SiteJourneyRecordingPanel,
  countdown: SiteCountdownPanel,
  "smart-forms": SmartFormsInboxPanel,
  "analytics-pro": AnalyticsProPanel,
  "seo-pro": SeoProPanel,
  "multi-language": MultiLanguagePanel,
  "refer-a-friend": ReferAFriendPanel,
  "birthday-club": BirthdayClubPanel,
  "qr-generator": QrGeneratorPanel,
  "faq-pro": FaqProPanel,
  "whatsapp-float": SiteWhatsAppFloatPanel,
  "exit-popup": SiteExitPopupPanel,
  "social-proof": SiteSocialProofPanel,
  "floating-contact-bar": SiteFloatingContactBarPanel,
  "form-to-pdf": SiteFormToPdfPanel,
  "benefits-wheel": SiteBenefitsWheelPanel,
  "smart-search": SmartSearchPanel,
  "smart-bot": SmartBotPanel,
  "service-finder": SiteServiceFinderPanel,
  accessibility: SiteAccessibilityPanel,
};
