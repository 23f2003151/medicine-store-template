import type { BenefitsSection } from "@/types/template";
import { SectionShell } from "@/components/Storefront";
import { Icon } from "@/components/ui/Icon";

export function BenefitsStrip({ section }: { section: BenefitsSection }) {
  return (
    <SectionShell id={section.id} className="benefits-section">
      <div className="benefits-grid">
        {section.content.items.map((item) => (
          <div className="benefit-item" key={item.title}>
            <span className="benefit-icon">
              <Icon name={item.icon} size={22} />
            </span>
            <span>
              <strong>{item.title}</strong>
              <small>{item.description}</small>
            </span>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
