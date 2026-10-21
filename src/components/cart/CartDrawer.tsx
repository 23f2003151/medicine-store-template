"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { products, formatPrice } from "@/data/products";
import { useStore } from "@/components/store/StoreProvider";
import { Icon } from "@/components/ui/Icon";
import { getCategoryLabel } from "@/lib/categories";
import {
  calculateCouponDiscount,
  getCouponStatus,
  getCartTotals,
} from "@/lib/cart";

type DrawerView = "bag" | "checkout" | "submitting" | "complete";

export function CartDrawer() {
  const {
    cart,
    cartCount,
    cartSubtotal,
    updateQuantity,
    cartOpen,
    closeCart,
    clearCart,
    currency,
    locale,
    freeDeliveryMinimum,
    offer,
    cartCopy,
  } = useStore();
  const [view, setView] = useState<DrawerView>("bag");
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountMessage, setDiscountMessage] = useState("");
  const completionTimer = useRef<number | null>(null);
  const dialogRef = useRef<HTMLElement>(null);

  const couponStatus = offer
    ? getCouponStatus(cartSubtotal, offer, discountCode)
    : "invalid";
  const discount =
    offer && discountApplied
      ? calculateCouponDiscount(cartSubtotal, offer, discountCode)
      : 0;
  const { delivery, total } = getCartTotals(
    cartSubtotal,
    freeDeliveryMinimum,
    discount,
  );
  const lines = useMemo(
    () =>
      cart.flatMap((line) => {
        const product = products.find((item) => item.id === line.productId);
        return product ? [{ ...line, product }] : [];
      }),
    [cart],
  );

  useEffect(() => {
    if (!cartOpen) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
      if (event.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable?.length) {
          event.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const focusIsInsideDialog = dialogRef.current?.contains(
          document.activeElement,
        );
        if (
          event.shiftKey &&
          (document.activeElement === first || !focusIsInsideDialog)
        ) {
          event.preventDefault();
          last.focus();
        } else if (
          !event.shiftKey &&
          (document.activeElement === last || !focusIsInsideDialog)
        ) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    document.body.classList.add("drawer-open");
    dialogRef.current?.focus();
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("drawer-open");
      window.removeEventListener("keydown", onKeyDown);
      if (previouslyFocused?.isConnected) {
        previouslyFocused.focus();
      }
    };
  }, [cartOpen, closeCart]);

  useEffect(
    () => () => {
      if (completionTimer.current !== null) {
        window.clearTimeout(completionTimer.current);
      }
    },
    [],
  );

  function applyCode() {
    if (offer && getCouponStatus(cartSubtotal, offer, discountCode) === "applied") {
      setDiscountApplied(true);
      setDiscountMessage(
        offer.successMessage
          .replace("{percent}", String(offer.discountPercent)),
      );
      return;
    }
    setDiscountApplied(false);
    setDiscountMessage(
      offer && couponStatus === "minimum-not-met"
        ? offer.minimumMessage.replace(
            "{amount}",
            formatPrice(offer.minimumOrder, locale, currency),
          )
        : offer
          ? offer.invalidMessage.replace("{code}", offer.code)
          : "",
    );
  }

  function completeDemoOrder() {
    setView("submitting");
    completionTimer.current = window.setTimeout(() => {
      clearCart();
      setView("complete");
      completionTimer.current = null;
    }, 800);
  }

  function closeDrawer() {
    if (completionTimer.current !== null) {
      window.clearTimeout(completionTimer.current);
      completionTimer.current = null;
    }
    closeCart();
    setView("bag");
    setDiscountCode("");
    setDiscountApplied(false);
    setDiscountMessage("");
  }

  if (!cartOpen) return null;

  return (
    <div className="cart-layer">
      <button
        type="button"
        className="cart-backdrop"
        aria-label="Close shopping bag"
        onClick={closeDrawer}
      />
      <aside
        ref={dialogRef}
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        tabIndex={-1}
      >
        <div className="cart-drawer-header">
          <div>
            <p className="eyebrow">
              {view === "bag"
                ? cartCopy.bagEyebrow
                : view === "complete"
                  ? cartCopy.completeEyebrow
                  : cartCopy.checkoutEyebrow}
            </p>
            <h2 id="cart-title">
              {view === "bag"
                ? `${cartCopy.bagTitle}${cartCount > 0 ? ` (${cartCount})` : ""}`
                : view === "complete"
                  ? cartCopy.completeTitle
                  : view === "submitting"
                    ? cartCopy.loadingTitle
                    : cartCopy.checkoutTitle}
            </h2>
          </div>
          <button
            type="button"
            className="icon-button"
            aria-label="Close shopping bag"
            onClick={closeDrawer}
          >
            <Icon name="close" size={21} />
          </button>
        </div>

        {view === "complete" ? (
          <div className="order-complete" role="status">
            <span className="order-complete-icon">
              <Icon name="check" size={29} />
            </span>
            <h3>{cartCopy.confirmationTitle}</h3>
            <p>{cartCopy.confirmationDescription}</p>
            <button
              type="button"
              className="button button-primary"
              onClick={closeDrawer}
            >
              {cartCopy.completeButtonLabel} <Icon name="arrow-right" size={17} />
            </button>
          </div>
        ) : view === "submitting" ? (
          <div className="demo-loading" role="status" aria-live="polite">
            <span className="loading-spinner" aria-hidden="true" />
            <h3>{cartCopy.loadingTitle}</h3>
            <p>{cartCopy.loadingDescription}</p>
          </div>
        ) : lines.length === 0 ? (
          <div className="empty-cart">
            <span className="empty-icon">
              <Icon name="shopping-bag" size={25} />
            </span>
            <h3>{cartCopy.emptyTitle}</h3>
            <p>{cartCopy.emptyDescription}</p>
            <button
              type="button"
              className="button button-primary"
              onClick={closeDrawer}
            >
              {cartCopy.emptyButtonLabel} <Icon name="arrow-right" size={17} />
            </button>
          </div>
        ) : (
          <>
            <div className="cart-drawer-content">
              {view === "checkout" ? (
                <div className="checkout-note">
                  <span className="checkout-note-icon">
                    <Icon name="lock" size={19} />
                  </span>
                  <div>
                    <strong>{cartCopy.checkoutNoticeTitle}</strong>
                    <p>{cartCopy.checkoutNotice}</p>
                  </div>
                </div>
              ) : (
                <div className="delivery-progress">
                  <div className="delivery-progress-head">
                    <Icon name="truck" size={18} />
                    {cartSubtotal >= freeDeliveryMinimum
                      ? cartCopy.freeDeliveryUnlocked
                      : cartCopy.freeDeliveryRemaining.replace(
                          "{amount}",
                          formatPrice(
                            freeDeliveryMinimum - cartSubtotal,
                            locale,
                            currency,
                          ),
                        )}
                  </div>
                  <div className="delivery-progress-track">
                    <span
                      style={{
                        width: `${freeDeliveryMinimum > 0 ? Math.min((cartSubtotal / freeDeliveryMinimum) * 100, 100) : 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}
              <div className="cart-lines">
                {lines.map(({ product, quantity }) => (
                  <article className="cart-line" key={product.id}>
                    <div
                      className="cart-line-image"
                      role="img"
                      aria-label={product.imageAlt}
                      style={{ backgroundImage: `url("${product.image}")` }}
                    />
                    <div className="cart-line-info">
                      <span className="product-category">
                        {getCategoryLabel(product.categoryId)}
                      </span>
                      <h3>{product.name}</h3>
                      <strong>{formatPrice(product.price, locale, currency)}</strong>
                      <div className="quantity-control">
                        <button
                          type="button"
                          aria-label={`Remove one ${product.name}`}
                          onClick={() =>
                            updateQuantity(product.id, quantity - 1)
                          }
                        >
                          <Icon name="minus" size={14} />
                        </button>
                        <span>{quantity}</span>
                        <button
                          type="button"
                          aria-label={`Add one ${product.name}`}
                          onClick={() =>
                            updateQuantity(product.id, quantity + 1)
                          }
                        >
                          <Icon name="plus" size={14} />
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="remove-line"
                      aria-label={`Remove ${product.name} from bag`}
                      onClick={() => updateQuantity(product.id, 0)}
                    >
                      <Icon name="close" size={16} />
                    </button>
                  </article>
                ))}
              </div>
              {view === "checkout" && offer && (
                <div className="discount-entry">
                  <label htmlFor="discount-code">{offer.fieldLabel}</label>
                  <div className="discount-input-row">
                    <input
                      id="discount-code"
                      value={discountCode}
                      onChange={(event) => setDiscountCode(event.target.value)}
                      placeholder={offer.code}
                    />
                    <button
                      type="button"
                      className="button button-outline"
                      onClick={applyCode}
                    >
                      Apply
                    </button>
                  </div>
                  {discountMessage && (
                    <p
                      className={`discount-message${discount > 0 ? " is-success" : ""}`}
                      role="status"
                    >
                      {discountApplied &&
                      couponStatus === "minimum-not-met"
                        ? offer.minimumMessage.replace(
                            "{amount}",
                            formatPrice(offer.minimumOrder, locale, currency),
                          )
                        : discountMessage}
                    </p>
                  )}
                </div>
              )}
              <div className="cart-summary">
                <div>
                  <span>Subtotal</span>
                  <span>{formatPrice(cartSubtotal, locale, currency)}</span>
                </div>
                {discount > 0 && (
                  <div className="summary-discount">
                    <span>{offer?.code ?? "Demo"} discount</span>
                    <span>−{formatPrice(discount, locale, currency)}</span>
                  </div>
                )}
                <div>
                  <span>Delivery</span>
                  <span>
                    {delivery > 0
                      ? formatPrice(delivery, locale, currency)
                      : "Free"}
                  </span>
                </div>
                <div className="summary-total">
                  <strong>Total</strong>
                  <strong>{formatPrice(total, locale, currency)}</strong>
                </div>
                <small>
                  All prices are in {currency}. {cartCopy.totalsDisclaimer}
                </small>
              </div>
            </div>
            <div className="cart-drawer-footer">
              <button
                type="button"
                className="button button-primary checkout-button"
                onClick={
                  view === "bag"
                    ? () => setView("checkout")
                    : completeDemoOrder
                }
              >
                {view === "bag"
                  ? cartCopy.continueCheckoutLabel
                  : cartCopy.placeOrderLabel}
                <Icon
                  name={view === "bag" ? "arrow-right" : "check"}
                  size={18}
                />
              </button>
              <p>
                <Icon name="shield" size={15} />
                {cartCopy.checkoutFootnote}
              </p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
