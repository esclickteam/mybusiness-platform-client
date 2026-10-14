import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import adminCrmApi from "../../../api/adminCrmApi";
import { FOLLOW_UP_TYPE_LABELS, formatIsraelDate } from "./adminCrmLabels";
import AdminDataTable from "../shell/AdminDataTable";
import { AdminBadge, AdminEllipsis, AdminPhone } from "../shell/adminCells";

type FollowUpRow = {
  adminCustomerId: string;
  contactName?: string;
  companyName?: string;
  phone?: string;
  nextFollowUpAt?: string;
  nextFollowUpNote?: string;
  nextFollowUpType?: string;
  assignedAdminName?: string;
  overdue?: boolean;
};

export default function AdminCrmFollowUps() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [scope, setScope] = useState(searchParams.get("scope") || "today");
  const [items, setItems] = useState<FollowUpRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load(nextScope = scope) {
    setLoading(true);
    setError("");
    try {
      const { data } = await adminCrmApi.followUps({ scope: nextScope });
      setItems(data.items || []);
    } catch (err: any) {
      setError(err?.response?.data?.error || "טעינת המעקבים נכשלה");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(scope);
  }, [scope]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {[
          ["today", "מעקבים להיום"],
          ["overdue", "באיחור"],
          ["upcoming", "קרובים"],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setScope(key)}
            className={scope === key ? "biz-chip is-active" : "biz-chip"}
          >
            {label}
          </button>
        ))}
      </div>
      <AdminDataTable
        tableId="admin-crm-follow-ups"
        rows={items}
        rowKey={(row) => row.adminCustomerId}
        loading={loading}
        error={error}
        onRetry={() => load()}
        emptyTitle="אין מעקבים בתצוגה זו"
        resetKey={scope}
        countLabel={`${items.length} מעקבים`}
        mobileTitle={(row) => row.companyName || row.contactName || "לקוח"}
        mobileMeta={(row) => formatIsraelDate(row.nextFollowUpAt, true)}
        columns={[
          {
            key: "customer",
            header: "לקוח",
            render: (row) => (
              <span className="biz-identity-copy">
                <strong>{row.companyName || row.contactName || "לקוח"}</strong>
                {row.contactName ? <small>{row.contactName}</small> : null}
              </span>
            ),
          },
          {
            key: "phone",
            header: "טלפון",
            render: (row) => (
              <AdminPhone phone={row.phone} name={row.contactName || row.companyName} source="admin-crm" refId={row.adminCustomerId} />
            ),
          },
          {
            key: "when",
            header: "מעקב הבא",
            numeric: true,
            render: (row) => (
              <span className="biz-nowrap">{formatIsraelDate(row.nextFollowUpAt, true)}</span>
            ),
          },
          {
            key: "type",
            header: "סוג",
            render: (row) => (
              <AdminBadge tone={row.overdue ? "danger" : "info"}>
                {FOLLOW_UP_TYPE_LABELS[row.nextFollowUpType || ""] || row.nextFollowUpType || "מעקב"}
              </AdminBadge>
            ),
          },
          {
            key: "note",
            header: "הערה",
            secondary: true,
            render: (row) => <AdminEllipsis>{row.nextFollowUpNote}</AdminEllipsis>,
          },
          {
            key: "owner",
            header: "מטפל",
            secondary: true,
            render: (row) => <AdminEllipsis>{row.assignedAdminName || "לא משויך"}</AdminEllipsis>,
          },
        ]}
        rowActions={(row) => (
          <button
            type="button"
            className="biz-btn biz-btn-secondary biz-btn-row"
            onClick={() => navigate(`/admin/crm/customers/${row.adminCustomerId}?tab=tasks`)}
          >
            לתיק הלקוח
          </button>
        )}
      />
    </div>
  );
}
