import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { template, validateTemplate } from "@/lib/template";
import { products } from "@/data/products";
import { getCategoryLabel } from "@/lib/categories";
import type { CategoriesSection } from "@/types/template";

describe("template validation", () => {
  it("loads the JSON blueprint with ordered supported sections", () => {
    assert.equal(template.store.name, "MediCare Pharmacy");
    assert.deepEqual(template.pages.home.sections.map((section) => section.id), [
      "announcement",
      "header",
      "navigation",
      "hero",
      "categories",
      "featured",
      "promotion",
      "bestsellers",
      "wellness",
      "benefits",
      "newsletter",
      "footer",
    ]);
  });

  it("defaults omitted optional theme and delivery settings", () => {
    const validated = validateTemplate({
      ...template,
      theme: undefined,
      store: { ...template.store, freeDeliveryMinimum: undefined },
    });
    assert.equal(validated.theme.primary, "#176b53");
    assert.equal(validated.store.freeDeliveryMinimum, 799);
  });

  it("sanitizes unsupported configurable theme values", () => {
    const validated = validateTemplate({
      ...template,
      theme: {
        ...template.theme,
        primary: "red; background:url(javascript:alert(1))",
        fontFamily: "external-font",
        borderRadius: 500,
      },
    });
    assert.equal(validated.theme.primary, "#176b53");
    assert.equal(validated.theme.fontFamily, "system");
    assert.equal(validated.theme.borderRadius, 18);
  });

  it("uses blueprint category labels for every product category", () => {
    const categoryIds = new Set(
      template.pages.home.sections
        .filter(
          (section): section is CategoriesSection =>
            section.type === "categories",
        )
        .flatMap((section) => section.content.items.map((category) => category.id)),
    );
    for (const product of products) {
      assert.ok(categoryIds.has(product.categoryId));
      assert.ok(getCategoryLabel(product.categoryId).length > 0);
    }
    assert.equal(getCategoryLabel("wellness"), "Vitamins & wellness");
  });
});
