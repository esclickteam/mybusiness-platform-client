import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { CheckCircle2, Facebook } from "lucide-react";
import CrmProductHero from "../../components/crm-marketing/CrmProductHero";
import CrmTopicSections from "../../components/crm-marketing/CrmTopicSections";
import "../../components/crm-marketing/CrmProductHero.css";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function CrmProductPage() {
  const { t, i18n } = useTranslation();
  const base = "productPages.crm";
  const dir = i18n.dir();
  const metaPoints = [1, 2, 3].map((n) => t(`${base}.metaPoint${n}`));

  return (
    <div className="crm-page" dir={dir}>
      <Helmet>
        <title>{t(`${base}.seoTitle`)}</title>
        <meta name="description" content={t(`${base}.seoDescription`)} />
        <link rel="canonical" href="https://bizuply.com/crm" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={t(`${base}.seoTitle`)} />
        <meta property="og:description" content={t(`${base}.seoDescription`)} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="BizUply" />
        <link rel="preload" as="image" href="/leads1.jpeg" />
      </Helmet>

      <CrmProductHero />
      <CrmTopicSections />

      <div className="crm-page__shell">
        <motion.section
          className="crm-page__section crm-page__meta"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div>
            <p className="crm-page__eyebrow crm-page__eyebrow--meta">
              <Facebook size={14} aria-hidden="true" />
              {t(`${base}.metaSectionBadge`)}
            </p>
            <h2 className="crm-page__heading">{t(`${base}.metaSectionTitle`)}</h2>
            <p className="crm-page__lead">{t(`${base}.metaSectionText`)}</p>
          </div>
          <div className="crm-page__meta-points">
            {metaPoints.map((point, i) => (
              <motion.div
                key={point}
                className="crm-page__meta-point"
                initial={{ opacity: 0, x: 18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] }}
              >
                <CheckCircle2 size={20} />
                <p>{point}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="crm-page__cta"
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <h2>{t(`${base}.ctaTitle`)}</h2>
            <p>{t(`${base}.ctaText`)}</p>
          </div>
          <div className="crm-page__cta-actions">
            <Link to="/register" className="crm-page__cta-btn crm-page__cta-btn--light">
              {t("productPages.ctaPrimary")}
            </Link>
            <Link to="/contact" className="crm-page__cta-btn crm-page__cta-btn--ghost">
              {t("productPages.ctaContact")}
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
