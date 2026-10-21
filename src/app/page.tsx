import type { Metadata } from "next";
import { Storefront } from "@/components/Storefront";
import { template } from "@/lib/template";

export const metadata: Metadata = {
  title: template.pages.home.title,
  description: template.pages.home.description,
};

export default function Home() {
  return (
    <Storefront
      theme={template.theme}
      store={template.store}
      sections={template.pages.home.sections}
    />
  );
}
