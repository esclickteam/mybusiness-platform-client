import React, { useEffect, useMemo, useState } from "react";
import adminCrmApi from "../../../../api/adminCrmApi";
import { AdminModal } from "../AdminModal";
import { CompactInput, PrimaryButton, SecondaryButton } from "../AdminCrmUi";
import { israelWeekday } from "../../AdminBizuplyBookFlow";
import {
  BOTTLENECK_OPTIONS,
  DEMO_FOCUS_OPTIONS,
  IntroQuestionnaire,
  LEAD_SOURCE_OPTIONS,
  MARKETING_ANSWER_OPTIONS,
  MARKETING_CHANNEL_OPTIONS,
  MISSING_NEEDS_OPTIONS,
  TEAM_HANDLER_OPTIONS,
  WEBSITE_IMPROVEMENT_OPTIONS,
  WEBSITE_SATISFACTION_OPTIONS,
  WEBSITE_STATUS_OPTIONS,
  emptyIntroQuestionnaire,
} from "./types";
import {
  hasIntroSummaryData,
  introQuestionnaireFromCallSummary,
  suggestDemoFocus,
} from "./utils";

type Option = { value: string; label: string };

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 text-sm font-black text-slate-900 sm:text-base">{children}</p>;
}

function ShortTextarea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      className="min-h-[96px] w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-900 outline-none focus:border-[#7C4DFF]/40 sm:text-base"
      rows={rows}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function CheckboxGroup({
  options,
  values,
  onChange,
  otherValue,
  onOtherChange,
  otherPlaceholder = "פרטו...",
}: {
  options: readonly Option[];
  values: string[];
  onChange: (next: string[]) => void;
  otherValue?: string;
  onOtherChange?: (value: string) => void;
  otherPlaceholder?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-900 sm:text-base"
          >
            <input
              type="checkbox"
              className="h-4 w-4 accent-[#7C4DFF]"
              checked={values.includes(option.value)}
              onChange={(e) => {
                onChange(
                  e.target.checked
                    ? [...values, option.value]
                    : values.filter((v) => v !== option.value)
                );
              }}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      {values.includes("other") && onOtherChange ? (
        <CompactInput
          placeholder={otherPlaceholder}
          value={otherValue || ""}
          onChange={(e) => onOtherChange(e.target.value)}
        />
      ) : null}
    </div>
  );
}

function RadioGroup({
  name,
  options,
  value,
  onChange,
  otherValue,
  onOtherChange,
  otherPlaceholder = "פרטו...",
}: {
  name: string;
  options: readonly Option[];
  value: string;
  onChange: (next: string) => void;
  otherValue?: string;
  onOtherChange?: (value: string) => void;
  otherPlaceholder?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-900 sm:text-base"
          >
            <input
              type="radio"
              name={name}
              className="h-4 w-4 accent-[#7C4DFF]"
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      {value === "other" && onOtherChange ? (
        <CompactInput
          placeholder={otherPlaceholder}
          value={otherValue || ""}
          onChange={(e) => onOtherChange(e.target.value)}
        />
      ) : null}
    </div>
  );
}

