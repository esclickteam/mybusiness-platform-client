import React from "react";
import { useTranslation } from "react-i18next";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

import type { SchemaValidationResult } from "./schemaValidation";

export default function SchemaValidationStatus({
  result,
  compact = false,
}: {
  result: SchemaValidationResult;
  compact?: boolean;
}) {
  const { t } = useTranslation();
  const map = {
    valid: {
      className: "bg-emerald-50 text-emerald-600",
      icon: <CheckCircle2 className="h-3.5 w-3.5" />,
      label: t("leftover.schema.valid"),
    },
    warn: {
      className: "bg-amber-50 text-amber-600",
      icon: <AlertTriangle className="h-3.5 w-3.5" />,
      label: t("leftover.schema.missingRecommended"),
    },
    error: {
      className: "bg-rose-50 text-rose-600",
      icon: <XCircle className="h-3.5 w-3.5" />,
      label: t("leftover.schema.needsFix"),
    },
  } as const;

  const tone = map[result.level];

  return (
    <span
      className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-black ${tone.className}`}
      title={result.summary}
    >
      {tone.icon}
      {compact ? tone.label : result.summary || tone.label}
    </span>
  );
}
