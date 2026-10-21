import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { SectionRenderer } from "@/components/SectionRenderer";
import type { HeroSection } from "@/types/template";
import { template } from "@/lib/template";

const hero = template.pages.home.sections.find(
  (section): section is HeroSection => section.type === "hero",
);

if (!hero) {
  throw new Error("The test blueprint must contain a hero section.");
}

describe("SectionRenderer", () => {
  it("renders supported sections in blueprint order", () => {
    const first: HeroSection = {
      ...hero,
      id: "first-hero",
      content: { ...hero.content, title: "First blueprint section" },
    };
    const second: HeroSection = {
      ...hero,
      id: "second-hero",
      content: { ...hero.content, title: "Second blueprint section" },
    };
    const markup = renderToStaticMarkup(
      createElement(SectionRenderer, {
        sections: [first, second],
        storeName: template.store.name,
        storeTagline: template.store.tagline,
      }),
    );
    assert.ok(
      markup.indexOf("First blueprint section") <
        markup.indexOf("Second blueprint section"),
    );
  });

  it("renders a safe fallback for an unknown section", () => {
    const markup = renderToStaticMarkup(
      createElement(SectionRenderer, {
        sections: [{ id: "future", type: "future-widget" }],
        storeName: template.store.name,
        storeTagline: template.store.tagline,
      }),
    );
    assert.ok(
      markup.includes(
        "unsupported section: <strong>future-widget</strong>",
      ),
    );
  });
});
