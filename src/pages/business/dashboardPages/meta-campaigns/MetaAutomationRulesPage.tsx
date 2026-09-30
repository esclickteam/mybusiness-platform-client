import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  deleteAutomationRule,
  evaluateAutomationRule,
  getAutomationRuleHistory,
  listAutomationRules,
  saveAutomationRule,
  testAutomationRule,
  type AutomationRule,
} from "../../../../api/metaCampaignsApi";
import { btnPrimary, btnSecondary, cardBase, inputBase } from "../../../../styles/bizuplyUi";
import { AUTOMATION_TEMPLATES } from "./metaAutomationTemplates";

const METRICS = [
  "spend",
  "results",
  "costPerResult",
  "reach",
  "impressions",
  "frequency",
  "clicks",
  "linkClicks",
  "ctr",
  "cpc",
  "cpm",
];
const OPERATORS = ["GT", "GTE", "LT", "LTE", "EQ"];
const SCOPES = ["ACCOUNT", "CAMPAIGN", "ADSET", "AD"];
const WINDOWS = ["LAST_24H", "LAST_3D", "LAST_7D"];
const ACTIONS = [
  "NOTIFY",
  "CREATE_RECOMMENDATION",
  "PAUSE_CAMPAIGN",
  "PAUSE_ADSET",
  "PAUSE_AD",
  "CHANGE_BUDGET_PCT",
  "CHANGE_BUDGET_AMOUNT",
];

const emptyForm = {
  name: "",
  scope: "CAMPAIGN",
  objectIds: "",
  metric: "ctr",
  operator: "LT",
  threshold: "1",
  window: "LAST_7D",
  consecutivePeriods: "1",
  minImpressions: "0",
  minSpend: "0",
  minResults: "0",
  minAgeHours: "0",
  action: "CREATE_RECOMMENDATION",
  actionValue: "",
  mode: "RECOMMEND",
  cooldownHours: "24",
  enabled: true,
};

