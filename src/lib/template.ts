import rawTemplate from "../../templates/medicine-store/template.json";
import type {
  BlueprintSection,
  StoreTemplate,
  ThemeConfig,
} from "@/types/template";
import { SUPPORTED_SECTION_TYPES } from "@/types/template";

const defaultTheme: ThemeConfig = {
  primary: "#176b53",
  secondary: "#dff3ec",
  pageBackground: "#ffffff",
  surface: "#f6faf8",
  text: "#17332a",
  mutedText: "#70827a",
  border: "#e5eee9",
  accent: "#e7f5ef",
  fontFamily: "system",
  borderRadius: 18,
  containerWidth: 1200,
  shadow: "soft",
};

const knownSectionTypes = new Set<string>(SUPPORTED_SECTION_TYPES);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredString(value: unknown, path: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Invalid template: ${path} must be a non-empty string.`);
  }
  return value;
}

function requiredArray(value: unknown, path: string): unknown[] {
  if (!Array.isArray(value)) {
    throw new Error(`Invalid template: ${path} must be an array.`);
  }
  return value;
}

function requiredObject(
  value: unknown,
  path: string,
): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new Error(`Invalid template: ${path} must be an object.`);
  }
  return value;
}

function validatedNumber(
  value: unknown,
  path: string,
  minimum: number,
  maximum: number,
): number {
  if (
    typeof value !== "number" ||
    !Number.isSafeInteger(value) ||
    value < minimum ||
    value > maximum
  ) {
    throw new Error(
      `Invalid template: ${path} must be an integer between ${minimum} and ${maximum}.`,
    );
  }
  return value;
}

function stringArray(value: unknown, path: string): string[] {
  return requiredArray(value, path).map((item, index) =>
    requiredString(item, `${path}[${index}]`),
  );
}

function validateTheme(value: unknown): ThemeConfig {
  if (!isRecord(value)) {
    return { ...defaultTheme };
  }

  const color = (
    key:
      | "primary"
      | "secondary"
      | "pageBackground"
      | "surface"
      | "text"
      | "mutedText"
      | "border"
      | "accent",
  ): string => {
    const candidate = value[key];
    return typeof candidate === "string" &&
      /^#[0-9a-fA-F]{6}$/.test(candidate)
      ? candidate
      : defaultTheme[key];
  };
  const fontFamily =
    value.fontFamily === "geometric" ? "geometric" : "system";
  const borderRadius =
    typeof value.borderRadius === "number" &&
    Number.isFinite(value.borderRadius) &&
    value.borderRadius >= 4 &&
    value.borderRadius <= 32
      ? value.borderRadius
      : defaultTheme.borderRadius;
  const containerWidth =
    typeof value.containerWidth === "number" &&
    Number.isFinite(value.containerWidth) &&
    value.containerWidth >= 960 &&
    value.containerWidth <= 1600
      ? value.containerWidth
      : defaultTheme.containerWidth;
  const shadow =
    value.shadow === "medium" || value.shadow === "none"
      ? value.shadow
      : "soft";

  return {
    primary: color("primary"),
    secondary: color("secondary"),
    pageBackground: color("pageBackground"),
    surface: color("surface"),
    text: color("text"),
    mutedText: color("mutedText"),
    border: color("border"),
    accent: color("accent"),
    fontFamily,
    borderRadius,
    containerWidth,
    shadow,
  };
}

function validateSections(value: unknown): BlueprintSection[] {
  const ids = new Set<string>();
  return requiredArray(value, "pages.home.sections").map((item, index) => {
    const path = `pages.home.sections[${index}]`;
    const section = requiredObject(item, path);
    const id = requiredString(section.id, `${path}.id`);
    const type = requiredString(section.type, `${path}.type`);
    if (ids.has(id)) {
      throw new Error(`Invalid template: section id "${id}" is duplicated.`);
    }
    ids.add(id);

    if (!knownSectionTypes.has(type)) {
      return { id, type, content: section.content };
    }

    const content = requiredObject(section.content, `${path}.content`);
    const text = (key: string) =>
      requiredString(content[key], `${path}.content.${key}`);
    const objectList = (key: string) =>
      requiredArray(content[key], `${path}.content.${key}`).map(
        (entry, itemIndex) =>
          requiredObject(entry, `${path}.content.${key}[${itemIndex}]`),
      );
    const links = (items: unknown[], itemPath: string) =>
      items.map((entry, itemIndex) => {
        const link = requiredObject(entry, `${itemPath}[${itemIndex}]`);
        return {
          label: requiredString(link.label, `${itemPath}[${itemIndex}].label`),
          href: requiredString(link.href, `${itemPath}[${itemIndex}].href`),
        };
      });

    switch (type) {
      case "announcement":
        return {
          id,
          type,
          content: {
            message: text("message"),
            linkLabel: text("linkLabel"),
            href: text("href"),
          },
        };
      case "header":
        return {
          id,
          type,
          content: {
            searchPlaceholder: text("searchPlaceholder"),
            demoNote: text("demoNote"),
          },
        };
      case "navigation":
        return {
          id,
          type,
          content: {
            note: text("note"),
            links: objectList("links").map((link, itemIndex) => ({
              label: requiredString(
                link.label,
                `${path}.content.links[${itemIndex}].label`,
              ),
              href: requiredString(
                link.href,
                `${path}.content.links[${itemIndex}].href`,
              ),
              ...(typeof link.categoryId === "string"
                ? { categoryId: link.categoryId }
                : {}),
            })),
          },
        };
      case "hero": {
        const action = (key: "primaryCta" | "secondaryCta") => {
          const item = requiredObject(
            content[key],
            `${path}.content.${key}`,
          );
          return {
            label: requiredString(item.label, `${path}.content.${key}.label`),
            href: requiredString(item.href, `${path}.content.${key}.href`),
          };
        };
        return {
          id,
          type,
          content: {
            eyebrow: text("eyebrow"),
            title: text("title"),
            description: text("description"),
            primaryCta: action("primaryCta"),
            secondaryCta: action("secondaryCta"),
            image: text("image"),
            imageAlt: text("imageAlt"),
            stampTitle: text("stampTitle"),
            stampDescription: text("stampDescription"),
            sideNote: text("sideNote"),
            proofPoints: stringArray(
              content.proofPoints,
              `${path}.content.proofPoints`,
            ),
          },
        };
      }
      case "categories":
        return {
          id,
          type,
          content: {
            title: text("title"),
            description: text("description"),
            eyebrow: text("eyebrow"),
            clearFilterLabel: text("clearFilterLabel"),
            items: objectList("items").map((item, itemIndex) => ({
              id: requiredString(
                item.id,
                `${path}.content.items[${itemIndex}].id`,
              ),
              label: requiredString(
                item.label,
                `${path}.content.items[${itemIndex}].label`,
              ),
              description: requiredString(
                item.description,
                `${path}.content.items[${itemIndex}].description`,
              ),
              icon: requiredString(
                item.icon,
                `${path}.content.items[${itemIndex}].icon`,
              ),
              color: requiredString(
                item.color,
                `${path}.content.items[${itemIndex}].color`,
              ),
            })),
          },
        };
      case "product-grid":
        if (content.variant !== "featured" && content.variant !== "bestsellers") {
          throw new Error(
            `Invalid template: ${path}.content.variant is not supported.`,
          );
        }
        if (typeof content.showControls !== "boolean") {
          throw new Error(
            `Invalid template: ${path}.content.showControls must be a boolean.`,
          );
        }
        return {
          id,
          type,
          content: {
            title: text("title"),
            eyebrow: text("eyebrow"),
            description: text("description"),
            productIds: stringArray(
              content.productIds,
              `${path}.content.productIds`,
            ),
            variant: content.variant,
            showControls: content.showControls,
            stockInLabel: text("stockInLabel"),
            stockLowLabel: text("stockLowLabel"),
            emptyTitle: text("emptyTitle"),
            emptyDescription: text("emptyDescription"),
            emptyButtonLabel: text("emptyButtonLabel"),
            activeFilterPrefix: text("activeFilterPrefix"),
            clearFilterLabel: text("clearFilterLabel"),
          },
        };
      case "promotion":
        return {
          id,
          type,
          content: {
            eyebrow: text("eyebrow"),
            title: text("title"),
            description: text("description"),
            ctaLabel: text("ctaLabel"),
            href: text("href"),
            image: text("image"),
            imageAlt: text("imageAlt"),
            code: text("code"),
            discountPercent: validatedNumber(
              content.discountPercent,
              `${path}.content.discountPercent`,
              1,
              100,
            ),
            minimumOrder: validatedNumber(
              content.minimumOrder,
              `${path}.content.minimumOrder`,
              0,
              Number.MAX_SAFE_INTEGER,
            ),
            couponFieldLabel: text("couponFieldLabel"),
            couponSuccessMessage: text("couponSuccessMessage"),
            couponMinimumMessage: text("couponMinimumMessage"),
            couponInvalidMessage: text("couponInvalidMessage"),
            codeLabel: text("codeLabel"),
            imageStampLineOne: text("imageStampLineOne"),
            imageStampLineTwo: text("imageStampLineTwo"),
          },
        };
      case "wellness":
        return {
          id,
          type,
          content: {
            title: text("title"),
            eyebrow: text("eyebrow"),
            description: text("description"),
            cardEyebrows: (() => {
              const labels = stringArray(
                content.cardEyebrows,
                `${path}.content.cardEyebrows`,
              );
              if (labels.length !== 2) {
                throw new Error(
                  `Invalid template: ${path}.content.cardEyebrows must contain two labels.`,
                );
              }
              return [labels[0], labels[1]] as [string, string];
            })(),
            linkLabel: text("linkLabel"),
            items: objectList("items").map((item, itemIndex) => ({
              title: requiredString(
                item.title,
                `${path}.content.items[${itemIndex}].title`,
              ),
              description: requiredString(
                item.description,
                `${path}.content.items[${itemIndex}].description`,
              ),
              image: requiredString(
                item.image,
                `${path}.content.items[${itemIndex}].image`,
              ),
              imageAlt: requiredString(
                item.imageAlt,
                `${path}.content.items[${itemIndex}].imageAlt`,
              ),
              href: requiredString(
                item.href,
                `${path}.content.items[${itemIndex}].href`,
              ),
            })),
          },
        };
      case "benefits":
        return {
          id,
          type,
          content: {
            items: objectList("items").map((item, itemIndex) => ({
              title: requiredString(
                item.title,
                `${path}.content.items[${itemIndex}].title`,
              ),
              description: requiredString(
                item.description,
                `${path}.content.items[${itemIndex}].description`,
              ),
              icon: requiredString(
                item.icon,
                `${path}.content.items[${itemIndex}].icon`,
              ),
            })),
          },
        };
      case "newsletter":
        return {
          id,
          type,
          content: {
            title: text("title"),
            eyebrow: text("eyebrow"),
            description: text("description"),
            buttonLabel: text("buttonLabel"),
            emailLabel: text("emailLabel"),
            emailPlaceholder: text("emailPlaceholder"),
            footnote: text("footnote"),
            successTitle: text("successTitle"),
            successDescription: text("successDescription"),
          },
        };
      case "footer": {
        const contact = requiredObject(
          content.contact,
          `${path}.content.contact`,
        );
        return {
          id,
          type,
          content: {
            brandDescription: text("brandDescription"),
            contact: {
              phone: requiredString(
                contact.phone,
                `${path}.content.contact.phone`,
              ),
              email: requiredString(
                contact.email,
                `${path}.content.contact.email`,
              ),
              address: requiredString(
                contact.address,
                `${path}.content.contact.address`,
              ),
            },
            linkGroups: objectList("linkGroups").map((group, groupIndex) => ({
              title: requiredString(
                group.title,
                `${path}.content.linkGroups[${groupIndex}].title`,
              ),
              links: links(
                requiredArray(
                  group.links,
                  `${path}.content.linkGroups[${groupIndex}].links`,
                ),
                `${path}.content.linkGroups[${groupIndex}].links`,
              ),
            })),
            copyright: text("copyright"),
            demoDisclaimer: text("demoDisclaimer"),
          },
        };
      }
      default:
        throw new Error(
          `Invalid template: unsupported section type "${type}".`,
        );
    }
  });
}

export function validateTemplate(value: unknown): StoreTemplate {
  if (!isRecord(value) || !isRecord(value.metadata) || !isRecord(value.store)) {
    throw new Error("Invalid template: metadata and store objects are required.");
  }
  if (!isRecord(value.pages) || !isRecord(value.pages.home)) {
    throw new Error("Invalid template: pages.home is required.");
  }

  const metadata = value.metadata;
  const store = value.store;
  const home = value.pages.home;
  if (store.demo !== true) {
    throw new Error("Invalid template: this storefront must be labeled as a demo.");
  }
  const locale = requiredString(store.locale, "store.locale");
  const currency = requiredString(store.currency, "store.currency");
  const freeDeliveryMinimum =
    store.freeDeliveryMinimum === undefined
      ? 799
      : validatedNumber(
          store.freeDeliveryMinimum,
          "store.freeDeliveryMinimum",
          0,
          Number.MAX_SAFE_INTEGER,
        );
  const cartCopyRecord = requiredObject(store.cartCopy, "store.cartCopy");
  const cartCopy = {
    emptyTitle: requiredString(
      cartCopyRecord.emptyTitle,
      "store.cartCopy.emptyTitle",
    ),
    emptyDescription: requiredString(
      cartCopyRecord.emptyDescription,
      "store.cartCopy.emptyDescription",
    ),
    emptyButtonLabel: requiredString(
      cartCopyRecord.emptyButtonLabel,
      "store.cartCopy.emptyButtonLabel",
    ),
    checkoutNoticeTitle: requiredString(
      cartCopyRecord.checkoutNoticeTitle,
      "store.cartCopy.checkoutNoticeTitle",
    ),
    checkoutNotice: requiredString(
      cartCopyRecord.checkoutNotice,
      "store.cartCopy.checkoutNotice",
    ),
    confirmationTitle: requiredString(
      cartCopyRecord.confirmationTitle,
      "store.cartCopy.confirmationTitle",
    ),
    confirmationDescription: requiredString(
      cartCopyRecord.confirmationDescription,
      "store.cartCopy.confirmationDescription",
    ),
    loadingTitle: requiredString(
      cartCopyRecord.loadingTitle,
      "store.cartCopy.loadingTitle",
    ),
    loadingDescription: requiredString(
      cartCopyRecord.loadingDescription,
      "store.cartCopy.loadingDescription",
    ),
    totalsDisclaimer: requiredString(
      cartCopyRecord.totalsDisclaimer,
      "store.cartCopy.totalsDisclaimer",
    ),
    checkoutFootnote: requiredString(
      cartCopyRecord.checkoutFootnote,
      "store.cartCopy.checkoutFootnote",
    ),
    freeDeliveryUnlocked: requiredString(
      cartCopyRecord.freeDeliveryUnlocked,
      "store.cartCopy.freeDeliveryUnlocked",
    ),
    freeDeliveryRemaining: requiredString(
      cartCopyRecord.freeDeliveryRemaining,
      "store.cartCopy.freeDeliveryRemaining",
    ),
    bagEyebrow: requiredString(
      cartCopyRecord.bagEyebrow,
      "store.cartCopy.bagEyebrow",
    ),
    checkoutEyebrow: requiredString(
      cartCopyRecord.checkoutEyebrow,
      "store.cartCopy.checkoutEyebrow",
    ),
    completeEyebrow: requiredString(
      cartCopyRecord.completeEyebrow,
      "store.cartCopy.completeEyebrow",
    ),
    bagTitle: requiredString(
      cartCopyRecord.bagTitle,
      "store.cartCopy.bagTitle",
    ),
    checkoutTitle: requiredString(
      cartCopyRecord.checkoutTitle,
      "store.cartCopy.checkoutTitle",
    ),
    completeTitle: requiredString(
      cartCopyRecord.completeTitle,
      "store.cartCopy.completeTitle",
    ),
    completeButtonLabel: requiredString(
      cartCopyRecord.completeButtonLabel,
      "store.cartCopy.completeButtonLabel",
    ),
    continueCheckoutLabel: requiredString(
      cartCopyRecord.continueCheckoutLabel,
      "store.cartCopy.continueCheckoutLabel",
    ),
    placeOrderLabel: requiredString(
      cartCopyRecord.placeOrderLabel,
      "store.cartCopy.placeOrderLabel",
    ),
  };
  if (!/^[A-Z]{3}$/.test(currency)) {
    throw new Error("Invalid template: store.currency must be an ISO 4217 code.");
  }
  try {
    new Intl.NumberFormat(locale, { style: "currency", currency }).format(0);
  } catch (error) {
    if (error instanceof RangeError) {
      throw new Error(
        "Invalid template: store.locale and store.currency must be supported values.",
      );
    }
    throw error;
  }

  return {
    metadata: {
      id: requiredString(metadata.id, "metadata.id"),
      name: requiredString(metadata.name, "metadata.name"),
      version: requiredString(metadata.version, "metadata.version"),
      description: requiredString(metadata.description, "metadata.description"),
    },
    store: {
      name: requiredString(store.name, "store.name"),
      tagline: requiredString(store.tagline, "store.tagline"),
      locale,
      currency,
      demo: store.demo === true,
      freeDeliveryMinimum,
      cartCopy,
    },
    theme: validateTheme(value.theme),
    pages: {
      home: {
        title: requiredString(home.title, "pages.home.title"),
        description: requiredString(
          home.description,
          "pages.home.description",
        ),
        sections: validateSections(home.sections),
      },
    },
  };
}

export const template = validateTemplate(rawTemplate);
