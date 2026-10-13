import React, { useEffect, useState } from "react";
import adminCrmApi from "../../../api/adminCrmApi";
import { ACTIVITY_LABELS, formatIsraelDate } from "./adminCrmLabels";
import AdminDataTable from "../shell/AdminDataTable";
import { AdminEllipsis } from "../shell/adminCells";

export default function AdminCrmActivities() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const { data } = await adminCrmApi.globalActivities();
      setItems(data.items || []);
    } catch (err: any) {
      setError(err?.response?.data?.error || "טעינת הפעילויות נכשלה");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <AdminDataTable
      tableId="admin-crm-activities"
      rows={items}
      rowKey={(item) => item._id}
      loading={loading}
      error={error}
      onRetry={load}
      emptyTitle="אין פעילויות עדיין"
      countLabel={`${items.length} פעילויות`}
      mobileTitle={(item) => ACTIVITY_LABELS[item.type] || item.type}
      mobileMeta={(item) => item.description || "—"}
      columns={[
        {
          key: "type",
          header: "סוג",
          render: (item) => <AdminEllipsis>{ACTIVITY_LABELS[item.type] || item.type}</AdminEllipsis>,
        },
        {
          key: "when",
          header: "מועד",
          numeric: true,
          render: (item) => <span className="biz-nowrap">{formatIsraelDate(item.occurredAt, true)}</span>,
        },
        {
          key: "description",
          header: "תיאור",
          render: (item) => <AdminEllipsis>{item.description}</AdminEllipsis>,
        },
      ]}
    />
  );
}
