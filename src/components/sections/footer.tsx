import Link from "next/link";
import type { FooterSection } from "@/types/template";
import { SectionShell } from "@/components/Storefront";
import { Icon } from "@/components/ui/Icon";

export function StoreFooter({
  section,
  storeName,
  storeTagline,
}: {
  section: FooterSection;
  storeName: string;
  storeTagline: string;
}) {
  const { content } = section;

  return (
    <footer id={section.id} className="footer-section">
      <SectionShell className="footer-main">
        <div className="footer-brand">
          <Link href="/" className="brand-mark">
            <span className="brand-symbol">
              <Icon name="plus" size={21} />
            </span>
            <span className="brand-copy">
              <span className="brand-name">{storeName}</span>
              <span className="brand-tagline">{storeTagline}</span>
            </span>
          </Link>
          <p>{content.brandDescription}</p>
          <div className="footer-contact">
            <a href={`tel:${content.contact.phone.replaceAll(" ", "")}`}>
              {content.contact.phone}
            </a>
            <a href={`mailto:${content.contact.email}`}>
              {content.contact.email}
            </a>
            <span>{content.contact.address}</span>
          </div>
        </div>
        {content.linkGroups.map((group) => (
          <div className="footer-link-group" key={group.title}>
            <h3>{group.title}</h3>
            <ul>
              {group.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </SectionShell>
      <SectionShell className="footer-bottom">
        <p>{content.copyright}</p>
        <p className="footer-disclaimer">
          {content.demoDisclaimer}
        </p>
        <a href="#top" className="back-to-top">
          Back to top <Icon name="arrow-up-right" size={15} />
        </a>
      </SectionShell>
    </footer>
  );
}
