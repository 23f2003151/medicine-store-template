import type { WellnessSection } from "@/types/template";
import { SectionShell } from "@/components/Storefront";
import { Icon } from "@/components/ui/Icon";

export function WellnessCollection({
  section,
}: {
  section: WellnessSection;
}) {
  return (
    <SectionShell id={section.id} className="wellness-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{section.content.eyebrow}</p>
          <h2>{section.content.title}</h2>
          <p className="section-description">{section.content.description}</p>
        </div>
      </div>
      <div className="wellness-grid">
        {section.content.items.map((item, index) => (
          <a
            className={`wellness-card wellness-card-${index + 1}`}
            href={item.href}
            key={item.title}
          >
            <div
              className="wellness-image"
              role="img"
              aria-label={item.imageAlt}
              style={{ backgroundImage: `url("${item.image}")` }}
            />
            <div className="wellness-card-copy">
              <p className="eyebrow">{section.content.cardEyebrows[index]}</p>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span className="wellness-link">
                {section.content.linkLabel} <Icon name="arrow-right" size={17} />
              </span>
            </div>
          </a>
        ))}
      </div>
    </SectionShell>
  );
}
