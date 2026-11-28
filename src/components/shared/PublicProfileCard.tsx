import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronDown, Globe, Mail, Pencil, Phone, Star } from "lucide-react";

import ReviewCard from "@/components/ReviewCard";
import "./publicProfile.css";

export type PublicProfileTab = "Main" | "Gallery" | "Reviews" | "Website" | "FAQs";

type FaqItem = {
  _id?: string;
  question?: string;
  answer?: string;
};

type ReviewItem = {
  _id?: string;
  rating?: number;
  averageScore?: number;
  [key: string]: unknown;
};

type PublicProfileCardProps = {
  businessName?: string;
  description?: string;
  logoUrl?: string;
  coverUrl?: string;
  category?: string;
  city?: string;
  phone?: string;
  email?: string;
  formattedPhone?: string;
  websiteUrl?: string;
  whatsappUrl?: string;
  normalizedWebsiteUrl?: string;
  normalizedWhatsappUrl?: string;
  rating?: number;
  reviewsCount?: number;
  mainImages?: string[];
  gallery?: string[];
  reviews?: ReviewItem[];
  faqs?: FaqItem[];
  tab: PublicProfileTab;
  onTabChange: (tab: PublicProfileTab) => void;
  editHref?: string;
  reviewsAction?: React.ReactNode;
  highlightedReviewId?: string;
};

const TABS: PublicProfileTab[] = ["Main", "Gallery", "Reviews", "Website", "FAQs"];

const TAB_KEYS: Record<PublicProfileTab, string> = {
  Main: "main",
  Gallery: "gallery",
  Reviews: "reviews",
  Website: "website",
  FAQs: "faqs",
};

function WhatsAppMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#25D366"
        d="M20.5 3.5A11 11 0 0 0 2.1 17.2L1 23l6-1.6A11 11 0 0 0 20.5 3.5Zm-8.5 17a9.1 9.1 0 0 1-4.6-1.3l-.3-.2-3.6.9.9-3.5-.2-.3A9.1 9.1 0 1 1 12 20.5Zm5-6.8c-.3-.1-1.6-.8-1.8-.9s-.4-.1-.6.1-.7.9-.8 1-.3.2-.6.1a7.4 7.4 0 0 1-2.2-1.4 8.2 8.2 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.4-.5.2-.3a.5.5 0 0 0 0-.5c0-.1-.6-1.4-.8-1.9s-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-.9 2.2 5 5 0 0 0 1.1 2.7 11.4 11.4 0 0 0 4.4 3.9 15 15 0 0 0 1.5.6 3.6 3.6 0 0 0 1.7.1 2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.6-.3Z"
      />
    </svg>
  );
}

function Empty({ title, text }: { title: string; text: string }) {
  return (
    <div className="biz-public__empty">
      <i>
        <Star size={18} />
      </i>
      <strong>{title}</strong>
      <p>{text}</p>
    </div>
  );
}

