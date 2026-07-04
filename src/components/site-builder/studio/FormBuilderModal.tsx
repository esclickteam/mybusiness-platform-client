import React from "react";

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
  placeholder?: string;
  required?: boolean;
  options?: string[];
  width?: "half" | "full";
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
  onAddField?: (type?: BizuplyFormFieldType) => void;
  onUpdateField: (fieldId: string, patch: Partial<BizuplyFormField>) => void;
  onDeleteField: (fieldId: string) => void;
  onMoveField: (fieldId: string, direction: "up" | "down") => void;
};

type DragPayload =
  | { kind: "field"; fieldId: string }
  | { kind: "new-field"; fieldType: BizuplyFormFieldType };

const FIELD_TYPES: Array<{
  type: BizuplyFormFieldType;
  title: string;
  subtitle: string;
  icon: string;
}> = [
  { type: "text", title: "טקסט קצר", subtitle: "שם / עיר / תפקיד", icon: "T" },
  { type: "email", title: "אימייל", subtitle: "כתובת מייל", icon: "@" },
  { type: "phone", title: "טלפון", subtitle: "מספר נייד", icon: "☎" },
  { type: "textarea", title: "טקסט ארוך", subtitle: "הודעה / פירוט", icon: "≡" },
  { type: "number", title: "מספר", subtitle: "כמות / תקציב", icon: "#" },
  { type: "date", title: "תאריך", subtitle: "בחירת תאריך", icon: "◷" },
  { type: "select", title: "בחירה", subtitle: "רשימת אפשרויות", icon: "⌄" },
  { type: "checkbox", title: "צ׳קבוקס", subtitle: "אישור / הסכמה", icon: "✓" },
  { type: "file", title: "קובץ", subtitle: "העלאת מסמך", icon: "⇧" },
];

function normalizeFieldType(value: unknown): BizuplyFormFieldType {
  const clean = String(value || "").toLowerCase();

  if (
    clean === "text" ||
    clean === "email" ||
    clean === "phone" ||
    clean === "textarea" ||
    clean === "number" ||
    clean === "date" ||
    clean === "select" ||
    clean === "checkbox" ||
    clean === "file"
  ) {
    return clean;
  }

  return "text";
}

function normalizeFieldWidth(field: Partial<BizuplyFormField>): "half" | "full" {
  if (field.width === "full" || field.width === "half") return field.width;

  const type = normalizeFieldType(field.type);

  if (
    type === "textarea" ||
    type === "select" ||
    type === "checkbox" ||
    type === "file"
  ) {
    return "full";
  }

  return "half";
}

function normalizeForm(form: BizuplyFormConfig): BizuplyFormConfig {
  return {
    id: String(form?.id || "contact-form"),
    title: String(form?.title || "טופס יצירת קשר"),
    submitText: String(form?.submitText || "שליחת הודעה"),
    successMessage: String(form?.successMessage || "ההודעה נשלחה בהצלחה"),
    fields: Array.isArray(form?.fields)
      ? form.fields.map((field, index) => ({
          id: String(field?.id || `field-${index + 1}`),
          label: String(field?.label || `שדה ${index + 1}`),
          type: normalizeFieldType(field?.type),
          placeholder: String(field?.placeholder || ""),
          required: Boolean(field?.required),
          options: Array.isArray(field?.options)
            ? field.options.map((option) => String(option)).filter(Boolean)
            : [],
          width: normalizeFieldWidth(field),
        }))
      : [],
  };
}

function slugify(value: string) {
  return (
    String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9א-ת_-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "field"
  );
}

