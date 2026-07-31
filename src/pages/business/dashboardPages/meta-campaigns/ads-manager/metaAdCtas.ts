/** Meta Ads Manager-style Call to action options for Lead / Instant Form ads. */
export const META_AD_CTAS: Array<{ value: string; label: string }> = [
  { value: "OPEN_LINK", label: "See details" },
  { value: "LEARN_MORE", label: "Learn more" },
  { value: "SUBSCRIBE", label: "Subscribe" },
  { value: "BOOK_TRAVEL", label: "Book now" },
  { value: "SIGN_UP", label: "Sign up" },
  { value: "APPLY_NOW", label: "Apply now" },
  { value: "DOWNLOAD", label: "Download" },
  { value: "GET_OFFER", label: "Get offer" },
  { value: "GET_QUOTE", label: "Get quote" },
  { value: "CONTACT_US", label: "Contact us" },
  { value: "SHOP_NOW", label: "Shop now" },
  { value: "CALL_NOW", label: "Call now" },
  { value: "SEND_MESSAGE", label: "Send message" },
  { value: "WHATSAPP_MESSAGE", label: "WhatsApp" },
  { value: "WATCH_MORE", label: "Watch more" },
  { value: "ORDER_NOW", label: "Order now" },
];

export function metaCtaLabel(value: string) {
  return META_AD_CTAS.find((item) => item.value === value)?.label || value;
}
