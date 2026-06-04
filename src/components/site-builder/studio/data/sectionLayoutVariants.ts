/*
  Bizuply Website Studio — Section Layout Variants
  Path: src/components/site-builder/studio/data/sectionLayoutVariants.ts

  קובץ מרכזי שמחבר את כל קבצי המבנים הנפרדים.
  כל סקשן נמצא בקובץ נפרד בתוך:
  src/components/site-builder/studio/data/section-variants
*/

import type { SectionKind, SectionLayoutVariant } from "../types";
export type { SectionKind, SectionLayoutVariant } from "../types";

import { headerLayoutVariants } from "./section-variants/headerLayoutVariants";
import { heroLayoutVariants } from "./section-variants/heroLayoutVariants";
import { welcomeLayoutVariants } from "./section-variants/welcomeLayoutVariants";
import { aboutLayoutVariants } from "./section-variants/aboutLayoutVariants";
import { teamLayoutVariants } from "./section-variants/teamLayoutVariants";
import { servicesLayoutVariants } from "./section-variants/servicesLayoutVariants";
import { galleryLayoutVariants } from "./section-variants/galleryLayoutVariants";
import { contactLayoutVariants } from "./section-variants/contactLayoutVariants";
import { promotionLayoutVariants } from "./section-variants/promotionLayoutVariants";
import { subscribeLayoutVariants } from "./section-variants/subscribeLayoutVariants";
import { testimonialsLayoutVariants } from "./section-variants/testimonialsLayoutVariants";
import { reviewsLayoutVariants } from "./section-variants/reviewsLayoutVariants";
import { clientsLayoutVariants } from "./section-variants/clientsLayoutVariants";
import { storeLayoutVariants } from "./section-variants/storeLayoutVariants";
import { bookingLayoutVariants } from "./section-variants/bookingLayoutVariants";
import { eventsLayoutVariants } from "./section-variants/eventsLayoutVariants";
import { botLayoutVariants } from "./section-variants/botLayoutVariants";
import { socialLayoutVariants } from "./section-variants/socialLayoutVariants";
import { basicLayoutVariants } from "./section-variants/basicLayoutVariants";
import { textLayoutVariants } from "./section-variants/textLayoutVariants";
import { listLayoutVariants } from "./section-variants/listLayoutVariants";
import { formLayoutVariants } from "./section-variants/formLayoutVariants";

/*
  תמיכה גם בשם booking וגם בשם bookings.
  אם במערכת שלך יש סקשן ישן בשם "bookings",
  הוא יקבל את אותן תבניות של booking.
*/
const bookingsLayoutVariants: SectionLayoutVariant[] = bookingLayoutVariants.map(
  (variant) => ({
    ...variant,
    id: variant.id.replace(/^booking-/, "bookings-"),
    kind: "bookings" as SectionKind,
  })
);

/*
  כל התבניות של כל הסקשנים.
  הסדר כאן הוא גם הסדר שבו הקטגוריות יכולות להופיע במודאל.
*/
export const sectionLayoutVariants: SectionLayoutVariant[] = [
  ...headerLayoutVariants,
  ...heroLayoutVariants,
  ...welcomeLayoutVariants,
  ...aboutLayoutVariants,
  ...teamLayoutVariants,
  ...servicesLayoutVariants,
  ...galleryLayoutVariants,
  ...contactLayoutVariants,
  ...promotionLayoutVariants,
  ...subscribeLayoutVariants,
  ...testimonialsLayoutVariants,
  ...reviewsLayoutVariants,
  ...clientsLayoutVariants,
  ...storeLayoutVariants,
  ...bookingLayoutVariants,
  ...bookingsLayoutVariants,
  ...eventsLayoutVariants,
  ...botLayoutVariants,
  ...socialLayoutVariants,
  ...basicLayoutVariants,
  ...textLayoutVariants,
  ...listLayoutVariants,
  ...formLayoutVariants,
];

/*
  מחזיר את כל המבנים לפי סוג סקשן.
  בזה משתמש המודאל כשבוחרים סקשן מסוים.
*/
export function getSectionLayoutVariants(kind: SectionKind) {
  return sectionLayoutVariants.filter((variant) => variant.kind === kind);
}

/*
  עוזר לבדוק אם לסקשן יש בכלל תבניות.
  שימושי למודאל של הקטגוריות.
*/
export function hasSectionLayoutVariants(kind: SectionKind) {
  return getSectionLayoutVariants(kind).length > 0;
}

/*
  עוזר להביא תבנית בודדת לפי id.
*/
export function getSectionLayoutVariantById(id: string) {
  return sectionLayoutVariants.find((variant) => variant.id === id) || null;
}