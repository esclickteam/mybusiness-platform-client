import React from "react";
import { Bot, Plus, Trash2 } from "lucide-react";

import { useSitePluginSettings } from "./useSitePluginSettings";
import {
  bool,
  Field,
  InfoCallout,
  PluginPanelProps,
  SettingsSection,
  SitePluginPanelFrame,
  str,
  TextArea,
  TextInput,
  Toggle,
} from "./SitePluginPanelFrame";
import {
  mergeSmartBotSettings,
  newOptionId,
  newTreeNodeId,
  type SmartBotSettings,
  type SmartBotTreeNode,
  type SmartBotTriggerStyle,
} from "../../../site-plugins/smart-bot/smartBotUtils";
import { btnSecondary } from "../siteManagementUi";

function ColorField({
  label,
  value,
  fallback,
  onChange,
}: {
  label: string;
  value: string;
  fallback: string;
  onChange: (v: string) => void;
}) {
  const color = value || fallback;
  return (
    <Field label={label} hint="קוד HEX">
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={/^#[0-9A-Fa-f]{6}$/.test(color) ? color : fallback}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-14 cursor-pointer rounded-lg border border-slate-200 bg-white p-1"
        />
        <TextInput value={color} onChange={onChange} placeholder={fallback} />
      </div>
    </Field>
  );
}

function SmartBotLivePreview({ settings }: { settings: SmartBotSettings }) {
  const triggerStyle = settings.triggerStyle || "both";
  const showIcon = triggerStyle === "icon" || triggerStyle === "both";
  const showLabel = triggerStyle === "label" || triggerStyle === "both";
  const triggerColor = settings.triggerColor || "#0F766E";
  const triggerTextColor = settings.triggerTextColor || "#FFFFFF";
  const headerColor = settings.windowHeaderColor || "#0F766E";
  const windowBg = settings.windowBgColor || "#FFFFFF";
  const botBubble = settings.botBubbleColor || "#F1F5F9";
  const botText = settings.botBubbleTextColor || "#0F172A";
  const label = settings.triggerLabel || "צריכים עזרה?";

  return (
    <div className="space-y-3 md:sticky md:top-4">
      <div className="overflow-hidden rounded-2xl border border-teal-200/80 bg-gradient-to-br from-teal-50 via-white to-slate-50 shadow-sm">
        <div className="border-b border-teal-100/80 px-4 py-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-teal-700">
            תצוגה מקדימה
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            הכפתור כפי שיופיע באתר
          </p>
        </div>

        <div
          className="relative flex min-h-[168px] items-end justify-end p-5"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 45%, #f1f5f9 100%)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-4 rounded-xl border border-dashed border-slate-300/70 bg-white/40"
            aria-hidden
          />
          <span
            className={`relative z-[1] inline-flex items-center gap-2 shadow-lg ${
              showLabel
                ? "rounded-full px-4 py-3"
                : "h-14 w-14 justify-center rounded-full"
            }`}
            style={{ background: triggerColor, color: triggerTextColor }}
          >
            {showIcon ? <Bot size={22} /> : null}
            {showLabel ? (
              <span className="text-sm font-bold whitespace-nowrap">{label}</span>
            ) : null}
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div
          className="flex items-center gap-2.5 px-3 py-2.5 text-white"
          style={{ background: headerColor }}
        >
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-white/15">
            <Bot size={16} />
          </span>
          <div className="min-w-0">
            <strong className="block truncate text-xs font-black">
              {settings.botName || "בוט חכם"}
            </strong>
            <span className="block text-[10px] font-semibold text-white/80">
              אונליין · עונה מיד
            </span>
          </div>
        </div>
        <div className="space-y-2 px-3 py-3" style={{ background: windowBg }}>
          <div
            className="mr-auto max-w-[90%] rounded-2xl px-3 py-2 text-[11px] font-medium leading-5"
            style={{ background: botBubble, color: botText }}
          >
            {settings.welcomeMessage || "שלום! איך אפשר לעזור לכם היום?"}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(settings.nodes?.[0]?.options || [])
              .slice(0, 2)
              .map((option) => (
                <span
                  key={option.id}
                  className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold text-slate-700"
                >
                  {option.label}
                </span>
              ))}
          </div>
        </div>
      </div>

      <InfoCallout variant="tip">
        בעורך: תוספים → גררו את כפתור הבוט למיקום הרצוי. בלחיצה באתר החי נפתח חלון
        השיחה לפי עץ השיחה שהגדרתם.
      </InfoCallout>
    </div>
  );
}

