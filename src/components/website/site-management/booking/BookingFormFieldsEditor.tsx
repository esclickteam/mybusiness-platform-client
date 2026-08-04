import React, { useCallback, useEffect, useState } from "react";
import {
  CalendarDays,
  Check,
  ChevronDown,
  Hash,
  Mail,
  MessageSquareText,
  Phone,
  Plus,
  Trash2,
  Type,
} from "lucide-react";

import {
  getBookingFormFields,
  saveBookingFormFields,
  type BookingFormField,
  type BookingFormFieldType,
} from "../../../../api/bookingFormFieldsApi";
import { btnPrimary, btnSecondary, inputBase } from "../siteManagementUi";

const FIELD_TYPES: Array<{
  type: BookingFormFieldType;
  label: string;
  hint: string;
  icon: React.ReactNode;
}> = [
  { type: "text", label: "טקסט קצר", hint: "שם, עיר או תפקיד", icon: <Type size={16} /> },
  { type: "email", label: "אימייל", hint: "כתובת אימייל", icon: <Mail size={16} /> },
  { type: "phone", label: "טלפון", hint: "מספר ליצירת קשר", icon: <Phone size={16} /> },
  {
    type: "textarea",
    label: "טקסט ארוך",
    hint: "הודעה או פירוט",
    icon: <MessageSquareText size={16} />,
  },
  { type: "number", label: "מספר", hint: "כמות או תקציב", icon: <Hash size={16} /> },
  {
    type: "date",
    label: "תאריך",
    hint: "בחירת תאריך",
    icon: <CalendarDays size={16} />,
  },
  {
    type: "select",
    label: "בחירה",
    hint: "רשימת אפשרויות",
    icon: <ChevronDown size={16} />,
  },
  {
    type: "checkbox",
    label: "צ'קבוקס",
    hint: "אישור או הסכמה",
    icon: <Check size={16} />,
  },
];

function newFieldId() {
  return `field_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

function createField(type: BookingFormFieldType): BookingFormField {
  const meta = FIELD_TYPES.find((item) => item.type === type);
  return {
    id: newFieldId(),
    type,
    label: meta?.label || "שדה חדש",
    placeholder: "",
    required: false,
    width: "full",
    ...(type === "select" ? { options: ["אפשרות 1", "אפשרות 2"] } : {}),
  };
}

type BookingFormFieldsEditorProps = {
  businessId: string;
};

export default function BookingFormFieldsEditor({
  businessId,
}: BookingFormFieldsEditorProps) {
  const [fields, setFields] = useState<BookingFormField[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  const load = useCallback(async () => {
    if (!businessId) return;
    setLoading(true);
    setMessage(null);
    try {
      const next = await getBookingFormFields(businessId);
      setFields(next);
    } catch (err: any) {
      setMessage({
        type: "error",
        text:
          err?.response?.data?.message ||
          err?.message ||
          "שגיאה בטעינת שדות הטופס",
      });
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    load();
  }, [load]);

  function updateField(id: string, patch: Partial<BookingFormField>) {
    setFields((current) =>
      current.map((field) => (field.id === id ? { ...field, ...patch } : field))
    );
  }

  function removeField(id: string) {
    setFields((current) => current.filter((field) => field.id !== id));
  }

  async function handleSave() {
    if (!businessId) return;
    setSaving(true);
    setMessage(null);
    try {
      const saved = await saveBookingFormFields(businessId, fields);
      setFields(saved);
      setMessage({
        type: "success",
        text: "שדות הטופס נשמרו — יופיעו בווידג'ט התורים ובמיילים",
      });
    } catch (err: any) {
      setMessage({
        type: "error",
        text:
          err?.response?.data?.message ||
          err?.message ||
          "שגיאה בשמירת השדות",
      });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-slate-500">טוען שדות טופס...</p>;
  }

  return (
    <div dir="rtl" className="space-y-4 text-right">
      <div>
        <h3 className="text-base font-bold text-slate-900">שדות נוספים בטופס התור</h3>
        <p className="mt-1 text-sm text-slate-500">
          שם מלא וטלפון תמיד מופיעים. כאן מוסיפים שדות כמו אימייל, הודעה, בחירה
          ועוד — והם יישמרו בתור ויישלחו במייל ללקוח ולבעל העסק.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {FIELD_TYPES.map((item) => (
          <button
            key={item.type}
            type="button"
            onClick={() => setFields((current) => [...current, createField(item.type)])}
            className="flex flex-col items-start gap-1 rounded-xl border border-slate-200 bg-white p-3 text-right hover:border-sky-300 hover:bg-sky-50"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-violet-50 text-violet-700">
              {item.icon}
            </span>
            <span className="text-sm font-bold text-slate-800">{item.label}</span>
            <span className="text-[11px] text-slate-500">{item.hint}</span>
          </button>
        ))}
      </div>

      {fields.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
          עדיין אין שדות נוספים. לחצו על סוג שדה למעלה כדי להוסיף.
        </div>
      ) : (
        <div className="space-y-3">
          {fields.map((field) => (
            <div
              key={field.id}
              className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
            >
              <div className="flex flex-wrap items-start gap-2">
                <div className="min-w-[160px] flex-1">
                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    תווית
                  </label>
                  <input
                    className={`${inputBase} text-right`}
                    value={field.label}
                    onChange={(e) => updateField(field.id, { label: e.target.value })}
                  />
                </div>
                <div className="min-w-[140px]">
                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    סוג
                  </label>
                  <select
                    className={`${inputBase} text-right`}
                    value={field.type}
                    onChange={(e) =>
                      updateField(field.id, {
                        type: e.target.value as BookingFormFieldType,
                        options:
                          e.target.value === "select"
                            ? field.options?.length
                              ? field.options
                              : ["אפשרות 1", "אפשרות 2"]
                            : undefined,
                      })
                    }
                  >
                    {FIELD_TYPES.map((item) => (
                      <option key={item.type} value={item.type}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => removeField(field.id)}
                  className="mt-6 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"
                  title="מחיקת שדה"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {field.type !== "checkbox" ? (
                <div className="mt-2">
                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    Placeholder
                  </label>
                  <input
                    className={`${inputBase} text-right`}
                    value={field.placeholder || ""}
                    onChange={(e) =>
                      updateField(field.id, { placeholder: e.target.value })
                    }
                  />
                </div>
              ) : null}

              {field.type === "select" ? (
                <div className="mt-2">
                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    אפשרויות (מופרדות בפסיק)
                  </label>
                  <input
                    className={`${inputBase} text-right`}
                    value={(field.options || []).join(", ")}
                    onChange={(e) =>
                      updateField(field.id, {
                        options: e.target.value
                          .split(",")
                          .map((part) => part.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                </div>
              ) : null}

              <label className="mt-3 inline-flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={Boolean(field.required)}
                  onChange={(e) =>
                    updateField(field.id, { required: e.target.checked })
                  }
                />
                שדה חובה
              </label>
            </div>
          ))}
        </div>
      )}

      {message ? (
        <p
          className={
            message.type === "success"
              ? "text-sm font-semibold text-emerald-700"
              : "text-sm font-semibold text-rose-600"
          }
        >
          {message.text}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={btnPrimary}
          disabled={saving}
          onClick={handleSave}
        >
          {saving ? "שומר..." : "שמירת שדות"}
        </button>
        <button type="button" className={btnSecondary} onClick={load} disabled={saving}>
          רענון
        </button>
        <button
          type="button"
          className={btnSecondary}
          onClick={() => setFields((current) => [...current, createField("text")])}
        >
          <Plus size={15} />
          שדה טקסט
        </button>
      </div>
    </div>
  );
}