function QuestionSection({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      <h3 className="text-base font-black leading-7 text-slate-950 sm:text-lg">
        {number}. {title}
      </h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function IntroCallSummaryModal({
  open,
  booking,
  onClose,
  onSaved,
  onError,
  completeOnSave = false,
}: {
  open: boolean;
  booking: {
    id: string;
    serviceName?: string;
    startAt: string;
    status: string;
    callSummary?: any;
  };
  onClose: () => void;
  onSaved: (closeAfter?: boolean) => void;
  onError: (message: string) => void;
  completeOnSave?: boolean;
}) {
  const [form, setForm] = useState<IntroQuestionnaire>(emptyIntroQuestionnaire());
  const [saving, setSaving] = useState<"" | "save" | "close">("");

  useEffect(() => {
    if (!open) return;
    const loaded = introQuestionnaireFromCallSummary(booking.callSummary);
    if (!hasIntroSummaryData(loaded) && !loaded.demoFocus.selections.length) {
      const suggested = suggestDemoFocus(loaded);
      if (suggested.length) {
        loaded.demoFocus.selections = suggested;
      }
    }
    setForm(loaded);
  }, [open, booking.callSummary, booking.id]);

  const marketingActive =
    form.marketing.answer === "yes_regular" || form.marketing.answer === "yes_sometimes";
  const websiteYes = form.website.status === "yes";

  const payload = useMemo(
    () => ({
      callSummary: {
        introQuestionnaire: form,
      },
    }),
    [form]
  );

  async function save(closeAfter: boolean) {
    setSaving(closeAfter ? "close" : "save");
    try {
      await adminCrmApi.calendarCallSummary(booking.id, {
        ...payload,
        complete: closeAfter && completeOnSave && booking.status === "booked",
      });
      onSaved(closeAfter);
      if (closeAfter) onClose();
    } catch (err: any) {
      onError(err?.response?.data?.error || "שמירת סיכום השיחה נכשלה");
    } finally {
      setSaving("");
    }
  }

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      eyebrow="יומן BizUply"
      title="סיכום שיחת היכרות"
      subtitle={`${booking.serviceName || "שיחה ראשונית"} · ${israelWeekday(booking.startAt)}`}
      size="xl"
      className="!max-w-4xl"
      footer={
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-bold text-slate-500">אין שדות חובה — ניתן לשמור בכל שלב.</p>
          <div className="flex flex-wrap gap-2">
            <SecondaryButton compact disabled={Boolean(saving)} onClick={onClose}>
              ביטול
            </SecondaryButton>
            <SecondaryButton compact disabled={Boolean(saving)} onClick={() => void save(false)}>
              {saving === "save" ? "שומר..." : "שמור"}
            </SecondaryButton>
            <PrimaryButton compact disabled={Boolean(saving)} onClick={() => void save(true)}>
              {saving === "close" ? "שומר..." : "שמור וסגור"}
            </PrimaryButton>
          </div>
        </div>
      }
    >
      <div className="max-h-[min(68vh,720px)] space-y-4 overflow-y-auto px-1 py-1">
        <QuestionSection number={1} title="מה העסק עושה?">
          <ShortTextarea
            value={form.businessDescription}
            onChange={(businessDescription) => setForm({ ...form, businessDescription })}
            placeholder="לדוגמה: קליניקה לקוסמטיקה, משרד תיווך, חנות אונליין, חברת שירותים..."
          />
        </QuestionSection>

        <QuestionSection number={2} title="מה הכי חסר לכם היום מבחינת מערכת או ניהול העסק?">
          <CheckboxGroup
            options={MISSING_NEEDS_OPTIONS}
            values={form.missingNeeds.selections}
            onChange={(selections) =>
              setForm({ ...form, missingNeeds: { ...form.missingNeeds, selections } })
            }
            otherValue={form.missingNeeds.other}
            onOtherChange={(other) =>
              setForm({ ...form, missingNeeds: { ...form.missingNeeds, other } })
            }
            otherPlaceholder="מה חסר לכם?"
          />
          <div className="mt-3">
            <FieldLabel>הערה נוספת</FieldLabel>
            <ShortTextarea
              rows={2}
              value={form.missingNeeds.note}
              onChange={(note) =>
                setForm({ ...form, missingNeeds: { ...form.missingNeeds, note } })
              }
              placeholder="הערה קצרה (אופציונלי)"
            />
          </div>
        </QuestionSection>

        <QuestionSection
          number={3}
          title="איך אתם מנהלים היום את הלקוחות, הפניות וההתנהלות השוטפת של העסק?"
        >
          <ShortTextarea
            value={form.currentManagement}
            onChange={(currentManagement) => setForm({ ...form, currentManagement })}
            placeholder="לדוגמה: WhatsApp ללידים, Excel למעקב, Monday למשימות ומערכת נפרדת לחשבוניות..."
          />
        </QuestionSection>

        <QuestionSection number={4} title="מה חסר לכם בדרך שבה אתם עובדים היום?">
          <ShortTextarea
            value={form.workingGaps}
            onChange={(workingGaps) => setForm({ ...form, workingGaps })}
            placeholder="לדוגמה: אין מעקב מסודר, שוכחים לחזור ללידים, משתמשים ביותר מדי מערכות..."
          />
        </QuestionSection>

        <QuestionSection number={5} title="האם אתם משווקים את העסק היום?">
          <RadioGroup
            name="marketing-answer"
            options={MARKETING_ANSWER_OPTIONS}
            value={form.marketing.answer}
            onChange={(answer) => setForm({ ...form, marketing: { ...form.marketing, answer } })}
            otherValue={form.marketing.other}
            onOtherChange={(other) =>
              setForm({ ...form, marketing: { ...form.marketing, other } })
            }
          />
          {marketingActive ? (
            <div className="mt-4">
              <FieldLabel>איפה אתם משווקים?</FieldLabel>
              <CheckboxGroup
                options={MARKETING_CHANNEL_OPTIONS}
                values={form.marketing.channels.selections}
                onChange={(selections) =>
                  setForm({
                    ...form,
                    marketing: {
                      ...form.marketing,
                      channels: { ...form.marketing.channels, selections },
                    },
                  })
                }
                otherValue={form.marketing.channels.other}
                onOtherChange={(other) =>
                  setForm({
                    ...form,
                    marketing: {
                      ...form.marketing,
                      channels: { ...form.marketing.channels, other },
                    },
                  })
                }
              />
            </div>
          ) : null}
        </QuestionSection>

        <QuestionSection number={6} title="מאיפה מגיעות רוב הפניות שלכם היום?">
          <CheckboxGroup
            options={LEAD_SOURCE_OPTIONS}
            values={form.leadSources.selections}
            onChange={(selections) =>
              setForm({ ...form, leadSources: { ...form.leadSources, selections } })
            }
            otherValue={form.leadSources.other}
            onOtherChange={(other) =>
              setForm({ ...form, leadSources: { ...form.leadSources, other } })
            }
          />
          <div className="mt-3">
            <FieldLabel>הערה חופשית</FieldLabel>
            <ShortTextarea
              rows={2}
              value={form.leadSources.note}
              onChange={(note) =>
                setForm({ ...form, leadSources: { ...form.leadSources, note } })
              }
              placeholder="לדוגמה: רוב הלידים מגיעים מקמפיינים בפייסבוק אבל הלקוחות האיכותיים מגיעים מהמלצות."
            />
          </div>
        </QuestionSection>

        <QuestionSection number={7} title="מה קורה אצלכם מהרגע שנכנסת פנייה חדשה?">
          <ShortTextarea
            value={form.inquiryFlow}
            onChange={(inquiryFlow) => setForm({ ...form, inquiryFlow })}
            placeholder="לדוגמה: שולחים WhatsApp → מתקשרים → שולחים הצעת מחיר → עושים Follow-up"
          />
        </QuestionSection>

        <QuestionSection number={8} title="איפה היום התהליך הכי נתקע?">
          <CheckboxGroup
            options={BOTTLENECK_OPTIONS}
            values={form.bottlenecks.selections}
            onChange={(selections) =>
              setForm({ ...form, bottlenecks: { ...form.bottlenecks, selections } })
            }
            otherValue={form.bottlenecks.other}
            onOtherChange={(other) =>
              setForm({ ...form, bottlenecks: { ...form.bottlenecks, other } })
            }
          />
          <div className="mt-3">
            <FieldLabel>פירוט נוסף</FieldLabel>
            <ShortTextarea
              rows={2}
              value={form.bottlenecks.detail}
              onChange={(detail) =>
                setForm({ ...form, bottlenecks: { ...form.bottlenecks, detail } })
              }
            />
          </div>
        </QuestionSection>

        <QuestionSection number={9} title="מה הייתם רוצים שיקרה אוטומטית?">
          <ShortTextarea
            value={form.automationWishes}
            onChange={(automationWishes) => setForm({ ...form, automationWishes })}
            placeholder="לדוגמה: הודעה אוטומטית לליד חדש, תזכורת לנציג, Follow-up אחרי יומיים, שינוי סטטוס..."
          />
        </QuestionSection>

        <QuestionSection number={10} title="האם יש לכם אתר היום?">
          <RadioGroup
            name="website-status"
            options={WEBSITE_STATUS_OPTIONS}
            value={form.website.status}
            onChange={(status) => setForm({ ...form, website: { ...form.website, status } })}
            otherValue={form.website.other}
            onOtherChange={(other) => setForm({ ...form, website: { ...form.website, other } })}
          />
          {websiteYes ? (
            <div className="mt-4 space-y-4">
              <div>
                <FieldLabel>האם אתם מרוצים מהאתר הקיים?</FieldLabel>
                <RadioGroup
                  name="website-satisfaction"
                  options={WEBSITE_SATISFACTION_OPTIONS}
                  value={form.website.satisfaction}
                  onChange={(satisfaction) =>
                    setForm({ ...form, website: { ...form.website, satisfaction } })
                  }
                />
              </div>
              <div>
                <FieldLabel>מה הייתם רוצים לשפר באתר?</FieldLabel>
                <CheckboxGroup
                  options={WEBSITE_IMPROVEMENT_OPTIONS}
                  values={form.website.improvements.selections}
                  onChange={(selections) =>
                    setForm({
                      ...form,
                      website: {
                        ...form.website,
                        improvements: { ...form.website.improvements, selections },
                      },
                    })
                  }
                  otherValue={form.website.improvements.other}
                  onOtherChange={(other) =>
                    setForm({
                      ...form,
                      website: {
                        ...form.website,
                        improvements: { ...form.website.improvements, other },
                      },
                    })
                  }
                />
              </div>
              <div>
                <FieldLabel>הערה חופשית על האתר</FieldLabel>
                <ShortTextarea
                  rows={2}
                  value={form.website.note}
                  onChange={(note) => setForm({ ...form, website: { ...form.website, note } })}
                />
              </div>
            </div>
          ) : null}
        </QuestionSection>

        <QuestionSection number={11} title="מי מטפל היום בפניות ובלקוחות?">
          <RadioGroup
            name="team-handler"
            options={TEAM_HANDLER_OPTIONS}
            value={form.team.handler}
            onChange={(handler) => setForm({ ...form, team: { ...form.team, handler } })}
            otherValue={form.team.other}
            onOtherChange={(other) => setForm({ ...form, team: { ...form.team, other } })}
          />
          <div className="mt-3">
            <FieldLabel>כמה אנשים בערך משתמשים או צפויים להשתמש במערכת?</FieldLabel>
            <CompactInput
              type="number"
              min={0}
              placeholder="לדוגמה: 3"
              value={form.team.userCount}
              onChange={(e) =>
                setForm({ ...form, team: { ...form.team, userCount: e.target.value } })
              }
            />
          </div>
        </QuestionSection>

        <QuestionSection number={12} title="מה הכי חשוב לכם לראות בדמו?">
          <p className="mb-2 text-xs font-bold text-slate-500">
            המערכת מציעה אפשרויות לפי התשובות — ניתן לשנות ידנית.
          </p>
          <CheckboxGroup
            options={DEMO_FOCUS_OPTIONS}
            values={form.demoFocus.selections}
            onChange={(selections) =>
              setForm({ ...form, demoFocus: { ...form.demoFocus, selections } })
            }
            otherValue={form.demoFocus.other}
            onOtherChange={(other) =>
              setForm({ ...form, demoFocus: { ...form.demoFocus, other } })
            }
          />
        </QuestionSection>

        <QuestionSection
          number={13}
          title="אם BizUply הייתה פותרת לכם דבר אחד כבר מחר — מה הייתם רוצים שזה יהיה?"
        >
          <ShortTextarea
            rows={2}
            value={form.oneThingTomorrow}
            onChange={(oneThingTomorrow) => setForm({ ...form, oneThingTomorrow })}
          />
        </QuestionSection>

        <section className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 sm:p-5">
          <h3 className="text-base font-black text-amber-950 sm:text-lg">הערות פנימיות</h3>
          <p className="mb-3 text-xs font-bold text-amber-800">
            לשימוש פנימי בלבד — לא מוצג ללקוח.
          </p>
          <ShortTextarea
            rows={3}
            value={form.internalNotes}
            onChange={(internalNotes) => setForm({ ...form, internalNotes })}
            placeholder="לדוגמה: לקוח מאוד מתעניין באוטומציות. צריך להראות לו בעיקר CRM + WhatsApp + Follow-up."
          />
        </section>
      </div>
    </AdminModal>
  );
}
