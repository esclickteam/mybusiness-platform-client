export type GuestFrame = {
  hero: string;
  menu: string;
  pageScrollX: false;
  orderBar: "fixed" | "sticky";
  menuMaxWidth: "none";
};

export function dishesForCategory<T extends { categoryId?: string }>(
  dishes: T[],
  categoryId?: string
): T[] {
  if (!categoryId || categoryId === "all") return dishes;
  return dishes.filter((dish) => dish.categoryId === categoryId);
}

/** Desktop uses the full window: hero 35%, menu the rest. No 440px column. */
export function guestFrame(width: number): GuestFrame {
  if (width < 768) {
    return { hero: "0%", menu: "100%", pageScrollX: false, orderBar: "fixed", menuMaxWidth: "none" };
  }
  if (width < 1024) {
    return { hero: "32%", menu: "68%", pageScrollX: false, orderBar: "sticky", menuMaxWidth: "none" };
  }
  return { hero: "35%", menu: "65%", pageScrollX: false, orderBar: "sticky", menuMaxWidth: "none" };
}