function createField(type: BizuplyFormFieldType): BizuplyFormField {
  const now = Date.now();
  const random = Math.floor(Math.random() * 1000);
  const id = `${type}-${now}-${random}`;

  if (type === "email") {
    return {
      id,
      label: "כתובת אימייל",
      type,
      placeholder: "כתובת אימייל",
      required: false,
      width: "half",
      options: [],
    };
  }

  if (type === "phone") {
    return {
      id,
      label: "טלפון",
      type,
      placeholder: "טלפון",
      required: false,
      width: "half",
      options: [],
    };
  }

  if (type === "textarea") {
    return {
      id,
      label: "הודעה",
      type,
      placeholder: "כתבו כאן...",
      required: false,
      width: "full",
      options: [],
    };
  }

  if (type === "number") {
    return {
      id,
      label: "מספר",
      type,
      placeholder: "הזינו מספר",
      required: false,
      width: "half",
      options: [],
    };
  }

  if (type === "date") {
    return {
      id,
      label: "תאריך",
      type,
      placeholder: "",
      required: false,
      width: "half",
      options: [],
    };
  }

  if (type === "select") {
    return {
      id,
      label: "בחירה",
      type,
      placeholder: "",
      required: false,
      width: "full",
      options: ["אפשרות 1", "אפשרות 2", "אפשרות 3"],
    };
  }

  if (type === "checkbox") {
    return {
      id,
      label: "אני מאשר/ת",
      type,
      placeholder: "",
      required: false,
      width: "full",
      options: [],
    };
  }

  if (type === "file") {
    return {
      id,
      label: "העלאת קובץ",
      type,
      placeholder: "",
      required: false,
      width: "full",
      options: [],
    };
  }

  return {
    id,
    label: "שדה חדש",
    type: "text",
    placeholder: "הקלידו כאן",
    required: false,
    width: "half",
    options: [],
  };
}

function getFieldTypeLabel(type: BizuplyFormFieldType) {
  return FIELD_TYPES.find((item) => item.type === type)?.title || "טקסט קצר";
}

function parseOptions(value: string) {
  return value
    .split("\n")
    .map((option) => option.trim())
    .filter(Boolean);
}

function reorderFieldsByIds(
  fields: BizuplyFormField[],
  draggedFieldId: string,
  targetFieldId: string,
  side: "before" | "after",
) {
  if (draggedFieldId === targetFieldId) return fields;

  const draggedField = fields.find((field) => field.id === draggedFieldId);
  if (!draggedField) return fields;

  const withoutDragged = fields.filter((field) => field.id !== draggedFieldId);
  const targetIndex = withoutDragged.findIndex((field) => field.id === targetFieldId);

  if (targetIndex < 0) return fields;

  const insertIndex = side === "before" ? targetIndex : targetIndex + 1;

  return [
    ...withoutDragged.slice(0, insertIndex),
    draggedField,
    ...withoutDragged.slice(insertIndex),
  ];
}

function insertFieldBesideTarget(
  fields: BizuplyFormField[],
  newField: BizuplyFormField,
  targetFieldId: string,
  side: "before" | "after",
) {
  const targetIndex = fields.findIndex((field) => field.id === targetFieldId);

  if (targetIndex < 0) return [...fields, newField];

  const insertIndex = side === "before" ? targetIndex : targetIndex + 1;

  return [
    ...fields.slice(0, insertIndex),
    newField,
    ...fields.slice(insertIndex),
  ];
}

function reorderFields(fields: BizuplyFormField[], fromIndex: number, toIndex: number) {
  if (fromIndex === toIndex) return fields;
  if (fromIndex < 0 || fromIndex >= fields.length) return fields;
  if (toIndex < 0 || toIndex > fields.length) return fields;

  const next = [...fields];
  const [moved] = next.splice(fromIndex, 1);
  const fixedToIndex = fromIndex < toIndex ? toIndex - 1 : toIndex;

  next.splice(fixedToIndex, 0, moved);

  return next;
}

function setDragData(event: React.DragEvent, payload: DragPayload) {
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("application/x-bizuply-form", JSON.stringify(payload));
}

function readDragData(event: React.DragEvent): DragPayload | null {
  const raw = event.dataTransfer.getData("application/x-bizuply-form");

  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as DragPayload;

    if (parsed.kind === "field" && parsed.fieldId) return parsed;
    if (parsed.kind === "new-field" && parsed.fieldType) return parsed;
  } catch {
    return null;
  }

  return null;
}

function fieldSpanClass(field: BizuplyFormField) {
  return field.width === "full" ? "md:col-span-2" : "md:col-span-1";
}

