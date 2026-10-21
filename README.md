# MediCare Pharmacy — storefront template

A polished, responsive Indian pharmacy storefront demo built with Next.js 15 App Router, TypeScript, and Tailwind CSS 4. It uses fictional products and browser-local state only. It has no API, database, prescription workflow, patient data, or real payment processing. The storefront is a design and development demo, not medical advice; it does not claim that a product is prescribed, approved, or suitable for a particular person.

## Features

- Responsive storefront with announcement bar, search, navigation, hero, categories, product collections, offers, wellness content, benefits, newsletter, and footer.
- Blueprint-configurable store identity, content, theme, delivery threshold, coupon, and section ordering.
- Search, category filtering, sorting, stock filtering, cart quantity controls, demo coupon, and simulated checkout.
- Fictional mock catalog with INR pricing and external product photography.
- Safe fallback for unsupported blueprint section types and validated runtime theme tokens.

## Screenshots

<!-- Add desktop and mobile storefront screenshots here before publishing. -->

| Desktop | Mobile |
| --- | --- |
| _Screenshot placeholder_ | _Screenshot placeholder_ |

## Requirements and local development

Requires Node.js 20.9 or newer and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Available project scripts:

```bash
npm test
npm run lint
npm run typecheck
npm run build
npm run start
```

- `npm test` runs the focused Node.js test suite using `tsx`.
- `npm run lint` runs ESLint.
- `npm run typecheck` runs TypeScript with no output.
- `npm run build` creates the optimized Next.js production build.
- `npm run start` serves the production build; run it after `npm run build`.

## Architecture

- `templates/medicine-store/template.json` is the JSON blueprint and source of truth for store identity, theme tokens, page metadata, ordered page sections, and store-specific editorial and demo copy.
- `src/types/template.ts` defines the typed blueprint and section content. `src/lib/template.ts` validates the JSON, checks required fields and unique section IDs, and applies safe defaults to configurable theme values.
- `src/app/page.tsx` loads the validated blueprint and passes it to `src/components/Storefront.tsx`; the page does not define section order.
- `src/components/SectionRenderer.tsx` renders each blueprint section in its declared order using an explicit typed switch. Unsupported section types produce a safe visible fallback; they are not dynamically evaluated.
- `src/lib/theme.ts` converts validated theme configuration into CSS custom properties consumed by the storefront styles.
- `src/components/sections/` contains reusable section presentation. `src/components/products/` and `src/components/cart/` contain product and cart UI.
- `src/components/store/StoreProvider.tsx` shares client-side search, category filtering, cart state, and feedback.
- `src/data/products.ts` contains the fictional product catalog. Each product has a `categoryId`; its visible label is resolved from the categories in the blueprint, keeping search, filtering, product cards, and cart labels consistent.
- `src/lib/cart.ts` contains pure coupon and cart calculations, with corresponding tests.
- The footer's phone and address are nonfunctional demo placeholders; the `.example` email domain is reserved for documentation and examples.

## Customize the storefront

### Store content and section order

Edit `templates/medicine-store/template.json` to customize the store name and tagline, page title and description, section headings and copy, navigation, categories, demo disclaimers, newsletter text, promotion messaging, and cart/checkout labels.

The `pages.home.sections` array controls page order. Move section objects to reorder them, remove an object to omit that section, or add an object using a supported section type and a unique `id`. The renderer follows that array. To add a new section type, update its TypeScript content type and validation, implement a reusable section component, and add an explicit case to `SectionRenderer`. Invalid content for a supported section fails validation with a descriptive error.

The categories section defines the category IDs and labels. Keep product `categoryId` values in `src/data/products.ts` aligned with those category IDs. Product names, descriptions, prices, images, stock status, and badges are maintained in the mock catalog rather than duplicated in the blueprint.

### Theme tokens

Change the `theme` object in `templates/medicine-store/template.json`. It supports six-digit hex colors (`primary`, `secondary`, `pageBackground`, `surface`, `text`, `mutedText`, `border`, and `accent`), an allow-listed `fontFamily` (`system` or `geometric`), a bounded `borderRadius` and `containerWidth`, and an allow-listed shadow (`soft`, `medium`, or `none`).

Validated theme values are applied as CSS custom properties on the storefront wrapper. Section components use these shared variables, so changing theme tokens does not require editing each component. Invalid configurable values fall back to safe defaults.

### Products, delivery, and offers

Edit `src/data/products.ts` to update the fictional product catalog and INR prices. The blueprint's `store.freeDeliveryMinimum` configures the free-delivery threshold. The promotion section's `code`, `discountPercent`, and `minimumOrder` configure the local demo coupon. Neither setting creates a real fulfilment or payment flow.

## Tests and validation

`npm test` covers blueprint parsing and defaults, theme validation, section ordering and unknown-section fallback, category label consistency, coupon eligibility, and cart totals. Use the scripts above to run tests, lint, typecheck, and the production build locally.

## Demo-only checkout and limitations

Checkout is simulated entirely in the browser. It collects no personal or health information, sends no order, and does not process real payments. The confirmation is only a local demo state. Newsletter submission is also local: no email is saved or sent. Prescription products are not offered, and the demo does not provide medical advice or prescription fulfilment.

## Dependency advisory

The full development dependency audit currently reports five high-severity findings for the `braces` advisory (GHSA-vfj7-8cjw-p6xm). The installed dependency chain is `eslint-config-next@15.5.28` → `@next/eslint-plugin-next@15.5.28` → `fast-glob@3.3.1` → `micromatch@4.0.8` → `braces@3.0.3`. The npm audit remediation available in this project proposes downgrading `eslint-config-next` to 14.2.35, which is incompatible with keeping the lint configuration aligned to Next.js 15; that breaking downgrade was not applied. The production-only audit reports no vulnerabilities because this chain is in development tooling. Re-run `npm audit` after a patched `braces` release or compatible Next.js ESLint dependency update becomes available; the full audit is not clean yet.

## Deployment

Run `npm run build`, then deploy to a hosting platform that supports Next.js 15, or run `npm run start` after building. The sample product imagery uses external Unsplash URLs and requires network access. Replace the URLs with local assets if you need a fully self-contained image set.
