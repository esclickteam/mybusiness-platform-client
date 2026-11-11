import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchBillingOverview } from "../../../api/billingApi";
import { useLocaleDir } from "../../../hooks/useLocaleDir";
import "./Upgrade.css";

const Upgrade = () => {
  const { t } = useTranslation();
  const dir = useLocaleDir();
  const { businessId } = useParams();
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!businessId) {
      setLoading(false);
      setError(t("leftover.upgrade.loadError"));
      return undefined;
    }
    let alive = true;
    fetchBillingOverview(businessId)
      .then((data) => {
        if (alive) setOverview(data);
      })
      .catch(() => {
        if (alive) setError(t("leftover.upgrade.loadError"));
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [businessId, t]);

  const plan = overview?.primaryPlan;
  const summary = overview?.summary;
  const cycle =
    plan?.sku === "monthly"
      ? t("leftover.upgrade.monthly")
      : plan?.sku === "yearly"
        ? t("leftover.upgrade.yearly")
        : plan?.sku;
  const statusLabel =
    plan?.status === "active" ? t("leftover.upgrade.statusActive") : plan?.status || "—";
  const nextAmount = summary?.nextChargeAmount;
  const currency = summary?.nextChargeCurrency || summary?.currency || "";

  return (
    <section className="upgrade-page" dir={dir}>
      <header className="upgrade-head">
        <h1>{t("leftover.upgrade.title")}</h1>
        <p>{t("leftover.upgrade.hint")}</p>
      </header>

      <article className="upgrade-card">
        <h2>{t("leftover.upgrade.current")}</h2>
        {loading && <p>{t("leftover.upgrade.loading")}</p>}
        {error && <p>{error}</p>}
        {!loading && !error && !plan && <p>{t("leftover.upgrade.noPlan")}</p>}
        {plan && (
          <dl className="upgrade-facts">
            <div>
              <dt>{plan.name}</dt>
              <dd>{cycle}</dd>
            </div>
            <div>
              <dt>{t("leftover.upgrade.status")}</dt>
              <dd>{statusLabel}</dd>
            </div>
            {nextAmount != null && (
              <div>
                <dt>{t("leftover.upgrade.nextCharge")}</dt>
                <dd>
                  {nextAmount} {currency}
                </dd>
              </div>
            )}
          </dl>
        )}
        <div className="upgrade-actions">
          <Link to="../billing">{t("leftover.upgrade.openBilling")}</Link>
          <Link to="/pricing">{t("leftover.upgrade.openPricing")}</Link>
        </div>
      </article>
    </section>
  );
};

export default Upgrade;
