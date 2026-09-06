import React from "react";
import { Bot, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

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
  type SmartBotOptionAction,
  type SmartBotSettings,
  type SmartBotTreeNode,
  type SmartBotTriggerStyle,
} from "../../../site-plugins/smart-bot/smartBotUtils";
import { btnSecondary } from "../siteManagementUi";

function optionActions(t: (key: string) => string): Array<{ value: SmartBotOptionAction; label: string }> {
  return [
    { value: "next", label: t("sitePlugins.smartBot.actionNext") },
    { value: "reply", label: t("sitePlugins.smartBot.actionReply") },
    { value: "ask-input", label: t("sitePlugins.smartBot.actionAsk") },
    { value: "contact", label: t("sitePlugins.smartBot.actionContact") },
    { value: "end", label: t("sitePlugins.smartBot.actionEnd") },
    { value: "open-link", label: t("sitePlugins.smartBot.actionLink") },
  ];
}

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
  const { t } = useTranslation();
  const color = value || fallback;
  return (
    <Field label={label} hint={t("sitePlugins.smartBot.hexHint")}>
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
  const { t } = useTranslation();
  const triggerStyle = settings.triggerStyle || "both";
  const showIcon = triggerStyle === "icon" || triggerStyle === "both";
  const showLabel = triggerStyle === "label" || triggerStyle === "both";
  const triggerColor = settings.triggerColor || "#0F766E";
  const triggerTextColor = settings.triggerTextColor || "#FFFFFF";
  const headerColor = settings.windowHeaderColor || "#0F766E";
  const windowBg = settings.windowBgColor || "#FFFFFF";
  const botBubble = settings.botBubbleColor || "#F1F5F9";
  const botText = settings.botBubbleTextColor || "#0F172A";
  const label = settings.triggerLabel || t("sitePlugins.smartBot.defaultTrigger");

  return (
    <div className="space-y-3 md:sticky md:top-4">
      <div className="overflow-hidden rounded-2xl border border-teal-200/80 bg-gradient-to-br from-teal-50 via-white to-slate-50 shadow-sm">
        <div className="border-b border-teal-100/80 px-4 py-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-teal-700">
            {t("sitePlugins.smartBot.preview")}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            {t("sitePlugins.smartBot.previewHint")}
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
              {settings.botName || t("sitePlugins.smartBot.defaultName")}
            </strong>
            <span className="block text-[10px] font-semibold text-white/80">
              {t("sitePlugins.smartBot.online")}
            </span>
          </div>
        </div>
        <div className="space-y-2 px-3 py-3" style={{ background: windowBg }}>
          <div
            className="mr-auto max-w-[90%] rounded-2xl px-3 py-2 text-[11px] font-medium leading-5"
            style={{ background: botBubble, color: botText }}
          >
            {settings.welcomeMessage || t("sitePlugins.smartBot.defaultWelcome")}
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
        {t("sitePlugins.smartBot.editorTip")}
      </InfoCallout>
    </div>
  );
}

