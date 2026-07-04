import React from "react";
import { ChevronDown, Plus, Trash2, X } from "lucide-react";

export type BizuplyFormFieldType =
  | "text"
  | "email"
  | "phone"
  | "textarea"
  | "number"
  | "date"
  | "select"
  | "checkbox"
  | "file";

export type BizuplyFormField = {
  id: string;
  label: string;
  type: BizuplyFormFieldType;
  placeholder: string;
  required: boolean;
  options?: string[];
};

export type BizuplyFormConfig = {
  id: string;
  title: string;
  submitText: string;
  successMessage: string;
  fields: BizuplyFormField[];
};

type FormBuilderModalProps = {
  form: BizuplyFormConfig;
  onClose: () => void;
  onUpdateForm: (patch: Partial<BizuplyFormConfig>) => void;
  onAddField: () => void;
  onUpdateField: (
    fieldId: string,
    patch: Partial<BizuplyFormField>,
  ) => void;
  onDeleteField: (fieldId: string) => void;
};

const fieldTypeOptions: Array<{ value: BizuplyFormFieldType; label: string }> = [
  { value: "text", label: "טקסט קצר" },
  { value: "email", label: "אימייל" },
  { value: "phone", label: "טלפון" },
  { value: "textarea", label: "טקסט ארוך" },
  { value: "number", label: "מספר" },
  { value: "date", label: "תאריך" },
  { value: "select", label: "בחירה מרשימה" },
  { value: "checkbox", label: "צ׳קבוקס" },
  { value: "file", label: "קובץ" },
];

function ModalInput({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-black text-slate-500">{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-right text-sm font-black text-slate-950 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}

function FieldTypeSelect({
  value,
  onChange,
}: {
  value: BizuplyFormFieldType;
  onChange: (value: BizuplyFormFieldType) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-black text-slate-500">סוג שדה</span>

      <span className="relative block">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value as BizuplyFormFieldType)}
          className="h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 pl-10 text-right text-sm font-black text-slate-950 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
        >
          {fieldTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </span>
    </label>
  );
}

export default function FormBuilderModal({
  form,
  onClose,
  onUpdateForm,
  onAddField,
  onUpdateField,
  onDeleteField,
}: FormBuilderModalProps) {
  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-[1000000] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-md"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[34px] border border-white/70 bg-white shadow-[0_40px_140px_rgba(15,23,42,0.35)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-4 border-b border-slate-100 bg-white px-6 py-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.26em] text-violet-600">
              FORM BUILDER
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-950">
              עריכת טופס
            </h2>

            <p className="mt-2 text-sm font-bold leading-7 text-slate-500">
              עריכת שדות, חובה/לא חובה, טקסט כפתור והודעת הצלחה. השינויים נשמרים בפרסום למונגו.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-950"
            aria-label="סגירה"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50/70 px-6 py-6">
          <section className="rounded-[28px] border border-violet-100 bg-violet-50 p-6">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-violet-600">
              FORM SETTINGS
            </p>

            <h3 className="mt-3 text-2xl font-black text-slate-950">
              {form.title || "טופס יצירת קשר"}
            </h3>

            <p className="mt-3 text-sm font-bold leading-7 text-slate-500">
              ערכי את ההגדרות הכלליות של הטופס. אחר כך אפשר לערוך כל שדה בנפרד.
            </p>
          </section>

          <section className="mt-6 grid gap-4 md:grid-cols-3">
            <ModalInput
              label="שם הטופס"
              value={form.title || ""}
              placeholder="טופס יצירת קשר"
              onChange={(title) => onUpdateForm({ title })}
            />

            <ModalInput
              label="טקסט כפתור שליחה"
              value={form.submitText || ""}
              placeholder="שליחת הודעה"
              onChange={(submitText) => onUpdateForm({ submitText })}
            />

            <ModalInput
              label="הודעה אחרי שליחה"
              value={form.successMessage || ""}
              placeholder="ההודעה נשלחה בהצלחה"
              onChange={(successMessage) => onUpdateForm({ successMessage })}
            />
          </section>

          <section className="mt-8">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-slate-950">שדות הטופס</h3>
                <p className="mt-1 text-sm font-bold text-slate-400">
                  {form.fields.length} שדות
                </p>
              </div>

              <button
                type="button"
                onClick={onAddField}
                className="inline-flex h-12 items-center gap-2 rounded-2xl bg-blue-600 px-5 text-sm font-black text-white shadow-[0_18px_45px_rgba(37,99,235,0.22)] transition hover:bg-blue-700"
              >
                <Plus className="h-5 w-5" />
                הוסף שדה
              </button>
            </div>

            <div className="grid gap-4">
              {form.fields.map((field, index) => (
                <article
                  key={field.id}
                  className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm"
                >
                  <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
                    <div>
                      <h4 className="text-lg font-black text-slate-950">
                        {field.label || `שדה ${index + 1}`}
                      </h4>
                      <p className="mt-1 text-sm font-black text-slate-400">
                        {field.type} · {field.required ? "חובה" : "רשות"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onDeleteField(field.id)}
                      className="inline-flex h-10 items-center gap-2 rounded-2xl bg-rose-50 px-4 text-sm font-black text-rose-600 transition hover:bg-rose-100"
                    >
                      <Trash2 className="h-4 w-4" />
                      מחק
                    </button>
                  </div>

                  <div className="grid gap-4 p-5 md:grid-cols-2">
                    <ModalInput
                      label="שם שדה"
                      value={field.label || ""}
                      placeholder="שם פרטי"
                      onChange={(label) => onUpdateField(field.id, { label })}
                    />

                    <ModalInput
                      label="Placeholder"
                      value={field.placeholder || ""}
                      placeholder="שם פרטי"
                      onChange={(placeholder) => onUpdateField(field.id, { placeholder })}
                    />

                    <FieldTypeSelect
                      value={field.type || "text"}
                      onChange={(type) => onUpdateField(field.id, { type })}
                    />

                    <label className="mt-7 flex h-12 items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4">
                      <span className="text-sm font-black text-slate-700">שדה חובה</span>

                      <input
                        type="checkbox"
                        checked={Boolean(field.required)}
                        onChange={(event) => onUpdateField(field.id, { required: event.target.checked })}
                        className="h-5 w-5 rounded border-slate-300 text-blue-600"
                      />
                    </label>

                    {field.type === "select" ? (
                      <label className="grid gap-2 md:col-span-2">
                        <span className="text-sm font-black text-slate-500">
                          אפשרויות בחירה, שורה לכל אפשרות
                        </span>

                        <textarea
                          value={(field.options || []).join("\n")}
                          onChange={(event) =>
                            onUpdateField(field.id, {
                              options: event.target.value
                                .split("\n")
                                .map((item) => item.trim())
                                .filter(Boolean),
                            })
                          }
                          className="min-h-[110px] rounded-2xl border border-slate-200 bg-white p-4 text-right text-sm font-black text-slate-950 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                        />
                      </label>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-slate-100 bg-white px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="h-12 rounded-2xl border border-slate-200 bg-white px-6 text-sm font-black text-slate-700 transition hover:bg-slate-50"
          >
            סגור
          </button>

          <button
            type="button"
            onClick={onClose}
            className="h-12 rounded-2xl bg-blue-600 px-8 text-sm font-black text-white shadow-[0_18px_45px_rgba(37,99,235,0.22)] transition hover:bg-blue-700"
          >
            סיום עריכה
          </button>
        </footer>
      </div>
    </div>
  );
}