export default function MetaAutomationRulesPage() {
  const { t } = useTranslation();
  const { businessId } = useOutletContext<{ businessId: string }>();
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [history, setHistory] = useState<Array<Record<string, unknown>>>([]);
  const [testResult, setTestResult] = useState<unknown>(null);
  const [busy, setBusy] = useState(false);

  async function reload() {
    if (!businessId) return;
    setRules(await listAutomationRules(businessId));
  }

  useEffect(() => {
    void reload();
  }, [businessId]);

  function setField(key: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSave() {
    if (!businessId) return;
    setBusy(true);
    try {
      await saveAutomationRule(
        businessId,
        {
          name: form.name,
          scope: form.scope,
          objectIds: form.objectIds
            ? form.objectIds.split(",").map((id) => id.trim()).filter(Boolean)
            : [],
          conditions: [
            {
              metric: form.metric,
              operator: form.operator,
              threshold: Number(form.threshold),
            },
          ],
          window: form.window,
          consecutivePeriods: Number(form.consecutivePeriods),
          minImpressions: Number(form.minImpressions),
          minSpend: Number(form.minSpend),
          minResults: Number(form.minResults),
          minAgeHours: Number(form.minAgeHours),
          action: form.action,
          actionValue: form.actionValue === "" ? null : Number(form.actionValue),
          mode: form.mode === "AUTOMATIC" ? "AUTOMATIC" : "RECOMMEND",
          cooldownHours: Number(form.cooldownHours),
          enabled: form.enabled,
        },
        editingId || undefined
      );
      setForm(emptyForm);
      setEditingId(null);
      await reload();
    } finally {
      setBusy(false);
    }
  }

  function startEdit(rule: AutomationRule) {
    const condition = rule.conditions?.[0] || { metric: "ctr", operator: "LT", threshold: 1 };
    setEditingId(rule.id);
    setForm({
      name: rule.name,
      scope: rule.scope,
      objectIds: (rule.objectIds || []).join(", "),
      metric: condition.metric,
      operator: condition.operator,
      threshold: String(condition.threshold),
      window: rule.window,
      consecutivePeriods: String(rule.consecutivePeriods),
      minImpressions: String(rule.minImpressions),
      minSpend: String(rule.minSpend),
      minResults: String(rule.minResults),
      minAgeHours: String(rule.minAgeHours),
      action: rule.action,
      actionValue: rule.actionValue == null ? "" : String(rule.actionValue),
      mode: rule.mode,
      cooldownHours: String(rule.cooldownHours),
      enabled: rule.enabled,
    });
  }

  return (
    <div className="space-y-4" data-testid="automation-rules-page">
      <section className={`${cardBase} p-4`}>
        <h2 className="text-lg font-black text-slate-900">{t("metaCampaigns.automationRules.title")}</h2>
        <p className="mt-1 text-sm font-semibold text-slate-500">
          {t("metaCampaigns.automationRules.subtitle")}
        </p>
        <p className="mt-2 text-xs font-bold text-violet-700">
          {t("metaCampaigns.automationRules.safety")}
        </p>
      </section>

      <section className={`${cardBase} space-y-3 p-4`}>
        <p className="text-sm font-black">{t("metaCampaigns.ux.templates")}</p>
        <div className="flex flex-wrap gap-2">
          {AUTOMATION_TEMPLATES.map((row) => (
            <button
              key={row.id}
              type="button"
              className={btnSecondary}
              onClick={() => {
                setEditingId(null);
                setForm({ ...emptyForm, ...row.payload });
              }}
            >
              {t(row.nameKey)}
            </button>
          ))}
          <button type="button" className={btnSecondary} onClick={() => setForm(emptyForm)}>
            {t("metaCampaigns.ux.customRule")}
          </button>
        </div>
      </section>

      <section className={`${cardBase} space-y-3 p-4`}>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-xs font-black uppercase text-slate-500">
            {t("metaCampaigns.automationRules.name")}
            <input className={`${inputBase} mt-1`} value={form.name} onChange={(e) => setField("name", e.target.value)} />
          </label>
          <label className="text-xs font-black uppercase text-slate-500">
            {t("metaCampaigns.automationRules.scope")}
            <select className={`${inputBase} mt-1`} value={form.scope} onChange={(e) => setField("scope", e.target.value)}>
              {SCOPES.map((row) => (
                <option key={row}>{row}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          <Field label={t("metaCampaigns.automationRules.when")}>
            <select className={inputBase} value={form.metric} onChange={(e) => setField("metric", e.target.value)}>
              {METRICS.map((row) => (
                <option key={row}>{row}</option>
              ))}
            </select>
          </Field>
          <Field label={t("metaCampaigns.automationRules.is")}>
            <div className="flex gap-2">
              <select className={inputBase} value={form.operator} onChange={(e) => setField("operator", e.target.value)}>
                {OPERATORS.map((row) => (
                  <option key={row}>{row}</option>
                ))}
              </select>
              <input className={inputBase} value={form.threshold} onChange={(e) => setField("threshold", e.target.value)} />
            </div>
          </Field>
          <Field label={t("metaCampaigns.automationRules.for")}>
            <select className={inputBase} value={form.window} onChange={(e) => setField("window", e.target.value)}>
              {WINDOWS.map((row) => (
                <option key={row}>{row}</option>
              ))}
            </select>
          </Field>
          <Field label={t("metaCampaigns.automationRules.then")}>
            <select className={inputBase} value={form.action} onChange={(e) => setField("action", e.target.value)}>
              {ACTIONS.map((row) => (
                <option key={row}>{row}</option>
              ))}
            </select>
          </Field>
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          <Field label={t("metaCampaigns.automationRules.onlyIf")}>
            <input className={inputBase} value={form.minImpressions} onChange={(e) => setField("minImpressions", e.target.value)} />
          </Field>
          <Field label={t("metaCampaigns.automationRules.minSpend")}>
            <input className={inputBase} value={form.minSpend} onChange={(e) => setField("minSpend", e.target.value)} />
          </Field>
          <Field label={t("metaCampaigns.automationRules.minResults")}>
            <input className={inputBase} value={form.minResults} onChange={(e) => setField("minResults", e.target.value)} />
          </Field>
          <Field label={t("metaCampaigns.automationRules.consecutive")}>
            <input className={inputBase} value={form.consecutivePeriods} onChange={(e) => setField("consecutivePeriods", e.target.value)} />
          </Field>
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          <Field label={t("metaCampaigns.automationRules.mode")}>
            <select className={inputBase} value={form.mode} onChange={(e) => setField("mode", e.target.value)}>
              <option value="RECOMMEND">{t("metaCampaigns.automationRules.recommend")}</option>
              <option value="AUTOMATIC">{t("metaCampaigns.automationRules.automatic")}</option>
            </select>
          </Field>
          <Field label={t("metaCampaigns.automationRules.actionValue")}>
            <input className={inputBase} value={form.actionValue} onChange={(e) => setField("actionValue", e.target.value)} />
          </Field>
          <Field label={t("metaCampaigns.automationRules.cooldown")}>
            <input className={inputBase} value={form.cooldownHours} onChange={(e) => setField("cooldownHours", e.target.value)} />
          </Field>
          <Field label={t("metaCampaigns.automationRules.objectIds")}>
            <input className={inputBase} value={form.objectIds} onChange={(e) => setField("objectIds", e.target.value)} />
          </Field>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={btnPrimary} disabled={busy} onClick={() => void onSave()}>
            {t("metaCampaigns.automationRules.save")}
          </button>
          <button
            type="button"
            className={btnSecondary}
            onClick={() => {
              setForm(emptyForm);
              setEditingId(null);
            }}
          >
            {t("metaCampaigns.automationRules.cancel")}
          </button>
        </div>
      </section>

      <section className="space-y-3">
        {rules.length === 0 ? (
          <p className="text-sm font-semibold text-slate-500">{t("metaCampaigns.automationRules.noRules")}</p>
        ) : (
          rules.map((rule) => (
            <article key={rule.id} className={`${cardBase} p-4`} data-testid={`automation-rule-${rule.id}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-black text-slate-900">{rule.name}</h3>
                  <p className="text-xs font-bold text-slate-500">
                    {rule.enabled
                      ? t("metaCampaigns.automationRules.enabled")
                      : t("metaCampaigns.automationRules.disabled")}{" "}
                    · {rule.mode} · {rule.action}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className={btnSecondary} onClick={() => startEdit(rule)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className={btnSecondary}
                    onClick={async () => {
                      setTestResult(await testAutomationRule(businessId, rule.id));
                    }}
                  >
                    {t("metaCampaigns.automationRules.test")}
                  </button>
                  <button
                    type="button"
                    className={btnSecondary}
                    onClick={async () => {
                      setTestResult(await evaluateAutomationRule(businessId, rule.id));
                      await reload();
                    }}
                  >
                    {t("metaCampaigns.automationRules.evaluate")}
                  </button>
                  <button
                    type="button"
                    className={btnSecondary}
                    onClick={async () => {
                      setHistory(await getAutomationRuleHistory(businessId, rule.id));
                    }}
                  >
                    {t("metaCampaigns.automationRules.history")}
                  </button>
                  <button
                    type="button"
                    className={btnSecondary}
                    onClick={async () => {
                      await deleteAutomationRule(businessId, rule.id);
                      await reload();
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="mt-2 text-xs font-semibold text-slate-500">
                {t("metaCampaigns.automationRules.lastEvaluated")}: {rule.lastEvaluatedAt || "—"} ·{" "}
                {t("metaCampaigns.automationRules.lastTriggered")}: {rule.lastTriggeredAt || "—"} ·{" "}
                {t("metaCampaigns.automationRules.executions")}: {rule.executionCount || 0}
              </p>
            </article>
          ))
        )}
      </section>

      {testResult ? (
        <pre className={`${cardBase} overflow-auto p-3 text-xs`} data-testid="automation-rule-test-result">
          {JSON.stringify(testResult, null, 2)}
        </pre>
      ) : null}
      {history.length ? (
        <pre className={`${cardBase} overflow-auto p-3 text-xs`}>{JSON.stringify(history, null, 2)}</pre>
      ) : null}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="text-xs font-black uppercase text-slate-500">
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}