export default function SmartBotPanel(props: PluginPanelProps) {
  const { t } = useTranslation();
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
        title: t("sitePlugins.smartBot.stepN", { n: nodes.length + 1 }),
        message: t("sitePlugins.smartBot.defaultStepMessage"),
        options: [{ id: newOptionId({ id, title: "", message: "", options: [] }), label: t("sitePlugins.smartBot.continue"), nextNodeId: merged.startNodeId }],
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
      title={t("sitePlugins.smartBot.title")}
      description={t("sitePlugins.smartBot.description")}
      loading={loading}
      saving={saving}
      message={message}
      onSave={() => save()}
      sidebar={<SmartBotLivePreview settings={merged} />}
    >
      <SettingsSection title={t("sitePlugins.smartBot.activation")} description={t("sitePlugins.smartBot.activationHint")}>
        <Toggle
          label={t("sitePlugins.smartBot.pluginActive")}
          checked={bool(settings.isActive, true)}
          onChange={(v) => updateField("isActive", v)}
        />
        <Field label={t("sitePlugins.smartBot.botName")}>
          <TextInput
            value={str(settings.botName, t("sitePlugins.smartBot.defaultName"))}
            onChange={(v) => updateField("botName", v)}
          />
        </Field>
        <Field label={t("sitePlugins.smartBot.welcome")}>
          <TextArea
            value={str(settings.welcomeMessage, merged.welcomeMessage || "")}
            onChange={(v) => updateField("welcomeMessage", v)}
          />
        </Field>
      </SettingsSection>

      <SettingsSection
        title={t("sitePlugins.smartBot.trigger")}
        description={t("sitePlugins.smartBot.triggerHint")}
      >
        <Field label={t("sitePlugins.smartBot.triggerStyle")}>
          <select
            className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-100"
            value={str(settings.triggerStyle, "both") as SmartBotTriggerStyle}
            onChange={(e) =>
              updateField("triggerStyle", e.target.value as SmartBotTriggerStyle)
            }
          >
            <option value="icon">{t("sitePlugins.smartBot.styleIcon")}</option>
            <option value="label">{t("sitePlugins.smartBot.styleLabel")}</option>
            <option value="both">{t("sitePlugins.smartBot.styleBoth")}</option>
          </select>
        </Field>
        <Field label={t("sitePlugins.smartBot.triggerText")}>
          <TextInput
            value={str(settings.triggerLabel, t("sitePlugins.smartBot.defaultTrigger"))}
            onChange={(v) => updateField("triggerLabel", v)}
            placeholder={t("sitePlugins.smartBot.defaultTrigger")}
          />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <ColorField
            label={t("sitePlugins.smartBot.triggerColor")}
            value={str(settings.triggerColor, "#0F766E")}
            fallback="#0F766E"
            onChange={(v) => updateField("triggerColor", v)}
          />
          <ColorField
            label={t("sitePlugins.smartBot.textColor")}
            value={str(settings.triggerTextColor, "#FFFFFF")}
            fallback="#FFFFFF"
            onChange={(v) => updateField("triggerTextColor", v)}
          />
        </div>
      </SettingsSection>

      <SettingsSection
        title={t("sitePlugins.smartBot.window")}
        description={t("sitePlugins.smartBot.windowHint")}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <ColorField
            label={t("sitePlugins.smartBot.headerColor")}
            value={str(settings.windowHeaderColor, "#0F766E")}
            fallback="#0F766E"
            onChange={(v) => updateField("windowHeaderColor", v)}
          />
          <ColorField
            label={t("sitePlugins.smartBot.windowBg")}
            value={str(settings.windowBgColor, "#FFFFFF")}
            fallback="#FFFFFF"
            onChange={(v) => updateField("windowBgColor", v)}
          />
          <ColorField
            label={t("sitePlugins.smartBot.botBubble")}
            value={str(settings.botBubbleColor, "#F1F5F9")}
            fallback="#F1F5F9"
            onChange={(v) => updateField("botBubbleColor", v)}
          />
          <ColorField
            label={t("sitePlugins.smartBot.botBubbleText")}
            value={str(settings.botBubbleTextColor, "#0F172A")}
            fallback="#0F172A"
            onChange={(v) => updateField("botBubbleTextColor", v)}
          />
          <ColorField
            label={t("sitePlugins.smartBot.userBubble")}
            value={str(settings.userBubbleColor, "#0F766E")}
            fallback="#0F766E"
            onChange={(v) => updateField("userBubbleColor", v)}
          />
          <ColorField
            label={t("sitePlugins.smartBot.userBubbleText")}
            value={str(settings.userBubbleTextColor, "#FFFFFF")}
            fallback="#FFFFFF"
            onChange={(v) => updateField("userBubbleTextColor", v)}
          />
        </div>
      </SettingsSection>

      <SettingsSection
        title={t("sitePlugins.smartBot.contact")}
        description={t("sitePlugins.smartBot.contactHint")}
      >
        <Toggle
          label={t("sitePlugins.smartBot.showContact")}
          checked={bool(settings.contactEnabled, true)}
          onChange={(v) => updateField("contactEnabled", v)}
        />
        <Field label={t("sitePlugins.smartBot.contactLabel")}>
          <TextInput
            value={str(settings.contactLabel, t("sitePlugins.smartBot.defaultContact"))}
            onChange={(v) => updateField("contactLabel", v)}
          />
        </Field>
        <Field label={t("sitePlugins.smartBot.phone")}>
          <TextInput
            value={str(settings.contactPhone)}
            onChange={(v) => updateField("contactPhone", v)}
            placeholder="050-0000000"
          />
        </Field>
        <Field label="WhatsApp" hint={t("sitePlugins.smartBot.whatsappHint")}>
          <TextInput
            value={str(settings.contactWhatsapp)}
            onChange={(v) => updateField("contactWhatsapp", v)}
            placeholder="97250..."
          />
        </Field>
        <Field label={t("sitePlugins.smartBot.email")}>
          <TextInput
            value={str(settings.contactEmail)}
            onChange={(v) => updateField("contactEmail", v)}
            type="email"
            placeholder="hello@business.com"
          />
        </Field>
      </SettingsSection>

      <SettingsSection
        title={t("sitePlugins.smartBot.trees")}
        description={t("sitePlugins.smartBot.treesHint")}
      >
        <Field label={t("sitePlugins.smartBot.startStep")}>
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
                  {t("sitePlugins.smartBot.stepN", { n: index + 1 })}
                </strong>
                <button
                  type="button"
                  onClick={() => removeNode(node.id)}
                  disabled={nodes.length <= 1}
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-40"
                >
                  <Trash2 size={14} />
                  {t("sitePlugins.smartBot.delete")}
                </button>
              </div>

              <Field label={t("sitePlugins.smartBot.stepTitle")}>
                <TextInput
                  value={node.title}
                  onChange={(v) => updateNode(node.id, { title: v })}
                />
              </Field>
              <Field label={t("sitePlugins.smartBot.botMessage")}>
                <TextArea
                  value={node.message}
                  onChange={(v) => updateNode(node.id, { message: v })}
                />
              </Field>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-800">
                    {t("sitePlugins.smartBot.optionsHint")}
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
                            label: t("sitePlugins.smartBot.newOption"),
                            action: "reply",
                            replyText: t("sitePlugins.smartBot.defaultReply"),
                          },
                        ],
                      })
                    }
                  >
                    <Plus size={14} className="ml-1 inline" />
                    {t("sitePlugins.smartBot.addOption")}
                  </button>
                </div>

                {(node.options || []).map((option, optIndex) => {
                  const action = (option.action ||
                    (option.nextNodeId ? "next" : "reply")) as SmartBotOptionAction;
                  const patchOption = (patch: Partial<typeof option>) => {
                    const options = [...(node.options || [])];
                    options[optIndex] = { ...option, ...patch };
                    updateNode(node.id, { options });
                  };

                  return (
                    <div
                      key={option.id}
                      className="space-y-2 rounded-lg border border-slate-200 bg-white p-3"
                    >
                      <div className="flex items-start gap-2">
                        <div className="min-w-0 flex-1 space-y-2">
                          <Field label={t("sitePlugins.smartBot.optionLabel")}>
                            <TextInput
                              value={option.label}
                              onChange={(v) => patchOption({ label: v })}
                              placeholder={t("sitePlugins.smartBot.optionPlaceholder")}
                            />
                          </Field>
                          <Field label={t("sitePlugins.smartBot.afterClick")}>
                            <select
                              className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800"
                              value={action}
                              onChange={(e) => {
                                const value = e.target.value as SmartBotOptionAction;
                                patchOption({
                                  action: value,
                                  nextNodeId:
                                    value === "next" || value === "reply" || value === "ask-input"
                                      ? option.nextNodeId || nodes[0]?.id
                                      : undefined,
                                });
                              }}
                            >
                              {optionActions(t).map((item) => (
                                <option key={item.value} value={item.value}>
                                  {item.label}
                                </option>
                              ))}
                            </select>
                          </Field>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const options = (node.options || []).filter(
                              (_, i) => i !== optIndex
                            );
                            updateNode(node.id, { options });
                          }}
                          className="grid h-11 w-11 shrink-0 place-items-center rounded-lg text-rose-600 hover:bg-rose-50"
                          aria-label={t("sitePlugins.smartBot.deleteOption")}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {action === "reply" || action === "end" ? (
                        <Field
                          label={
                            action === "end"
                              ? t("sitePlugins.smartBot.endMessage")
                              : t("sitePlugins.smartBot.manualReply")
                          }
                        >
                          <TextArea
                            value={option.replyText || ""}
                            onChange={(v) => patchOption({ replyText: v })}
                            placeholder={t("sitePlugins.smartBot.replyPlaceholder")}
                          />
                        </Field>
                      ) : null}

                      {action === "ask-input" ? (
                        <>
                          <Field label={t("sitePlugins.smartBot.askPrompt")}>
                            <TextInput
                              value={option.payload?.prompt || ""}
                              onChange={(v) =>
                                patchOption({
                                  payload: { ...(option.payload || {}), prompt: v },
                                })
                              }
                              placeholder={t("sitePlugins.smartBot.askPlaceholder")}
                            />
                          </Field>
                          <Field label={t("sitePlugins.smartBot.afterVisitor")}>
                            <TextArea
                              value={option.replyText || ""}
                              onChange={(v) => patchOption({ replyText: v })}
                              placeholder={t("sitePlugins.smartBot.thanksPlaceholder")}
                            />
                          </Field>
                        </>
                      ) : null}

                      {action === "open-link" ? (
                        <Field label={t("sitePlugins.smartBot.linkUrl")}>
                          <TextInput
                            value={option.payload?.url || ""}
                            onChange={(v) =>
                              patchOption({
                                payload: { ...(option.payload || {}), url: v },
                              })
                            }
                            placeholder="https://..."
                          />
                        </Field>
                      ) : null}

                      {action === "contact" ? (
                        <p className="text-xs text-slate-500">
                          {t("sitePlugins.smartBot.opensContact")}
                        </p>
                      ) : null}

                      {action === "next" ||
                      action === "reply" ||
                      action === "ask-input" ? (
                        <Field label={t("sitePlugins.smartBot.thenGo")}>
                          <div className="flex flex-wrap gap-2">
                            <select
                              className="h-11 min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800"
                              value={option.nextNodeId || ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === "__new__") {
                                  const id = newTreeNodeId(nodes);
                                  const created = {
                                    id,
                                    title: t("sitePlugins.smartBot.stepN", { n: nodes.length + 1 }),
                                    message: t("sitePlugins.smartBot.newStepMessage"),
                                    options: [],
                                  };
                                  const nextNodes = nodes.map((n) => {
                                    if (n.id !== node.id) return n;
                                    const options = [...(n.options || [])];
                                    options[optIndex] = {
                                      ...option,
                                      nextNodeId: id,
                                    };
                                    return { ...n, options };
                                  });
                                  setNodes([...nextNodes, created]);
                                  return;
                                }
                                patchOption({
                                  nextNodeId: value || undefined,
                                });
                              }}
                            >
                              <option value="">{t("sitePlugins.smartBot.noNext")}</option>
                              {nodes.map((target) => (
                                <option key={target.id} value={target.id}>
                                  → {target.title || target.id}
                                </option>
                              ))}
                              <option value="__new__">{t("sitePlugins.smartBot.createStep")}</option>
                            </select>
                          </div>
                        </Field>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <button type="button" className={btnSecondary + " h-10 text-xs"} onClick={addNode}>
          <Plus size={14} className="ml-1 inline" />
          {t("sitePlugins.smartBot.addStep")}
        </button>
      </SettingsSection>
    </SitePluginPanelFrame>
  );
}
