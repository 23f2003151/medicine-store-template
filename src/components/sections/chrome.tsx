"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type {
  AnnouncementSection,
  HeaderSection,
  NavigationSection,
} from "@/types/template";
import { useStore } from "@/components/store/StoreProvider";
import { SectionShell } from "@/components/Storefront";
import { Icon } from "@/components/ui/Icon";
import { formatPrice } from "@/data/products";

export function AnnouncementBar({ section }: { section: AnnouncementSection }) {
  const { freeDeliveryMinimum, locale, currency } = useStore();
  return (
    <div className="announcement-bar">
      <p>
        {section.content.message.replace(
          "{minimum}",
          formatPrice(freeDeliveryMinimum, locale, currency),
        )}
      </p>
      <a href={section.content.href}>
        {section.content.linkLabel}
        <Icon name="arrow-right" size={15} />
      </a>
    </div>
  );
}

export function StoreHeader({
  section,
  storeName,
  storeTagline,
}: {
  section: HeaderSection;
  storeName: string;
  storeTagline: string;
}) {
  const {
    search,
    setSearch,
    cartCount,
    openCart,
    mobileNavOpen,
    setMobileNavOpen,
  } = useStore();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function focusSearch(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  return (
    <header className="store-header">
      <div className="header-inner">
        <button
          type="button"
          className="icon-button mobile-menu-toggle"
          aria-label={mobileNavOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileNavOpen}
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
        >
          <Icon name={mobileNavOpen ? "close" : "menu"} size={22} />
        </button>
        <Link href="/" className="brand-mark" aria-label={storeName}>
          <span className="brand-symbol">
            <Icon name="plus" size={21} />
          </span>
          <span className="brand-copy">
            <span className="brand-name">{storeName}</span>
            <span className="brand-tagline">{storeTagline}</span>
          </span>
        </Link>
        <form
          className="search-form"
          role="search"
          onSubmit={(event) => event.preventDefault()}
        >
          <Icon name="search" size={20} />
          <label className="sr-only" htmlFor="store-search">
            Search products
          </label>
          <input
            id="store-search"
            ref={searchInputRef}
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={section.content.searchPlaceholder}
          />
          <kbd>Ctrl / ⌘ K</kbd>
        </form>
        <div className="header-actions">
          <a className="account-link" href="#footer">
            <Icon name="user" size={19} />
            <span>Account</span>
          </a>
          <button
            type="button"
            className="cart-button"
            onClick={openCart}
            aria-label={`Open bag, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
          >
            <Icon name="shopping-bag" size={20} />
            <span className="cart-button-label">Bag</span>
            <span className="cart-count">{cartCount}</span>
          </button>
        </div>
      </div>
      <div className="header-demo-note">
        <span className="demo-dot" />
        {section.content.demoNote}
      </div>
    </header>
  );
}

export function StoreNavigation({
  section,
}: {
  section: NavigationSection;
}) {
  const { mobileNavOpen, setMobileNavOpen, setCategoryFilter } = useStore();

  return (
    <SectionShell className={`navigation-shell${mobileNavOpen ? " is-open" : ""}`}>
      <nav className="navigation-inner" aria-label="Main navigation">
        {section.content.links.map((link) => (
          <a
            href={link.href}
            key={link.label}
            onClick={() => {
              setCategoryFilter(link.categoryId ?? null);
              setMobileNavOpen(false);
            }}
          >
            {link.label}
          </a>
        ))}
        <span className="navigation-note">
          <Icon name="leaf" size={16} />
          {section.content.note}
        </span>
      </nav>
      {mobileNavOpen && (
        <button
          type="button"
          className="mobile-nav-scrim"
          aria-label="Close navigation"
          onClick={() => setMobileNavOpen(false)}
        />
      )}
    </SectionShell>
  );
}