export default function SmartBotPanel(props: PluginPanelProps) {
  const { settings, loading, saving, message, save, updateField } =
    useSitePluginSettings(props.siteId, "smart-bot");

  const merged = mergeSmartBotSettings(settings as SmartBotSettings);
  const nodes = merged.nodes || [];

  function setNodes(next: SmartBotTreeNode[]) {
    updateField("nodes", next);
    if (!next.some((n) => n.id === merged.startNodeId) && next[0]) {
      updateField("startNodeId", next[0].id);
    }
  }

  function updateNode(nodeId: string, patch: Partial<SmartBotTreeNode>) {
    setNodes(
      nodes.map((node) => (node.id === nodeId ? { ...node, ...patch } : node))
    );
  }

  function addNode() {
    const id = newTreeNodeId(nodes);
    setNodes([
      ...nodes,
      {
        id,
        title: `שלב ${nodes.length + 1}`,
        message: "הודעת הבוט בשלב זה...",
        options: [{ id: newOptionId({ id, title: "", message: "", options: [] }), label: "המשך", nextNodeId: merged.startNodeId }],
      },
    ]);
  }

  function removeNode(nodeId: string) {
    if (nodes.length <= 1) return;
    setNodes(nodes.filter((n) => n.id !== nodeId));
  }

  return (
    <SitePluginPanelFrame
      {...props}
      icon={Bot}
      accent="#0F766E"
      title="בוט חכם"
      description="עצי שיחה שהעסק בונה, כפתור עזרה מותאם, עיצוב חלון השיחה ואפשרות יצירת קשר."
      loading={loading}
      saving={saving}
      message={message}
      onSave={() => save()}
      sidebar={<SmartBotLivePreview settings={merged} />}
    >
      <SettingsSection title="הפעלה" description="זמינות התוסף באתר">
        <Toggle
          label="תוסף פעיל באתר"
          checked={bool(settings.isActive, true)}
          onChange={(v) => updateField("isActive", v)}
        />
        <Field label="שם הבוט">
          <TextInput
            value={str(settings.botName, "בוט חכם")}
            onChange={(v) => updateField("botName", v)}
          />
        </Field>
        <Field label="הודעת פתיחה">
          <TextArea
            value={str(settings.welcomeMessage, merged.welcomeMessage || "")}
            onChange={(v) => updateField("welcomeMessage", v)}
          />
        </Field>
      </SettingsSection>

      <SettingsSection
        title="כפתור הפעלה"
        description="איך נראה הטריגר שפותח את הבוט"
      >
        <Field label="סגנון הכפתור">
          <select
            className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-100"
            value={str(settings.triggerStyle, "both") as SmartBotTriggerStyle}
            onChange={(e) =>
              updateField("triggerStyle", e.target.value as SmartBotTriggerStyle)
            }
          >
            <option value="icon">אייקון בוט בלבד</option>
            <option value="label">כיתוב בלבד</option>
            <option value="both">אייקון + כיתוב</option>
          </select>
        </Field>
        <Field label="טקסט הכפתור">
          <TextInput
            value={str(settings.triggerLabel, "צריכים עזרה?")}
            onChange={(v) => updateField("triggerLabel", v)}
            placeholder="צריכים עזרה?"
          />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <ColorField
            label="צבע הכפתור"
            value={str(settings.triggerColor, "#0F766E")}
            fallback="#0F766E"
            onChange={(v) => updateField("triggerColor", v)}
          />
          <ColorField
            label="צבע הטקסט"
            value={str(settings.triggerTextColor, "#FFFFFF")}
            fallback="#FFFFFF"
            onChange={(v) => updateField("triggerTextColor", v)}
          />
        </div>
      </SettingsSection>

      <SettingsSection
        title="חלון השיחה"
        description="עיצוב חלון הצ׳אט שנפתח באתר"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <ColorField
            label="צבע כותרת"
            value={str(settings.windowHeaderColor, "#0F766E")}
            fallback="#0F766E"
            onChange={(v) => updateField("windowHeaderColor", v)}
          />
          <ColorField
            label="רקע החלון"
            value={str(settings.windowBgColor, "#FFFFFF")}
            fallback="#FFFFFF"
            onChange={(v) => updateField("windowBgColor", v)}
          />
          <ColorField
            label="בועת הבוט"
            value={str(settings.botBubbleColor, "#F1F5F9")}
            fallback="#F1F5F9"
            onChange={(v) => updateField("botBubbleColor", v)}
          />
          <ColorField
            label="טקסט בועת הבוט"
            value={str(settings.botBubbleTextColor, "#0F172A")}
            fallback="#0F172A"
            onChange={(v) => updateField("botBubbleTextColor", v)}
          />
          <ColorField
            label="בועת המשתמש"
            value={str(settings.userBubbleColor, "#0F766E")}
            fallback="#0F766E"
            onChange={(v) => updateField("userBubbleColor", v)}
          />
          <ColorField
            label="טקסט בועת המשתמש"
            value={str(settings.userBubbleTextColor, "#FFFFFF")}
            fallback="#FFFFFF"
            onChange={(v) => updateField("userBubbleTextColor", v)}
          />
        </div>
      </SettingsSection>

      <SettingsSection
        title="יצירת קשר"
        description="אפשרות ליצירת קשר מתוך השיחה"
      >
        <Toggle
          label="הצג אפשרות יצירת קשר"
          checked={bool(settings.contactEnabled, true)}
          onChange={(v) => updateField("contactEnabled", v)}
        />
        <Field label="תווית הכפתור">
          <TextInput
            value={str(settings.contactLabel, "צרו קשר")}
            onChange={(v) => updateField("contactLabel", v)}
          />
        </Field>
        <Field label="טלפון">
          <TextInput
            value={str(settings.contactPhone)}
            onChange={(v) => updateField("contactPhone", v)}
            placeholder="050-0000000"
          />
        </Field>
        <Field label="WhatsApp" hint="מספר בינלאומי ללא +, למשל 97250...">
          <TextInput
            value={str(settings.contactWhatsapp)}
            onChange={(v) => updateField("contactWhatsapp", v)}
            placeholder="97250..."
          />
        </Field>
        <Field label="אימייל">
          <TextInput
            value={str(settings.contactEmail)}
            onChange={(v) => updateField("contactEmail", v)}
            type="email"
            placeholder="hello@business.com"
          />
        </Field>
      </SettingsSection>

      <SettingsSection
        title="עצי שיחה"
        description="בנו את מסלול השיחה — שלבים, הודעות וכפתורי בחירה"
      >
        <Field label="שלב התחלה">
          <select
            className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-100"
            value={str(settings.startNodeId, nodes[0]?.id || "welcome")}
            onChange={(e) => updateField("startNodeId", e.target.value)}
          >
            {nodes.map((node) => (
              <option key={node.id} value={node.id}>
                {node.title || node.id}
              </option>
            ))}
          </select>
        </Field>

        <div className="space-y-4">
          {nodes.map((node, index) => (
            <div
              key={node.id}
              className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <strong className="text-sm font-bold text-slate-800">
                  שלב {index + 1}
                </strong>
                <button
                  type="button"
                  onClick={() => removeNode(node.id)}
                  disabled={nodes.length <= 1}
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-40"
                >
                  <Trash2 size={14} />
                  מחק
                </button>
              </div>

              <Field label="כותרת השלב">
                <TextInput
                  value={node.title}
                  onChange={(v) => updateNode(node.id, { title: v })}
                />
              </Field>
              <Field label="הודעת הבוט">
                <TextArea
                  value={node.message}
                  onChange={(v) => updateNode(node.id, { message: v })}
                />
              </Field>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-800">
                    אפשרויות בחירה
                  </span>
                  <button
                    type="button"
                    className={btnSecondary + " h-8 px-3 text-xs"}
                    onClick={() =>
                      updateNode(node.id, {
                        options: [
                          ...(node.options || []),
                          {
                            id: newOptionId(node),
                            label: "אפשרות חדשה",
                            nextNodeId: nodes[0]?.id,
                          },
                        ],
                      })
                    }
                  >
                    <Plus size={14} className="ml-1 inline" />
                    הוסף אפשרות
                  </button>
                </div>

                {(node.options || []).map((option, optIndex) => (
                  <div
                    key={option.id}
                    className="grid gap-2 rounded-lg border border-slate-200 bg-white p-3 sm:grid-cols-[1fr_1fr_1fr_auto]"
                  >
                    <TextInput
                      value={option.label}
                      onChange={(v) => {
                        const options = [...(node.options || [])];
                        options[optIndex] = { ...option, label: v };
                        updateNode(node.id, { options });
                      }}
                      placeholder="טקסט הכפתור"
                    />
                    <select
                      className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800"
                      value={option.action || "next"}
                      onChange={(e) => {
                        const value = e.target.value;
                        const options = [...(node.options || [])];
                        if (value === "contact") {
                          options[optIndex] = {
                            ...option,
                            action: "contact",
                            nextNodeId: undefined,
                          };
                        } else {
                          options[optIndex] = {
                            ...option,
                            action: undefined,
                            nextNodeId: option.nextNodeId || nodes[0]?.id,
                          };
                        }
                        updateNode(node.id, { options });
                      }}
                    >
                      <option value="next">מעבר לשלב</option>
                      <option value="contact">יצירת קשר</option>
                    </select>
                    {option.action === "contact" ? (
                      <div className="flex h-11 items-center text-xs text-slate-500">
                        פותח אפשרויות קשר
                      </div>
                    ) : (
                      <select
                        className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800"
                        value={option.nextNodeId || ""}
                        onChange={(e) => {
                          const options = [...(node.options || [])];
                          options[optIndex] = {
                            ...option,
                            nextNodeId: e.target.value,
                            action: undefined,
                          };
                          updateNode(node.id, { options });
                        }}
                      >
                        {nodes.map((target) => (
                          <option key={target.id} value={target.id}>
                            → {target.title || target.id}
                          </option>
                        ))}
                      </select>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        const options = (node.options || []).filter(
                          (_, i) => i !== optIndex
                        );
                        updateNode(node.id, { options });
                      }}
                      className="grid h-11 w-11 place-items-center rounded-lg text-rose-600 hover:bg-rose-50"
                      aria-label="מחק אפשרות"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button type="button" className={btnSecondary + " h-10 text-xs"} onClick={addNode}>
          <Plus size={14} className="ml-1 inline" />
          הוסף שלב לעץ השיחה
        </button>
      </SettingsSection>
    </SitePluginPanelFrame>
  );
}
