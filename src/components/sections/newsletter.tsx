"use client";

import { useState, type FormEvent } from "react";
import type { NewsletterSection } from "@/types/template";
import { SectionShell } from "@/components/Storefront";
import { Icon } from "@/components/ui/Icon";

export function Newsletter({ section }: { section: NewsletterSection }) {
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubscribed(true);
  }

  return (
    <SectionShell className="newsletter-section">
      <div className="newsletter-copy">
        <span className="newsletter-icon">
          <Icon name="sparkles" size={23} />
        </span>
        <div>
          <p className="eyebrow">{section.content.eyebrow}</p>
          <h2>{section.content.title}</h2>
          <p>{section.content.description}</p>
        </div>
      </div>
      {subscribed ? (
        <div className="newsletter-success" role="status">
          <span className="success-icon">
            <Icon name="check" size={19} />
          </span>
          <span>
            <strong>{section.content.successTitle}</strong>
            <small>{section.content.successDescription}</small>
          </span>
        </div>
      ) : (
        <form className="newsletter-form" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="newsletter-email">
            {section.content.emailLabel}
          </label>
          <input
            id="newsletter-email"
            type="email"
            placeholder={section.content.emailPlaceholder}
            autoComplete="email"
            required
          />
          <button className="button button-primary" type="submit">
            {section.content.buttonLabel}
            <Icon name="arrow-right" size={17} />
          </button>
          <small>{section.content.footnote}</small>
        </form>
      )}
    </SectionShell>
  );
}