export default function PublicProfileCard({
  businessName = "",
  description = "",
  logoUrl = "",
  coverUrl = "",
  category = "",
  city = "",
  phone = "",
  email = "",
  formattedPhone = "",
  websiteUrl = "",
  whatsappUrl = "",
  normalizedWebsiteUrl = "",
  normalizedWhatsappUrl = "",
  rating = 0,
  reviewsCount = 0,
  mainImages = [],
  gallery = [],
  reviews = [],
  faqs = [],
  tab,
  onTabChange,
  editHref,
  reviewsAction,
  highlightedReviewId = "",
}: PublicProfileCardProps) {
  const { t } = useTranslation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [zoom, setZoom] = useState("");
  const name = businessName || t("businessProfile.view.defaultBusinessName");
  const photos = tab === "Gallery" ? gallery : mainImages;

  return (
    <article className="biz-public__card">
      <div className="biz-public__cover">
        {coverUrl ? (
          <img src={coverUrl} alt={t("businessProfile.view.coverAlt", { name })} />
        ) : null}
        {editHref ? (
          <Link to={editHref} className="biz-public__edit">
            <Pencil size={16} />
            {t("businessProfile.view.editLink")}
          </Link>
        ) : null}
      </div>

      <div className="biz-public__identity">
        <div className="biz-public__logo">
          {logoUrl ? (
            <img src={logoUrl} alt={t("businessProfile.view.logoAlt", { name })} />
          ) : (
            name.charAt(0).toUpperCase()
          )}
        </div>
        <div className="biz-public__copy">
          <h1 className="biz-public__name">{name}</h1>
          {(category || city || reviewsCount > 0) && (
            <div className="biz-public__meta">
              {category ? <span>{category}</span> : null}
              {city ? <span>{city}</span> : null}
              {reviewsCount > 0 ? (
                <span>
                  {rating.toFixed(1)} · {t("businessProfile.view.reviewsCount", { count: reviewsCount })}
                </span>
              ) : null}
            </div>
          )}
        </div>
      </div>

      <div className="biz-public__body">
        {description ? <p className="biz-public__desc">{description}</p> : null}

        {(phone || email || websiteUrl || whatsappUrl) && (
          <div className="biz-public__contacts">
            {phone ? (
              <a className="biz-public__contact is-phone" href={`tel:${phone}`}>
                <Phone size={16} />
                <span dir="ltr">{formattedPhone || phone}</span>
              </a>
            ) : null}
            {email ? (
              <a className="biz-public__contact is-mail" href={`mailto:${email}`}>
                <Mail size={16} />
                <span dir="ltr">{email}</span>
              </a>
            ) : null}
            {whatsappUrl ? (
              <a
                className="biz-public__contact is-wa"
                href={normalizedWhatsappUrl}
                target="_blank"
                rel="noreferrer"
              >
                <WhatsAppMark />
                <span>{t("businessProfile.contact.whatsappCta")}</span>
              </a>
            ) : null}
            {websiteUrl ? (
              <a
                className="biz-public__contact"
                href={normalizedWebsiteUrl}
                target="_blank"
                rel="noreferrer"
              >
                <Globe size={16} color="#2541F5" />
                <span>{t("businessProfile.contact.websiteCta")}</span>
              </a>
            ) : null}
          </div>
        )}

        <div className="biz-public__tabs" role="tablist">
          {TABS.map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={item === tab}
              className={item === tab ? "biz-public__tab is-on" : "biz-public__tab"}
              onClick={() => onTabChange(item)}
            >
              {t(`businessProfile.view.tabs.${TAB_KEYS[item]}`)}
            </button>
          ))}
        </div>

        <div className="biz-public__panel">
          {tab === "Main" || tab === "Gallery" ? (
            photos.length ? (
              <div className="biz-public__grid">
                {photos.map((url, index) => (
                  <button
                    key={`${url}-${index}`}
                    type="button"
                    className="biz-public__shot"
                    onClick={() => setZoom(url)}
                  >
                    <img src={url} alt="" />
                  </button>
                ))}
              </div>
            ) : (
              <Empty
                title={t(
                  tab === "Gallery"
                    ? "businessProfile.view.empty.galleryTitle"
                    : "businessProfile.view.empty.mainImagesTitle"
                )}
                text={t(
                  tab === "Gallery"
                    ? "businessProfile.view.empty.galleryText"
                    : "businessProfile.view.empty.mainImagesText"
                )}
              />
            )
          ) : null}

          {tab === "Reviews" ? (
            <>
              <div className="biz-public__reviews-head">
                <div>
                  <div className="biz-public__score">
                    <strong>{reviewsCount > 0 ? rating.toFixed(1) : "—"}</strong>
                    <span>{t("businessProfile.view.reviewsCount", { count: reviewsCount })}</span>
                  </div>
                  <p>{t("businessProfile.view.customerReviews")}</p>
                </div>
                {reviewsAction}
              </div>
              {reviews.length ? (
                <div className="biz-public__review-list">
                  {reviews.map((review, index) => (
                    <ReviewCard
                      key={review._id || index}
                      review={review}
                      reviewDomId={review._id ? `review-${review._id}` : undefined}
                      highlighted={Boolean(review._id) && String(review._id) === highlightedReviewId}
                    />
                  ))}
                </div>
              ) : (
                <Empty
                  title={t("businessProfile.view.empty.reviewsTitle")}
                  text={t("businessProfile.view.empty.reviewsText")}
                />
              )}
            </>
          ) : null}

          {tab === "Website" ? (
            websiteUrl ? (
              <div className="biz-public__link-card">
                <strong>{t("businessProfile.view.websiteTitle")}</strong>
                <p className="biz-public__desc">{t("businessProfile.view.websiteDesc")}</p>
                <a className="biz-public__go" href={normalizedWebsiteUrl} target="_blank" rel="noreferrer">
                  {t("businessProfile.contact.websiteCta")}
                </a>
              </div>
            ) : (
              <Empty
                title={t("businessProfile.view.empty.websiteTitle")}
                text={t("businessProfile.view.empty.websiteText")}
              />
            )
          ) : null}

          {tab === "FAQs" ? (
            faqs.length ? (
              faqs.map((faq, index) => {
                const open = openFaq === index;
                return (
                  <div className="biz-public__faq" key={faq._id || index}>
                    <button type="button" aria-expanded={open} onClick={() => setOpenFaq(open ? null : index)}>
                      <span>{faq.question}</span>
                      <ChevronDown size={16} style={{ transform: open ? "rotate(180deg)" : undefined }} />
                    </button>
                    {open ? <div>{faq.answer}</div> : null}
                  </div>
                );
              })
            ) : (
              <Empty
                title={t("businessProfile.view.empty.faqsTitle")}
                text={t("businessProfile.view.empty.faqsText")}
              />
            )
          ) : null}
        </div>
      </div>

      {zoom ? (
        <div className="biz-public__light" onClick={() => setZoom("")} role="presentation">
          <button type="button" onClick={() => setZoom("")}>
            {t("common.close", "Close")}
          </button>
          <img src={zoom} alt="" />
        </div>
      ) : null}
    </article>
  );
}
