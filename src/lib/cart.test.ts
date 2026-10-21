import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  calculateCartSubtotal,
  calculateCouponDiscount,
  getCartTotals,
  getCouponStatus,
} from "@/lib/cart";
import type { StoreOffer } from "@/types/template";

const offer: StoreOffer = {
  code: "HELLOCARE",
  discountPercent: 15,
  minimumOrder: 599,
  fieldLabel: "Coupon",
  successMessage: "Applied",
  minimumMessage: "Minimum",
  invalidMessage: "Invalid",
};

describe("cart calculations", () => {
  it("calculates coupon eligibility and discount", () => {
    assert.equal(getCouponStatus(600, offer, " hellocare "), "applied");
    assert.equal(getCouponStatus(500, offer, "HELLOCARE"), "minimum-not-met");
    assert.equal(getCouponStatus(600, offer, "wrong"), "invalid");
    assert.equal(calculateCouponDiscount(600, offer, "HELLOCARE"), 90);
    assert.equal(calculateCouponDiscount(500, offer, "HELLOCARE"), 0);
  });

  it("calculates cart subtotal from the shared catalog", () => {
    assert.equal(
      calculateCartSubtotal(
        [
          { productId: "vitamins", quantity: 2 },
          { productId: "soap", quantity: 1 },
          { productId: "missing", quantity: 4 },
        ],
        [
          { id: "vitamins", price: 300 },
          { id: "soap", price: 125 },
        ],
      ),
      725,
    );
  });

  it("calculates delivery and final totals", () => {
    assert.deepEqual(getCartTotals(500, 799, 50), {
      delivery: 49,
      total: 499,
    });
    assert.deepEqual(getCartTotals(800, 799, 50), {
      delivery: 0,
      total: 750,
    });
    assert.deepEqual(getCartTotals(0, 799, 0), {
      delivery: 0,
      total: 0,
    });
  });
});
