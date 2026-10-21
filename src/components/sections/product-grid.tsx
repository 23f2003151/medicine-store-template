"use client";

import { useMemo, useState } from "react";
import type { ProductGridSection } from "@/types/template";
import { products } from "@/data/products";
import { ProductCard } from "@/components/products/ProductCard";
import { useStore } from "@/components/store/StoreProvider";
import { SectionShell } from "@/components/Storefront";
import { Icon } from "@/components/ui/Icon";
import { getCategoryLabel } from "@/lib/categories";

export function ProductGrid({ section }: { section: ProductGridSection }) {
  const { search, setSearch, categoryFilter, setCategoryFilter } = useStore();
  const [sortBy, setSortBy] = useState("featured");
  const [inStockOnly, setInStockOnly] = useState(false);
  const listedProducts = useMemo(() => {
    const allowedIds = new Set(section.content.productIds);
    const query = search.trim().toLocaleLowerCase();
    const filtered = products.filter((product) => {
      const matchesText =
        !query ||
        `${product.name} ${product.description} ${getCategoryLabel(product.categoryId)}`
          .toLocaleLowerCase()
          .includes(query);
      return (
        allowedIds.has(product.id) &&
        matchesText &&
        (!categoryFilter || product.categoryId === categoryFilter) &&
        (!inStockOnly || product.stock === "in-stock")
      );
    });

    return filtered.sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return section.content.variant === "bestsellers"
        ? Number(b.bestseller) - Number(a.bestseller)
        : Number(b.featured) - Number(a.featured);
    });
  }, [
    section.content.productIds,
    section.content.variant,
    search,
    categoryFilter,
    inStockOnly,
    sortBy,
  ]);

  return (
    <SectionShell
      id={section.id}
      className={`product-section${section.content.variant === "bestsellers" ? " bestsellers-section" : ""}`}
    >
      <div className="section-heading product-heading">
        <div>
          <p className="eyebrow">{section.content.eyebrow}</p>
          <h2>{section.content.title}</h2>
          <p className="section-description">{section.content.description}</p>
        </div>
        {section.content.showControls && (
          <div className="product-controls">
            <label className="stock-filter">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(event) => setInStockOnly(event.target.checked)}
              />
              <span>{section.content.stockInLabel}</span>
            </label>
            <label className="sort-label">
              <span className="sr-only">Sort products</span>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-low">Price: Low to high</option>
                <option value="price-high">Price: High to low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </label>
          </div>
        )}
      </div>
      {categoryFilter && (
        <div className="active-filter">
          <span>
            {section.content.activeFilterPrefix} {getCategoryLabel(categoryFilter)}
          </span>
          <button type="button" onClick={() => setCategoryFilter(null)}>
            {section.content.clearFilterLabel} <Icon name="close" size={14} />
          </button>
        </div>
      )}
      {listedProducts.length > 0 ? (
        <div className="product-grid">
          {listedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              stockInLabel={section.content.stockInLabel}
              stockLowLabel={section.content.stockLowLabel}
            />
          ))}
        </div>
      ) : (
        <div className="empty-products">
          <span className="empty-icon">
            <Icon name="search" size={24} />
          </span>
          <h3>{section.content.emptyTitle}</h3>
          <p>{section.content.emptyDescription}</p>
          <button
            type="button"
            className="button button-primary"
            onClick={() => {
              setSearch("");
              setCategoryFilter(null);
              setInStockOnly(false);
            }}
          >
            {section.content.emptyButtonLabel}
          </button>
        </div>
      )}
    </SectionShell>
  );
}
