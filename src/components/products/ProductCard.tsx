"use client";

import { useStore } from "@/components/store/StoreProvider";
import { Icon } from "@/components/ui/Icon";
import { formatPrice, getDiscountPercent, type Product } from "@/data/products";
import { getCategoryLabel } from "@/lib/categories";
import type { ProductGridSection } from "@/types/template";

export function ProductCard({
  product,
  stockInLabel,
  stockLowLabel,
}: {
  product: Product;
  stockInLabel: ProductGridSection["content"]["stockInLabel"];
  stockLowLabel: ProductGridSection["content"]["stockLowLabel"];
}) {
  const { cart, addToCart, updateQuantity, currency, locale } = useStore();
  const quantity =
    cart.find((line) => line.productId === product.id)?.quantity ?? 0;
  const discount = getDiscountPercent(product.price, product.compareAtPrice);

  return (
    <article className="product-card">
      <div
        className={`product-image product-tone-${product.categoryId}`}
        role="img"
        aria-label={product.imageAlt}
        style={{ backgroundImage: `url("${product.image}")` }}
      >
        {product.badge && <span className="product-badge">{product.badge}</span>}
        {discount && <span className="product-discount">−{discount}%</span>}
        <span
          className={`stock-indicator${product.stock === "low-stock" ? " low-stock" : ""}`}
        >
          <span />
          {product.stock === "low-stock" ? stockLowLabel : stockInLabel}
        </span>
      </div>
      <div className="product-card-copy">
        <div className="product-category">{getCategoryLabel(product.categoryId)}</div>
        <h3>{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-rating" aria-label={`${product.rating} out of 5 stars`}>
          <Icon name="star" size={14} filled />
          <strong>{product.rating.toFixed(1)}</strong>
          <span>({product.reviewCount})</span>
        </div>
        <div className="product-card-bottom">
          <div className="product-price">
            <strong>{formatPrice(product.price, locale, currency)}</strong>
            {product.compareAtPrice && (
              <del>{formatPrice(product.compareAtPrice, locale, currency)}</del>
            )}
          </div>
          {quantity > 0 ? (
            <div className="quantity-control" aria-label={`${product.name} quantity`}>
              <button
                type="button"
                aria-label={`Remove one ${product.name}`}
                onClick={() => updateQuantity(product.id, quantity - 1)}
              >
                <Icon name="minus" size={15} />
              </button>
              <span aria-live="polite">{quantity}</span>
              <button
                type="button"
                aria-label={`Add one ${product.name}`}
                onClick={() => addToCart(product.id)}
              >
                <Icon name="plus" size={15} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="add-button"
              onClick={() => addToCart(product.id)}
              aria-label={`Add ${product.name} to bag`}
            >
              <Icon name="plus" size={17} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
