import React, { useCallback, useEffect, useState } from "react";
import { gpGet } from "./globalPartnersApi";
import { statusLabel, trackLabel } from "./copy";

type Props = {
  busy: boolean;
  setBusy: (v: boolean) => void;
  onError: (msg: string) => void;
  onOpenProfile: (id: string) => void;
};

export default function ActivePartnersPanel({
  busy,
  setBusy,
  onError,
  onOpenProfile,
}: Props) {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    setBusy(true);
    try {
      const data = await gpGet("/candidates", { workArea: "active", limit: 200 });
      setItems(data.items || []);
      setTotal(data.total || 0);
    } catch (e: any) {
      onError(e?.message || "טעינת שותפים פעילים נכשלה");
    } finally {
      setBusy(false);
    }
  }, [onError, setBusy]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="gp-panel">
      <div className="gp-panel-head">
        <h2>שותפים פעילים ({total})</h2>
        <button type="button" className="gp-btn gp-btn--ghost" disabled={busy} onClick={() => void load()}>
          רענון
        </button>
      </div>
      <p className="gp-muted">
        שותף פעיל הוא מי שהצטרף בפועל. אין כאן עסקאות, הכנסות או עמלות מומצאות — רק מה שמאומת
        במערכת.
      </p>
      <div className="gp-table-wrap">
        <table className="gp-table">
          <thead>
            <tr>
              <th>חברה</th>
              <th>מסלול רישיון</th>
              <th>מועד הצטרפות</th>
              <th>סטטוס הסכם</th>
              <th>סטטוס תשלום</th>
              <th>לקוחות / עסקאות / עמלות</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={7}>אין שותפים פעילים עדיין.</td>
              </tr>
            ) : (
              items.map((c) => (
                <tr key={c._id}>
                  <td>
                    {c.companyName}
                    <div className="gp-muted">{c.countryCode || "—"}</div>
                  </td>
                  <td>
                    {c.licenseTrack
                      ? trackLabel(c.licenseTrack)
                      : c.partnerTracks?.[0]
                        ? trackLabel(c.partnerTracks[0])
                        : "—"}
                  </td>
                  <td>
                    {c.activatedAt
                      ? new Date(c.activatedAt).toLocaleDateString("he-IL")
                      : "—"}
                  </td>
                  <td>{c.agreementStatus || "לא הוגדר"}</td>
                  <td>{c.paymentStatus || "לא הוגדר"}</td>
                  <td className="gp-muted">אין נתונים מאומתים</td>
                  <td>
                    <button
                      type="button"
                      className="gp-btn gp-btn--ghost"
                      onClick={() => onOpenProfile(c._id)}
                    >
                      פרופיל
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="gp-muted" style={{ marginTop: 8 }}>
        סטטוס גיוס: {statusLabel("active_partner")} · קישור לרשומת Partner במערכת יתווסף רק לאחר
        חיבור מאומת — השדה linkedPartnerId קיים אך אינו ממולא אוטומטית.
      </p>
    </div>
  );
}
