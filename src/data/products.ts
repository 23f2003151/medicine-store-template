export interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  imageAlt: string;
  badge?: string;
  stock: "in-stock" | "low-stock";
  featured: boolean;
  bestseller: boolean;
}

export const products: Product[] = [
  {
    id: "daily-vitality",
    name: "Daily Vitality Complex",
    description: "Everyday wellness blend · 30 tablets",
    categoryId: "wellness",
    price: 549,
    compareAtPrice: 699,
    rating: 4.8,
    reviewCount: 128,
    image:
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=85",
    imageAlt: "Amber bottle with a minimalist wellness label",
    badge: "Bestseller",
    stock: "in-stock",
    featured: true,
    bestseller: true,
  },
  {
    id: "radiance-sunscreen",
    name: "Daily Radiance SPF 50",
    description: "Lightweight face sunscreen · 50 ml",
    categoryId: "personal-care",
    price: 429,
    compareAtPrice: 525,
    rating: 4.9,
    reviewCount: 96,
    image:
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=85",
    imageAlt: "Softly lit skincare bottle against a neutral background",
    badge: "Trending",
    stock: "in-stock",
    featured: true,
    bestseller: true,
  },
  {
    id: "gentle-handwash",
    name: "Gentle Care Hand Wash",
    description: "Plant-based everyday hand wash · 250 ml",
    categoryId: "personal-care",
    price: 199,
    compareAtPrice: 249,
    rating: 4.7,
    reviewCount: 74,
    image:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=85",
    imageAlt: "Natural personal-care bottle on a bright background",
    stock: "in-stock",
    featured: true,
    bestseller: false,
  },
  {
    id: "comfort-bandages",
    name: "Comfort Fabric Bandages",
    description: "Flexible fabric strips · Pack of 30",
    categoryId: "first-aid",
    price: 129,
    rating: 4.6,
    reviewCount: 53,
    image:
      "https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=800&q=85",
    imageAlt: "Organized first-aid items ready for everyday use",
    stock: "low-stock",
    featured: true,
    bestseller: false,
  },
  {
    id: "calm-moisturizer",
    name: "Calm & Restore Moisturizer",
    description: "Fragrance-free daily hydration · 100 ml",
    categoryId: "personal-care",
    price: 349,
    compareAtPrice: 399,
    rating: 4.8,
    reviewCount: 82,
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=85",
    imageAlt: "Minimal moisturizer jar in soft natural light",
    badge: "New",
    stock: "in-stock",
    featured: true,
    bestseller: false,
  },
  {
    id: "digital-thermometer",
    name: "Everyday Digital Thermometer",
    description: "Easy-read home health essential",
    categoryId: "health-tools",
    price: 299,
    compareAtPrice: 375,
    rating: 4.7,
    reviewCount: 67,
    image:
      "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=800&q=85",
    imageAlt: "Simple digital home health tool",
    stock: "in-stock",
    featured: false,
    bestseller: true,
  },
  {
    id: "hydration-sachets",
    name: "Daily Hydration Sachets",
    description: "Electrolyte drink mix · Pack of 10",
    categoryId: "wellness",
    price: 249,
    rating: 4.5,
    reviewCount: 41,
    image:
      "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?auto=format&fit=crop&w=800&q=85",
    imageAlt: "Fresh wellness drink mix and citrus",
    stock: "in-stock",
    featured: false,
    bestseller: true,
  },
  {
    id: "soothing-lip-balm",
    name: "Soothing Everyday Lip Balm",
    description: "Comforting moisture · 10 g",
    categoryId: "personal-care",
    price: 149,
    compareAtPrice: 179,
    rating: 4.6,
    reviewCount: 58,
    image:
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=85",
    imageAlt: "Small personal-care balm on a soft neutral background",
    stock: "low-stock",
    featured: false,
    bestseller: true,
  },
];

export function formatPrice(
  amount: number,
  locale = "en-IN",
  currency = "INR",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getDiscountPercent(
  price: number,
  compareAtPrice?: number,
): number | null {
  if (!compareAtPrice || compareAtPrice <= price) {
    return null;
  }
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}
