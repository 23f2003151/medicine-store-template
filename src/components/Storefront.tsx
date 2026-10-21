"use client";

import type { ReactNode } from "react";
import type {
  ThemeConfig,
  BlueprintSection,
  PromotionSection,
  StoreTemplate,
} from "@/types/template";
import { getThemeVariables } from "@/lib/theme";
import { StoreProvider } from "@/components/store/StoreProvider";
import { SectionRenderer } from "@/components/SectionRenderer";

export function Storefront({
  theme,
  store,
  sections,
}: {
  theme: ThemeConfig;
  store: StoreTemplate["store"];
  sections: BlueprintSection[];
}) {
  const style = getThemeVariables(theme);
  const promotion = sections.find(
    (section): section is PromotionSection => section.type === "promotion",
  );

  return (
    <div
      id="top"
      className="store-theme min-h-screen bg-background font-sans text-foreground"
      style={style}
    >
      <StoreProvider
        currency={store.currency}
        locale={store.locale}
        freeDeliveryMinimum={store.freeDeliveryMinimum}
        offer={
          promotion
            ? {
                code: promotion.content.code,
                discountPercent: promotion.content.discountPercent,
                minimumOrder: promotion.content.minimumOrder,
                fieldLabel: promotion.content.couponFieldLabel,
                successMessage: promotion.content.couponSuccessMessage,
                minimumMessage: promotion.content.couponMinimumMessage,
                invalidMessage: promotion.content.couponInvalidMessage,
              }
            : null
        }
        cartCopy={store.cartCopy}
      >
        <main>
          <SectionRenderer
            sections={sections}
            storeName={store.name}
            storeTagline={store.tagline}
          />
        </main>
      </StoreProvider>
    </div>
  );
}

export function SectionShell({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`section-shell ${className}`}>
      {children}
    </section>
  );
}
