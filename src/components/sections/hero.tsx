import type { HeroSection } from "@/types/template";
import { SectionShell } from "@/components/Storefront";
import { Icon } from "@/components/ui/Icon";

export function Hero({ section }: { section: HeroSection }) {
  const { content } = section;

  return (
    <SectionShell className="hero-section">
      <div className="hero-copy">
        <p className="eyebrow">
          <span className="eyebrow-mark" />
          {content.eyebrow}
        </p>
        <h1>{content.title}</h1>
        <p className="hero-description">{content.description}</p>
        <div className="hero-actions">
          <a className="button button-primary" href={content.primaryCta.href}>
            {content.primaryCta.label}
            <Icon name="arrow-right" size={18} />
          </a>
          <a className="button button-quiet" href={content.secondaryCta.href}>
            {content.secondaryCta.label}
          </a>
        </div>
        <ul className="hero-proof-points">
          {content.proofPoints.map((point) => (
            <li key={point}>
              <span className="proof-check">
                <Icon name="check" size={13} />
              </span>
              {point}
            </li>
          ))}
        </ul>
      </div>
      <div className="hero-artwork">
        <div
          className="hero-image"
          role="img"
          aria-label={content.imageAlt}
          style={{ backgroundImage: `url("${content.image}")` }}
        />
        <div className="hero-image-wash" />
        <div className="hero-stamp">
          <span className="stamp-icon">
            <Icon name="heart" size={21} />
          </span>
          <span>
            <strong>{content.stampTitle}</strong>
            <small>{content.stampDescription}</small>
          </span>
        </div>
        <div className="hero-side-note">{content.sideNote}</div>
      </div>
    </SectionShell>
  );
}
