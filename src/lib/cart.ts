import type { StoreOffer } from "@/types/template";

export type CouponStatus = "applied" | "minimum-not-met" | "invalid";

export function getCouponStatus(
  subtotal: number,
  offer: StoreOffer,
  enteredCode: string,
): CouponStatus {
  if (enteredCode.trim().toUpperCase() !== offer.code.toUpperCase()) {
    return "invalid";
  }
  return subtotal >= offer.minimumOrder ? "applied" : "minimum-not-met";
}

export function calculateCouponDiscount(
  subtotal: number,
  offer: StoreOffer,
  enteredCode: string,
): number {
  return getCouponStatus(subtotal, offer, enteredCode) === "applied"
    ? Math.round((subtotal * offer.discountPercent) / 100)
    : 0;
}

export function calculateCartSubtotal(
  lines: Array<{ productId: string; quantity: number }>,
  catalog: Array<{ id: string; price: number }>,
): number {
  return lines.reduce((subtotal, line) => {
    const product = catalog.find((item) => item.id === line.productId);
    return subtotal + (product?.price ?? 0) * line.quantity;
  }, 0);
}

export function getCartTotals(
  subtotal: number,
  freeDeliveryMinimum: number,
  discount: number,
  deliveryFee = 49,
): { delivery: number; total: number } {
  const delivery =
    subtotal >= freeDeliveryMinimum || subtotal === 0 ? 0 : deliveryFee;
  return { delivery, total: subtotal - discount + delivery };
}
