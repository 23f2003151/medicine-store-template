import { template } from "@/lib/template";
import type { CategoriesSection } from "@/types/template";

const categorySection = template.pages.home.sections.find(
  (section): section is CategoriesSection => section.type === "categories",
);

export function getCategoryLabel(categoryId: string): string {
  return (
    categorySection?.content.items.find((category) => category.id === categoryId)
      ?.label ?? categoryId.replaceAll("-", " ")
  );
}
