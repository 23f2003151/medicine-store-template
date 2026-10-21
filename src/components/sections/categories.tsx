"use client";

import type { CategoriesSection } from "@/types/template";
import { useStore } from "@/components/store/StoreProvider";
import { SectionShell } from "@/components/Storefront";
import { Icon } from "@/components/ui/Icon";

export function CategorySection({
  section,
}: {
  section: CategoriesSection;
}) {
  const { setCategoryFilter, categoryFilter } = useStore();

  return (
    <SectionShell id={section.id} className="categories-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{section.content.eyebrow}</p>
          <h2>{section.content.title}</h2>
          <p className="section-description">{section.content.description}</p>
        </div>
        {categoryFilter && (
          <button
            className="text-link clear-filter"
            type="button"
            onClick={() => setCategoryFilter(null)}
          >
            {section.content.clearFilterLabel}
            <Icon name="arrow-right" size={16} />
          </button>
        )}
      </div>
      <div className="category-grid">
        {section.content.items.map((item) => (
          <button
            type="button"
            key={item.id}
            className={`category-tile tone-${item.color}${categoryFilter === item.id ? " is-selected" : ""}`}
            aria-pressed={categoryFilter === item.id}
            onClick={() =>
              setCategoryFilter(categoryFilter === item.id ? null : item.id)
            }
          >
            <span className="category-icon">
              <Icon name={item.icon} size={24} />
            </span>
            <span className="category-tile-copy">
              <strong>{item.label}</strong>
              <small>{item.description}</small>
            </span>
            <span className="category-arrow">
              <Icon name="arrow-up-right" size={18} />
            </span>
          </button>
        ))}
      </div>
    </SectionShell>
  );
}
