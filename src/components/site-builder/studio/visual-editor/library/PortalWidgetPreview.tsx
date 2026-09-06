import React from "react";
import { useTranslation } from "react-i18next";

import { getTextDirection } from "../../../../../i18n/localeUtils";

type PortalPreviewKind =
  | "portal-login"
  | "portal-register"
  | "portal-account"
  | "portal-custom-data"
  | "portal-packages"
  | "portal-orders"
  | "portal-cart"
  | "portal-forgot-password"
  | "portal-reset-password"
  | string;

type Props = {
  kind: PortalPreviewKind;
  accent?: string;
  ink?: string;
  muted?: string;
  line?: string;
  soft?: string;
};

function Field({
  placeholder,
  line,
  ink,
}: {
  placeholder: string;
  line: string;
  ink: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
        borderRadius: 14,
        border: `1px solid ${line}`,
        padding: "14px 16px",
        fontSize: 14,
        fontWeight: 600,
        color: "#94a3b8",
        background: "#fff",
        textAlign: "start",
      }}
    >
      <span style={{ color: ink, opacity: 0.35 }}>{placeholder}</span>
    </div>
  );
}

function PrimaryButton({
  label,
  background,
}: {
  label: string;
  background: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
        borderRadius: 14,
        background,
        color: "#fff",
        padding: "14px 16px",
        fontSize: 14,
        fontWeight: 800,
        textAlign: "center",
        boxShadow: "0 14px 28px -18px rgba(15,23,42,0.55)",
      }}
    >
      {label}
    </div>
  );
}