function previewInputType(field: BizuplyFormField) {
  if (field.type === "email") return "email";
  if (field.type === "phone") return "tel";
  if (field.type === "number") return "number";
  if (field.type === "date") return "date";
  if (field.type === "file") return "file";
  return "text";
}

function getDropSideFromPointer(
  event: React.DragEvent<HTMLElement>,
  rtl = true,
): "before" | "after" {
  const rect = event.currentTarget.getBoundingClientRect();
  const middle = rect.left + rect.width / 2;
  const pointerOnRightSide = event.clientX > middle;

  if (rtl) {
    return pointerOnRightSide ? "before" : "after";
  }

  return pointerOnRightSide ? "after" : "before";
}

function fieldInputClass(selected: boolean) {
  return [
    "h-24 w-full rounded-[30px] border bg-white px-8 text-right text-2xl font-black outline-none transition placeholder:text-slate-400",
    selected
      ? "border-blue-400 shadow-[0_0_0_5px_rgba(37,99,235,0.13)]"
      : "border-slate-200 hover:border-blue-300 hover:shadow-[0_14px_40px_rgba(15,23,42,0.08)]",
  ].join(" ");
}

function FieldPreviewInput({
  field,
  selected,
}: {
  field: BizuplyFormField;
  selected: boolean;
}) {
  if (field.type === "textarea") {
    return (
      <textarea
        disabled
        value=""
        placeholder={field.placeholder || field.label}
        className={[
          "min-h-[250px] w-full resize-none rounded-[30px] border bg-white px-8 py-7 text-right text-2xl font-black outline-none transition placeholder:text-slate-400",
          selected
            ? "border-blue-400 shadow-[0_0_0_5px_rgba(37,99,235,0.13)]"
            : "border-slate-200 hover:border-blue-300 hover:shadow-[0_14px_40px_rgba(15,23,42,0.08)]",
        ].join(" ")}
      />
    );
  }

  if (field.type === "select") {
    return (
      <select disabled className={fieldInputClass(selected)} value="">
        <option value="" disabled>
          {field.placeholder || field.label}
        </option>
        {(field.options?.length ? field.options : ["אפשרות 1"]).map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "checkbox") {
    return (
      <label
        className={[
          "flex min-h-[96px] items-center justify-between gap-4 rounded-[30px] border bg-white px-8 transition",
          selected
            ? "border-blue-400 shadow-[0_0_0_5px_rgba(37,99,235,0.13)]"
            : "border-slate-200 hover:border-blue-300 hover:shadow-[0_14px_40px_rgba(15,23,42,0.08)]",
        ].join(" ")}
      >
        <span className="text-2xl font-black text-slate-500">{field.label}</span>
        <input type="checkbox" disabled className="h-6 w-6 rounded border-slate-300" />
      </label>
    );
  }

  if (field.type === "file") {
    return (
      <div
        className={[
          "flex h-24 items-center justify-between rounded-[30px] border bg-white px-8 transition",
          selected
            ? "border-blue-400 shadow-[0_0_0_5px_rgba(37,99,235,0.13)]"
            : "border-slate-200 hover:border-blue-300 hover:shadow-[0_14px_40px_rgba(15,23,42,0.08)]",
        ].join(" ")}
      >
        <span className="text-2xl font-black text-slate-400">{field.label}</span>
        <span className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-black text-slate-700">
          העלאה
        </span>
      </div>
    );
  }

  return (
    <input
      disabled
      type={previewInputType(field)}
      value=""
      placeholder={field.placeholder || field.label}
      className={fieldInputClass(selected)}
    />
  );
}

function FieldSideDropOverlay({
  activeSide,
}: {
  activeSide: "before" | "after" | "";
}) {
  if (!activeSide) return null;

  return (
    <div
      className={[
        "pointer-events-none absolute bottom-1 top-1 z-20 w-2 rounded-full bg-blue-600 shadow-[0_0_0_6px_rgba(37,99,235,0.16)]",
        activeSide === "before" ? "right-1" : "left-1",
      ].join(" ")}
    />
  );
}

export default function FormBuilderModal({
  form,
  onClose,
  onUpdateForm,
  onUpdateField,
  onDeleteField,
  onMoveField,
}: FormBuilderModalProps) {
  const safeForm = React.useMemo(() => normalizeForm(form), [form]);
  const [selectedFieldId, setSelectedFieldId] = React.useState("");
  const [dragOverBeside, setDragOverBeside] = React.useState<{
    targetFieldId: string;
    side: "before" | "after";
  } | null>(null);
  const [draggingFieldId, setDraggingFieldId] = React.useState("");

  React.useEffect(() => {
    if (selectedFieldId && safeForm.fields.some((field) => field.id === selectedFieldId)) return;

    setSelectedFieldId(safeForm.fields[0]?.id || "");
  }, [safeForm.fields, selectedFieldId]);

  const selectedField =
    safeForm.fields.find((field) => field.id === selectedFieldId) || null;

  function updateWholeForm(patch: Partial<BizuplyFormConfig>) {
    onUpdateForm({
      ...patch,
      fields: patch.fields
        ? patch.fields.map((field) => ({
            ...field,
            width: normalizeFieldWidth(field),
          }))
        : patch.fields,
    });
  }

  function insertNewField(type: BizuplyFormFieldType, index = safeForm.fields.length) {
    const field = createField(type);
    const nextFields = [...safeForm.fields];

    nextFields.splice(index, 0, field);

    /*
      לא קוראים ל-onAddField כאן.
      אחרת TemplateVisualEditor מוסיף שוב ונוצר כפול.
    */
    updateWholeForm({ fields: nextFields });
    setSelectedFieldId(field.id);
  }

  function insertNewFieldBeside(
    type: BizuplyFormFieldType,
    targetFieldId: string,
    side: "before" | "after",
  ) {
    const field = {
      ...createField(type),
      width: "half" as const,
    };

    const nextFields = insertFieldBesideTarget(safeForm.fields, field, targetFieldId, side).map(
      (item) =>
        item.id === targetFieldId || item.id === field.id
          ? { ...item, width: "half" as const }
          : item,
    );

    updateWholeForm({ fields: nextFields });
    setSelectedFieldId(field.id);
  }

  function handleDropAtIndex(event: React.DragEvent, index: number) {
    event.preventDefault();
    event.stopPropagation();

    const payload = readDragData(event);

    setDragOverBeside(null);
    setDraggingFieldId("");

    if (!payload) return;

    if (payload.kind === "new-field") {
      insertNewField(payload.fieldType, index);
      return;
    }

    const fromIndex = safeForm.fields.findIndex((field) => field.id === payload.fieldId);
    const nextFields = reorderFields(safeForm.fields, fromIndex, index);

    updateWholeForm({ fields: nextFields });
    setSelectedFieldId(payload.fieldId);
  }

  function handleDropBesideField(
    event: React.DragEvent<HTMLElement>,
    targetField: BizuplyFormField,
  ) {
    event.preventDefault();
    event.stopPropagation();

    const payload = readDragData(event);
    const side = getDropSideFromPointer(event, true);

    setDragOverBeside(null);
    setDraggingFieldId("");

    if (!payload) return;

    if (payload.kind === "new-field") {
      insertNewFieldBeside(payload.fieldType, targetField.id, side);
      return;
    }

    if (payload.fieldId === targetField.id) return;

    const nextFields = reorderFieldsByIds(
      safeForm.fields,
      payload.fieldId,
      targetField.id,
      side,
    ).map((field) =>
      field.id === payload.fieldId || field.id === targetField.id
        ? { ...field, width: "half" as const }
        : field,
    );

    updateWholeForm({ fields: nextFields });
    setSelectedFieldId(payload.fieldId);
  }

  function handleDropOnEmpty(event: React.DragEvent) {
    handleDropAtIndex(event, safeForm.fields.length);
  }

  function moveFieldViaButtons(fieldId: string, direction: "up" | "down") {
    onMoveField(fieldId, direction);
    setSelectedFieldId(fieldId);
  }

  function updateSelectedField(patch: Partial<BizuplyFormField>) {
    if (!selectedField) return;

    const nextPatch: Partial<BizuplyFormField> = { ...patch };

    if (patch.type) {
      nextPatch.type = normalizeFieldType(patch.type);

      if (!patch.width) {
        nextPatch.width = normalizeFieldWidth({ ...selectedField, ...patch });
      }
    }

    onUpdateField(selectedField.id, nextPatch);

    if (patch.id && patch.id !== selectedField.id) {
      setSelectedFieldId(patch.id);
    }
  }

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-[999999] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex h-[min(94vh,980px)] w-[min(1720px,100%)] overflow-hidden rounded-[34px] border border-slate-200 bg-white shadow-[0_30px_120px_rgba(15,23,42,0.24)]">
        <aside className="flex w-[390px] shrink-0 flex-col border-l border-slate-200 bg-slate-50/80">
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
            <div>
              <h2 className="text-2xl font-black text-slate-950">עריכת טופס</h2>
              <p className="mt-1 text-xs font-bold text-slate-500">
                העריכה בצד ימין היא 1:1 לפי הטופס
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-2xl font-black leading-none text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            >
              ×
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5">
            <div className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="mb-4 text-lg font-black text-slate-950">הוספת שדות</h3>

              <div className="grid grid-cols-2 gap-3">
                {FIELD_TYPES.map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    draggable
                    onDragStart={(event) =>
                      setDragData(event, {
                        kind: "new-field",
                        fieldType: item.type,
                      })
                    }
                    onClick={() => insertNewField(item.type)}
                    className="group rounded-[20px] border border-slate-200 bg-white p-3 text-right transition hover:border-blue-300 hover:bg-blue-50 hover:shadow-[0_10px_28px_rgba(37,99,235,0.10)]"
                  >
                    <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-lg font-black text-blue-700 transition group-hover:bg-blue-600 group-hover:text-white">
                      {item.icon}
                    </span>
                    <span className="block text-sm font-black text-slate-900">
                      {item.title}
                    </span>
                    <span className="mt-1 block text-xs font-bold text-slate-400">
                      {item.subtitle}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="mb-4 text-lg font-black text-slate-950">
                הגדרות כלליות
              </h3>

              <div className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-xs font-black text-slate-600">
                    כותרת הטופס
                  </span>
                  <input
                    value={safeForm.title}
                    onChange={(event) => updateWholeForm({ title: event.target.value })}
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-right text-sm font-bold text-slate-800 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-black text-slate-600">
                    טקסט כפתור שליחה
                  </span>
                  <input
                    value={safeForm.submitText}
                    onChange={(event) =>
                      updateWholeForm({ submitText: event.target.value })
                    }
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-right text-sm font-bold text-slate-800 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-black text-slate-600">
                    הודעת הצלחה
                  </span>
                  <input
                    value={safeForm.successMessage}
                    onChange={(event) =>
                      updateWholeForm({ successMessage: event.target.value })
                    }
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-right text-sm font-bold text-slate-800 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                  />
                </label>
              </div>
            </div>

            <div className="mt-5 rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black text-slate-950">עריכת שדה</h3>
                  <p className="mt-1 text-xs font-bold text-slate-500">
                    לחצי על שדה בתצוגת הטופס
                  </p>
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                  {safeForm.fields.length} שדות
                </span>
              </div>

              {selectedField ? (
                <div className="space-y-4">
                  <div className="rounded-2xl bg-blue-50 px-4 py-3 text-sm font-black text-blue-700">
                    {selectedField.label} · {getFieldTypeLabel(selectedField.type)}
                  </div>

                  <label className="block">
                    <span className="mb-2 block text-xs font-black text-slate-600">
                      שם שדה
                    </span>
                    <input
                      value={selectedField.label}
                      onChange={(event) =>
                        updateSelectedField({ label: event.target.value })
                      }
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-right text-sm font-bold text-slate-800 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-black text-slate-600">
                      Placeholder
                    </span>
                    <input
                      value={selectedField.placeholder || ""}
                      onChange={(event) =>
                        updateSelectedField({ placeholder: event.target.value })
                      }
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-right text-sm font-bold text-slate-800 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                    />
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                      <span className="mb-2 block text-xs font-black text-slate-600">
                        סוג
                      </span>
                      <select
                        value={selectedField.type}
                        onChange={(event) =>
                          updateSelectedField({
                            type: normalizeFieldType(event.target.value),
                          })
                        }
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-right text-sm font-black text-slate-800 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                      >
                        {FIELD_TYPES.map((item) => (
                          <option key={item.type} value={item.type}>
                            {item.title}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-xs font-black text-slate-600">
                        רוחב
                      </span>
                      <select
                        value={selectedField.width || "half"}
                        onChange={(event) =>
                          updateSelectedField({
                            width: event.target.value === "full" ? "full" : "half",
                          })
                        }
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-right text-sm font-black text-slate-800 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                      >
                        <option value="half">חצי שורה</option>
                        <option value="full">שורה מלאה</option>
                      </select>
                    </label>
                  </div>

                  <label className="block">
                    <span className="mb-2 block text-xs font-black text-slate-600">
                      מזהה שדה
                    </span>
                    <input
                      dir="ltr"
                      value={selectedField.id}
                      onChange={(event) =>
                        updateSelectedField({ id: slugify(event.target.value) })
                      }
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-left text-sm font-bold text-slate-800 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                    />
                  </label>

                  {selectedField.type === "select" ? (
                    <label className="block">
                      <span className="mb-2 block text-xs font-black text-slate-600">
                        אפשרויות, כל אפשרות בשורה
                      </span>
                      <textarea
                        value={(selectedField.options || []).join("\n")}
                        onChange={(event) =>
                          updateSelectedField({ options: parseOptions(event.target.value) })
                        }
                        className="min-h-[130px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-right text-sm font-bold text-slate-800 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                      />
                    </label>
                  ) : null}

                  <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <span className="text-sm font-black text-slate-700">שדה חובה</span>
                    <input
                      type="checkbox"
                      checked={Boolean(selectedField.required)}
                      onChange={(event) =>
                        updateSelectedField({ required: event.target.checked })
                      }
                      className="h-5 w-5 rounded border-slate-300"
                    />
                  </label>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => moveFieldViaButtons(selectedField.id, "up")}
                      className="h-11 rounded-2xl border border-slate-200 bg-white text-sm font-black text-slate-700 transition hover:bg-slate-50"
                    >
                      למעלה
                    </button>

                    <button
                      type="button"
                      onClick={() => moveFieldViaButtons(selectedField.id, "down")}
                      className="h-11 rounded-2xl border border-slate-200 bg-white text-sm font-black text-slate-700 transition hover:bg-slate-50"
                    >
                      למטה
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteField(selectedField.id)}
                      className="h-11 rounded-2xl border border-rose-200 bg-rose-50 text-sm font-black text-rose-600 transition hover:bg-rose-100"
                    >
                      מחק
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm font-bold text-slate-500">
                  אין שדה נבחר
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-white px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              className="h-14 rounded-[20px] border border-slate-200 bg-white px-6 text-sm font-black text-slate-700 transition hover:bg-slate-50"
            >
              סגור
            </button>

            <button
              type="button"
              onClick={onClose}
              className="h-14 rounded-[20px] bg-blue-600 px-8 text-sm font-black text-white shadow-[0_18px_45px_rgba(37,99,235,0.24)] transition hover:bg-blue-700"
            >
              סיום עריכה
            </button>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col bg-[#edf2f7]">
          <div className="border-b border-slate-200 bg-white px-8 py-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-black text-slate-950">תצוגת הטופס 1:1</h3>
                <p className="mt-1 text-sm font-bold text-slate-500">
                  בלי כרטיסים. השדות נראים וממוקמים כמו בטופס עצמו.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm ring-1 ring-slate-200">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                <span className="text-sm font-black text-slate-700">Drag & Drop פעיל</span>
              </div>
            </div>
          </div>

          <div
            className="flex-1 overflow-y-auto p-8"
            onDragOver={(event) => {
              event.preventDefault();
              event.dataTransfer.dropEffect = "move";
            }}
            onDrop={handleDropOnEmpty}
          >
            <div className="mx-auto w-full max-w-[1280px] rounded-[46px] border border-slate-200 bg-white p-12 shadow-[0_24px_70px_rgba(15,23,42,0.10)]">
              <div className="mb-10 grid gap-8 md:grid-cols-3">
                <input
                  value={safeForm.successMessage}
                  onChange={(event) =>
                    updateWholeForm({ successMessage: event.target.value })
                  }
                  className="h-24 rounded-[30px] border border-slate-200 bg-white px-8 text-center text-xl font-black text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                />

                <input
                  value={safeForm.submitText}
                  onChange={(event) => updateWholeForm({ submitText: event.target.value })}
                  className="h-24 rounded-[30px] border border-slate-200 bg-white px-8 text-center text-xl font-black text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                />

                <input
                  value={safeForm.title}
                  onChange={(event) => updateWholeForm({ title: event.target.value })}
                  className="h-24 rounded-[30px] border border-slate-200 bg-white px-8 text-center text-xl font-black text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div
                className="grid gap-x-8 gap-y-9 md:grid-cols-2"
                onDrop={(event) => event.stopPropagation()}
              >
                {safeForm.fields.length === 0 ? (
                  <div
                    className="md:col-span-2 rounded-[30px] border-2 border-dashed border-blue-200 bg-blue-50/60 px-6 py-16 text-center"
                    onDragOver={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setDragOverBeside(null);
                    }}
                    onDrop={(event) => handleDropAtIndex(event, 0)}
                  >
                    <p className="text-xl font-black text-blue-800">
                      גררי לכאן שדה מהצד השמאלי
                    </p>
                    <p className="mt-2 text-sm font-bold text-blue-500">
                      או לחצי על סוג שדה כדי להוסיף אותו
                    </p>
                  </div>
                ) : null}

                {safeForm.fields.map((field) => {
                  const selected = selectedFieldId === field.id;
                  const dragging = draggingFieldId === field.id;
                  const sideActive =
                    dragOverBeside?.targetFieldId === field.id
                      ? dragOverBeside.side
                      : "";

                  return (
                    <div
                      key={field.id}
                      className={fieldSpanClass(field)}
                      onDragOver={(event) => {
                        event.preventDefault();
                        event.stopPropagation();

                        const payload = readDragData(event);

                        if (!payload) return;
                        if (payload.kind === "field" && payload.fieldId === field.id) return;

                        setDragOverBeside({
                          targetFieldId: field.id,
                          side: getDropSideFromPointer(event, true),
                        });
                      }}
                      onDrop={(event) => handleDropBesideField(event, field)}
                    >
                      <button
                        type="button"
                        draggable
                        onDragStart={(event) => {
                          setDraggingFieldId(field.id);
                          setDragData(event, {
                            kind: "field",
                            fieldId: field.id,
                          });
                        }}
                        onDragEnd={() => {
                          setDraggingFieldId("");
                          setDragOverBeside(null);
                        }}
                        onClick={() => setSelectedFieldId(field.id)}
                        className={[
                          "relative block w-full cursor-grab rounded-[32px] text-right transition active:cursor-grabbing",
                          dragging ? "opacity-40" : "opacity-100",
                        ].join(" ")}
                        title="גרירה לשינוי מיקום"
                      >
                        <FieldSideDropOverlay activeSide={sideActive} />
                        <FieldPreviewInput field={field} selected={selected} />
                      </button>
                    </div>
                  );
                })}

                {safeForm.fields.length > 0 ? (
                  <div
                    className="md:col-span-2 rounded-[24px] border border-dashed border-slate-200 bg-slate-50/70 px-5 py-5 text-center text-sm font-black text-slate-400"
                    onDragOver={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setDragOverBeside(null);
                    }}
                    onDrop={(event) =>
                      handleDropAtIndex(event, safeForm.fields.length)
                    }
                  >
                    גררי לכאן כדי להעביר לסוף הטופס
                  </div>
                ) : null}
              </div>

              <button
                type="button"
                disabled
                className="mt-12 h-24 w-full rounded-[30px] bg-blue-600 px-6 text-center text-2xl font-black text-white shadow-[0_18px_45px_rgba(37,99,235,0.24)]"
              >
                {safeForm.submitText || "שליחת הודעה"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
