import {
  SUPPORTED_SECTION_TYPES,
  type BlueprintSection,
  type SupportedSection,
} from "@/types/template";
import {
  AnnouncementBar,
  StoreHeader,
  StoreNavigation,
} from "@/components/sections/chrome";
import { Hero } from "@/components/sections/hero";
import { CategorySection } from "@/components/sections/categories";
import { ProductGrid } from "@/components/sections/product-grid";
import { PromotionBanner } from "@/components/sections/promotion";
import { WellnessCollection } from "@/components/sections/wellness";
import { BenefitsStrip } from "@/components/sections/benefits";
import { Newsletter } from "@/components/sections/newsletter";
import { StoreFooter } from "@/components/sections/footer";

function UnsupportedSection({ type }: { type: string }) {
  return (
    <div className="unsupported-section" role="status">
      This template contains an unsupported section: <strong>{type}</strong>.
    </div>
  );
}

function isSupportedSection(
  section: BlueprintSection,
): section is SupportedSection {
  return SUPPORTED_SECTION_TYPES.some((type) => type === section.type);
}

export function SectionRenderer({
  sections,
  storeName,
  storeTagline,
}: {
  sections: BlueprintSection[];
  storeName: string;
  storeTagline: string;
}) {
  return (
    <>
      {sections.map((section) => {
        if (!isSupportedSection(section)) {
          return <UnsupportedSection key={section.id} type={section.type} />;
        }

        switch (section.type) {
          case "announcement":
            return <AnnouncementBar key={section.id} section={section} />;
          case "header":
            return (
              <StoreHeader
                key={section.id}
                section={section}
                storeName={storeName}
                storeTagline={storeTagline}
              />
            );
          case "navigation":
            return <StoreNavigation key={section.id} section={section} />;
          case "hero":
            return <Hero key={section.id} section={section} />;
          case "categories":
            return <CategorySection key={section.id} section={section} />;
          case "product-grid":
            return <ProductGrid key={section.id} section={section} />;
          case "promotion":
            return <PromotionBanner key={section.id} section={section} />;
          case "wellness":
            return <WellnessCollection key={section.id} section={section} />;
          case "benefits":
            return <BenefitsStrip key={section.id} section={section} />;
          case "newsletter":
            return <Newsletter key={section.id} section={section} />;
          case "footer":
            return (
              <StoreFooter
                key={section.id}
                section={section}
                storeName={storeName}
                storeTagline={storeTagline}
              />
            );
          default:
            return assertNever(section);
        }
      })}
    </>
  );
}

function assertNever(value: never): never {
  throw new Error(`Unhandled template section: ${JSON.stringify(value)}`);
}