export default function PortalWidgetPreview({
  kind,
  accent = "#0e7490",
  ink = "#0f172a",
  muted = "#64748b",
  line = "#e2e8f0",
  soft = "#f8fafc",
}: Props) {
  const { t, i18n } = useTranslation();
  const wrap: React.CSSProperties = {
    height: "100%",
    width: "100%",
    boxSizing: "border-box",
    padding: 22,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    direction: getTextDirection(i18n.language),
    fontFamily: "inherit",
    overflow: "hidden",
    background: soft,
  };

  if (kind === "portal-register") {
    return (
      <div style={{ ...wrap, background: "#fff" }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: accent, letterSpacing: "0.04em" }}>
          {t("publicWidgets.portal.area")}
        </div>
        <div style={{ fontSize: 26, fontWeight: 900, color: ink, lineHeight: 1.15 }}>
          {t("publicWidgets.portal.register")}
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: muted, lineHeight: 1.55, marginBottom: 4 }}>
          {t("publicWidgets.portal.registerSubtitle")}
        </div>
        <Field placeholder={t("publicWidgets.common.fullName")} line={line} ink={ink} />
        <Field placeholder={t("publicWidgets.common.email")} line={line} ink={ink} />
        <Field placeholder={t("publicWidgets.portal.phoneOptional")} line={line} ink={ink} />
        <Field placeholder={t("publicWidgets.common.password")} line={line} ink={ink} />
        <PrimaryButton label={t("publicWidgets.portal.createAccount")} background={ink} />
      </div>
    );
  }

  if (kind === "portal-forgot-password" || kind === "portal-reset-password") {
    const isReset = kind === "portal-reset-password";
    return (
      <div style={{ ...wrap, background: "#fff" }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: accent, letterSpacing: "0.04em" }}>
          {t("publicWidgets.portal.area")}
        </div>
        <div style={{ fontSize: 24, fontWeight: 900, color: ink, lineHeight: 1.15 }}>
          {isReset ? t("publicWidgets.portal.newPassword") : t("publicWidgets.portal.forgotPassword")}
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: muted, lineHeight: 1.55 }}>
          {isReset
            ? t("publicWidgets.portal.newPasswordSubtitle")
            : t("publicWidgets.portal.forgotSubtitle")}
        </div>
        <Field
          placeholder={isReset ? t("publicWidgets.portal.newPassword") : t("publicWidgets.common.email")}
          line={line}
          ink={ink}
        />
        {isReset ? <Field placeholder={t("publicWidgets.portal.confirmPassword")} line={line} ink={ink} /> : null}
        <PrimaryButton
          label={isReset ? t("publicWidgets.portal.savePassword") : t("publicWidgets.portal.sendResetLink")}
          background={ink}
        />
      </div>
    );
  }

  if (kind === "portal-account") {
    return (
      <div style={wrap}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              background: ink,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
            }}
          >
            {t("publicWidgets.portal.customer").slice(0, 1)}
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, color: ink }}>{t("publicWidgets.portal.helloName", { name: t("publicWidgets.portal.customer") })}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: muted }}>
              client@example.com
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {[
            [t("publicWidgets.portal.orders"), "3"],
            [t("publicWidgets.portal.courses"), "2"],
            [t("publicWidgets.portal.messages"), "0"],
          ].map(([label, value]) => (
            <div
              key={label}
              style={{
                padding: "12px 8px",
                borderRadius: 14,
                border: `1px solid ${line}`,
                background: "#fff",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 800, color: muted }}>{label}</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: ink }}>{value}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
          {[
            [t("publicWidgets.portal.weight"), "72"],
            [t("publicWidgets.portal.treatments"), "4"],
            [t("publicWidgets.portal.balance"), "250"],
            [t("publicWidgets.portal.sessions"), "8"],
          ].map(([label, value]) => (
            <div
              key={label}
              style={{
                padding: "12px",
                borderRadius: 14,
                border: `1px solid ${line}`,
                background: "#fff",
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 800, color: muted }}>{label}</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: ink }}>{value}</div>
            </div>
          ))}
        </div>
        {[t("publicWidgets.portal.myOrders"), t("publicWidgets.portal.myCart"), t("publicWidgets.portal.accountDetails")].map((label) => (
          <div
            key={label}
            style={{
              padding: "12px 14px",
              borderRadius: 14,
              border: `1px solid ${line}`,
              background: "#fff",
              fontWeight: 800,
              fontSize: 13,
              color: ink,
            }}
          >
            {label}
          </div>
        ))}
      </div>
    );
  }

  if (kind === "portal-custom-data") {
    return (
      <div style={wrap}>
        <div style={{ fontSize: 22, fontWeight: 900, color: ink }}>{t("publicWidgets.portal.myData")}</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: muted, lineHeight: 1.55 }}>
          {t("publicWidgets.portal.myDataSubtitleShort")}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
          {[
            [t("publicWidgets.portal.weight"), "72"],
            [t("publicWidgets.portal.treatments"), "4"],
            [t("publicWidgets.portal.balance"), "₪250"],
            [t("publicWidgets.portal.sessionsDone"), "8"],
          ].map(([label, value]) => (
            <div
              key={label}
              style={{
                padding: "14px 16px",
                borderRadius: 16,
                border: `1px solid ${line}`,
                background: "#fff",
                minHeight: 84,
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 800, color: muted, marginBottom: 8 }}>
                {label}
              </div>
              <div style={{ fontSize: 22, fontWeight: 900, color: ink }}>{value}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (kind === "portal-packages") {
    return (
      <div style={wrap}>
        <div style={{ fontSize: 22, fontWeight: 900, color: ink }}>{t("publicWidgets.portal.choosePackage")}</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: muted, lineHeight: 1.55 }}>
          {t("publicWidgets.portal.packagesSubtitle")}
        </div>
        {[
          [t("publicWidgets.portal.pkgBasic"), "₪290", false],
          [t("publicWidgets.portal.pkgBusiness"), "₪590", true],
          [t("publicWidgets.portal.pkgPremium"), "₪990", false],
        ].map(([name, price, featured]) => (
          <div
            key={String(name)}
            style={{
              padding: 14,
              borderRadius: 16,
              border: featured ? "0" : `1px solid ${line}`,
              background: featured ? ink : "#fff",
              color: featured ? "#f8fafc" : ink,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 800, opacity: 0.7 }}>
              {featured ? t("publicWidgets.portal.mostPopular") : t("publicWidgets.portal.package")}
            </div>
            <div style={{ fontSize: 16, fontWeight: 900 }}>{name}</div>
            <div style={{ fontSize: 24, fontWeight: 900 }}>{price}</div>
            <div
              style={{
                marginTop: 10,
                padding: "10px 12px",
                borderRadius: 12,
                background: featured ? "#fff" : accent,
                color: featured ? ink : "#fff",
                fontWeight: 800,
                fontSize: 13,
                textAlign: "center",
              }}
            >
              {t("publicWidgets.portal.payCheckout")}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (kind === "portal-orders") {
    return (
      <div style={wrap}>
        <div style={{ fontSize: 12, fontWeight: 800, color: muted, letterSpacing: "0.04em" }}>
          {t("publicWidgets.portal.orderHistory")}
        </div>
        <div
          style={{
            borderRadius: 16,
            border: `1px solid ${line}`,
            overflow: "hidden",
            background: "#fff",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr 0.8fr",
              gap: 8,
              padding: "12px 14px",
              background: soft,
              borderBottom: `1px solid ${line}`,
              fontSize: 11,
              fontWeight: 800,
              color: muted,
            }}
          >
            <div>{t("publicWidgets.portal.order")}</div>
            <div>{t("publicWidgets.portal.status")}</div>
            <div>{t("publicWidgets.portal.amount")}</div>
          </div>
          {[
            ["#1042", t("publicWidgets.portal.paid"), "₪249"],
            ["#1038", t("publicWidgets.portal.processing"), "₪128"],
            ["#1021", t("publicWidgets.portal.shipped"), "₪89"],
          ].map(([order, status, total], index, arr) => (
            <div
              key={order}
              style={{
                display: "grid",
                gridTemplateColumns: "1.2fr 1fr 0.8fr",
                gap: 8,
                padding: 14,
                borderBottom: index === arr.length - 1 ? "0" : `1px solid ${line}`,
                fontSize: 13,
                fontWeight: 800,
                color: ink,
                alignItems: "center",
              }}
            >
              <div>{order}</div>
              <div
                style={{
                  width: "fit-content",
                  padding: "4px 10px",
                  borderRadius: 999,
                  background: soft,
                  border: `1px solid ${line}`,
                  fontSize: 11,
                  color: accent,
                }}
              >
                {status}
              </div>
              <div>{total}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (kind === "portal-cart") {
    return (
      <div style={{ ...wrap, background: "#fff" }}>
        {[
          { name: t("publicWidgets.store.sampleProduct"), price: "₪120.00" },
          { name: t("publicWidgets.store.sampleExtra"), price: "₪60.00" },
        ].map((item) => (
          <div
            key={item.name}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              paddingBottom: 12,
              borderBottom: `1px solid ${line}`,
              fontWeight: 700,
              fontSize: 14,
              color: ink,
            }}
          >
            <span>{item.name}</span>
            <span>{item.price}</span>
          </div>
        ))}
        <div style={{ fontWeight: 900, fontSize: 18, color: ink, marginTop: 4 }}>
          {t("publicWidgets.portal.total", { amount: "₪180.00" })}
        </div>
        <PrimaryButton label={t("publicWidgets.store.continueToPay")} background={accent} />
      </div>
    );
  }

  return (
    <div style={{ ...wrap, background: "#fff" }}>
      <div style={{ fontSize: 12, fontWeight: 800, color: accent, letterSpacing: "0.04em" }}>
        {t("publicWidgets.portal.area")}
      </div>
      <div style={{ fontSize: 26, fontWeight: 900, color: ink, lineHeight: 1.15 }}>
        {t("publicWidgets.portal.login")}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: muted, lineHeight: 1.55, marginBottom: 4 }}>
        {t("publicWidgets.portal.loginSubtitle")}
      </div>
      <Field placeholder={t("publicWidgets.common.email")} line={line} ink={ink} />
      <Field placeholder={t("publicWidgets.common.password")} line={line} ink={ink} />
      <PrimaryButton label={t("publicWidgets.portal.login")} background={ink} />
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: accent }}>
          {t("publicWidgets.portal.noAccountRegister")}
        </div>
        <div style={{ fontSize: 13, fontWeight: 800, color: muted }}>
          {t("publicWidgets.portal.forgotPassword")}
        </div>
      </div>
    </div>
  );
}
