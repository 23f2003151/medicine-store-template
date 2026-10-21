export const SUPPORTED_SECTION_TYPES = [
  "announcement",
  "header",
  "navigation",
  "hero",
  "categories",
  "product-grid",
  "promotion",
  "wellness",
  "benefits",
  "newsletter",
  "footer",
] as const;

export interface ThemeConfig {
  primary: string;
  secondary: string;
  pageBackground: string;
  surface: string;
  text: string;
  mutedText: string;
  border: string;
  accent: string;
  fontFamily: "system" | "geometric";
  borderRadius: number;
  containerWidth: number;
  shadow: "soft" | "medium" | "none";
}

export interface StoreOffer {
  code: string;
  discountPercent: number;
  minimumOrder: number;
  fieldLabel: string;
  successMessage: string;
  minimumMessage: string;
  invalidMessage: string;
}

export interface StoreCartCopy {
  emptyTitle: string;
  emptyDescription: string;
  emptyButtonLabel: string;
  checkoutNoticeTitle: string;
  checkoutNotice: string;
  confirmationTitle: string;
  confirmationDescription: string;
  loadingTitle: string;
  loadingDescription: string;
  totalsDisclaimer: string;
  checkoutFootnote: string;
  freeDeliveryUnlocked: string;
  freeDeliveryRemaining: string;
  bagEyebrow: string;
  checkoutEyebrow: string;
  completeEyebrow: string;
  bagTitle: string;
  checkoutTitle: string;
  completeTitle: string;
  completeButtonLabel: string;
  continueCheckoutLabel: string;
  placeOrderLabel: string;
}

export interface SectionBase<TType extends string, TContent> {
  id: string;
  type: TType;
  content: TContent;
}

export type AnnouncementSection = SectionBase<
  "announcement",
  { message: string; linkLabel: string; href: string }
>;

export type HeaderSection = SectionBase<
  "header",
  { searchPlaceholder: string; demoNote: string }
>;

export type NavigationSection = SectionBase<
  "navigation",
  {
    links: Array<{ label: string; href: string; categoryId?: string }>;
    note: string;
  }
>;

export type HeroSection = SectionBase<
  "hero",
  {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    image: string;
    imageAlt: string;
    stampTitle: string;
    stampDescription: string;
    sideNote: string;
    proofPoints: string[];
  }
>;

export type CategoriesSection = SectionBase<
  "categories",
  {
    title: string;
    description: string;
    eyebrow: string;
    clearFilterLabel: string;
    items: Array<{
      id: string;
      label: string;
      description: string;
      icon: string;
      color: string;
    }>;
  }
>;

export type ProductGridSection = SectionBase<
  "product-grid",
  {
    title: string;
    eyebrow: string;
    description: string;
    productIds: string[];
    variant: "featured" | "bestsellers";
    showControls: boolean;
    stockInLabel: string;
    stockLowLabel: string;
    emptyTitle: string;
    emptyDescription: string;
    emptyButtonLabel: string;
    activeFilterPrefix: string;
    clearFilterLabel: string;
  }
>;

export type PromotionSection = SectionBase<
  "promotion",
  {
    eyebrow: string;
    title: string;
    description: string;
    ctaLabel: string;
    href: string;
    image: string;
    imageAlt: string;
    code: string;
    discountPercent: number;
    minimumOrder: number;
    couponFieldLabel: string;
    couponSuccessMessage: string;
    couponMinimumMessage: string;
    couponInvalidMessage: string;
    codeLabel: string;
    imageStampLineOne: string;
    imageStampLineTwo: string;
  }
>;

export type WellnessSection = SectionBase<
  "wellness",
  {
    title: string;
    eyebrow: string;
    description: string;
    cardEyebrows: [string, string];
    linkLabel: string;
    items: Array<{
      title: string;
      description: string;
      image: string;
      imageAlt: string;
      href: string;
    }>;
  }
>;

export type BenefitsSection = SectionBase<
  "benefits",
  {
    items: Array<{ title: string; description: string; icon: string }>;
  }
>;

export type NewsletterSection = SectionBase<
  "newsletter",
  {
    title: string;
    eyebrow: string;
    description: string;
    buttonLabel: string;
    emailLabel: string;
    emailPlaceholder: string;
    footnote: string;
    successTitle: string;
    successDescription: string;
  }
>;

export type FooterSection = SectionBase<
  "footer",
  {
    brandDescription: string;
    contact: { phone: string; email: string; address: string };
    linkGroups: Array<{
      title: string;
      links: Array<{ label: string; href: string }>;
    }>;
    copyright: string;
    demoDisclaimer: string;
  }
>;

export type SupportedSection =
  | AnnouncementSection
  | HeaderSection
  | NavigationSection
  | HeroSection
  | CategoriesSection
  | ProductGridSection
  | PromotionSection
  | WellnessSection
  | BenefitsSection
  | NewsletterSection
  | FooterSection;

export interface UnsupportedSection {
  id: string;
  type: string;
  content?: unknown;
}

export type BlueprintSection = SupportedSection | UnsupportedSection;

export interface StoreTemplate {
  metadata: {
    id: string;
    name: string;
    version: string;
    description: string;
  };
  store: {
    name: string;
    tagline: string;
    locale: string;
    currency: string;
    demo: boolean;
    freeDeliveryMinimum: number;
    cartCopy: StoreCartCopy;
  };
  theme: ThemeConfig;
  pages: {
    home: {
      title: string;
      description: string;
      sections: BlueprintSection[];
    };
  };
}
