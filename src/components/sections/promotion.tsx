import type { PromotionSection } from "@/types/template";
import { SectionShell } from "@/components/Storefront";
import { Icon } from "@/components/ui/Icon";

export function PromotionBanner({
  section,
}: {
  section: PromotionSection;
}) {
  const { content } = section;

  return (
    <SectionShell className="promotion-section">
      <div className="promotion-panel">
        <div className="promotion-copy">
          <p className="eyebrow">{content.eyebrow}</p>
          <h2>{content.title}</h2>
          <p>{content.description}</p>
          <div className="promotion-actions">
            <a className="button button-white" href={content.href}>
              {content.ctaLabel}
              <Icon name="arrow-right" size={18} />
            </a>
            <span>
              {content.codeLabel} <strong>{content.code}</strong>
            </span>
          </div>
        </div>
        <div
          className="promotion-image"
          role="img"
          aria-label={content.imageAlt}
          style={{ backgroundImage: `url("${content.image}")` }}
        >
          <div className="promotion-image-label">
            <span>{content.imageStampLineOne}</span>
            <strong>{content.imageStampLineTwo}</strong>
          </div>
        </div>
        <div className="promotion-decoration" aria-hidden="true">
          {content.discountPercent}%
        </div>
      </div>
    </SectionShell>
  );
}
