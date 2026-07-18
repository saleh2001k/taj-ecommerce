/**
 * Demo catalog for the clothing store.
 *
 * Images are real clothing photography served from Unsplash (every ID verified
 * to resolve). Prices are plain numbers; format with `formatPrice`.
 */
export type CategoryId = 'tops' | 'outerwear' | 'bottoms' | 'shoes' | 'accessories';

export type Product = {
  id: string;
  name: string;
  category: CategoryId;
  price: number;
  /** Original price when the item is on sale (strike-through). */
  compareAt?: number;
  image: string;
  /** Swatch hexes for the colour selector. */
  colors: string[];
  sizes: string[];
  rating: number;
  badge?: 'new' | 'sale';
};

export type Category = {
  id: CategoryId;
  /** Locale key under `catalog.categories.*`. */
  tx: `catalog.categories.${CategoryId}`;
  image: string;
};

/** Unsplash photo by ID, sized for product tiles (or wider for heroes). */
const img = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

/** Full-bleed editorial shot for the home hero. */
export const HERO_IMAGE = img('1490481651871-ab68de25d43d', 1600);

export const CATEGORIES: Category[] = [
  { id: 'tops', tx: 'catalog.categories.tops', image: img('1602810318383-e386cc2a3ccf') },
  { id: 'outerwear', tx: 'catalog.categories.outerwear', image: img('1539533018447-63fcce2678e3') },
  { id: 'bottoms', tx: 'catalog.categories.bottoms', image: img('1541099649105-f69ad21f3246') },
  { id: 'shoes', tx: 'catalog.categories.shoes', image: img('1595950653106-6c9ebd614d3a') },
  {
    id: 'accessories',
    tx: 'catalog.categories.accessories',
    image: img('1553062407-98eeb64c6a62'),
  },
];

const APPAREL_SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const SHOE_SIZES = ['39', '40', '41', '42', '43', '44'];

export const PRODUCTS: Product[] = [
  {
    id: 'linen-shirt',
    name: 'Linen Camp Shirt',
    category: 'tops',
    price: 68,
    image: img('1596755094514-f87e34085b2c'),
    colors: ['#E8E0D2', '#2B3A55', '#8A9A5B'],
    sizes: APPAREL_SIZES,
    rating: 4.6,
    badge: 'new',
  },
  {
    id: 'oxford-tee',
    name: 'Heavyweight Boxy Tee',
    category: 'tops',
    price: 34,
    image: img('1521572163474-6864f9cf17ab'),
    colors: ['#F4F4F4', '#1A1A1A', '#B4654A'],
    sizes: APPAREL_SIZES,
    rating: 4.4,
  },
  {
    id: 'ribbed-knit',
    name: 'Ribbed Merino Knit',
    category: 'tops',
    price: 96,
    compareAt: 120,
    image: img('1576871337622-98d48d1cf531'),
    colors: ['#6B4F3A', '#101418', '#C9B79C'],
    sizes: APPAREL_SIZES,
    rating: 4.8,
    badge: 'sale',
  },
  {
    id: 'wool-overcoat',
    name: 'Wool Blend Overcoat',
    category: 'outerwear',
    price: 248,
    image: img('1544022613-e87ca75a784a'),
    colors: ['#3C3C3C', '#5C4A38', '#20242A'],
    sizes: APPAREL_SIZES,
    rating: 4.9,
    badge: 'new',
  },
  {
    id: 'quilted-jacket',
    name: 'Quilted Liner Jacket',
    category: 'outerwear',
    price: 158,
    compareAt: 198,
    image: img('1591047139829-d91aecb6caea'),
    colors: ['#2E3B2E', '#1A1A1A'],
    sizes: APPAREL_SIZES,
    rating: 4.5,
    badge: 'sale',
  },
  {
    id: 'denim-trucker',
    name: 'Selvedge Trucker Jacket',
    category: 'outerwear',
    price: 178,
    image: img('1576995853123-5a10305d93c0'),
    colors: ['#3B5675', '#1E2A38'],
    sizes: APPAREL_SIZES,
    rating: 4.7,
  },
  {
    id: 'pleated-trouser',
    name: 'Pleated Wide Trouser',
    category: 'bottoms',
    price: 88,
    image: img('1624378439575-d8705ad7ae80'),
    colors: ['#2B2B2B', '#7A6A55', '#4A4E57'],
    sizes: APPAREL_SIZES,
    rating: 4.3,
  },
  {
    id: 'raw-denim',
    name: 'Raw Tapered Denim',
    category: 'bottoms',
    price: 112,
    image: img('1542272604-787c3835535d'),
    colors: ['#28374B', '#141414'],
    sizes: APPAREL_SIZES,
    rating: 4.6,
    badge: 'new',
  },
  {
    id: 'runner-low',
    name: 'Suede Runner Low',
    category: 'shoes',
    price: 134,
    compareAt: 160,
    image: img('1560769629-975ec94e6a86'),
    colors: ['#C9B79C', '#2B2B2B', '#6B4F3A'],
    sizes: SHOE_SIZES,
    rating: 4.5,
    badge: 'sale',
  },
  {
    id: 'chelsea-boot',
    name: 'Leather Chelsea Boot',
    category: 'shoes',
    price: 210,
    image: img('1638247025967-b4e38f787b76'),
    colors: ['#3A2A1E', '#1A1A1A'],
    sizes: SHOE_SIZES,
    rating: 4.8,
  },
  {
    id: 'canvas-tote',
    name: 'Waxed Canvas Tote',
    category: 'accessories',
    price: 74,
    image: img('1590874103328-eac38a683ce7'),
    colors: ['#7A6A55', '#2E3B2E', '#1A1A1A'],
    sizes: ['One Size'],
    rating: 4.4,
  },
  {
    id: 'wool-beanie',
    name: 'Ribbed Wool Beanie',
    category: 'accessories',
    price: 28,
    image: img('1575428652377-a2d80e2277fc'),
    colors: ['#8A9A5B', '#B4654A', '#20242A'],
    sizes: ['One Size'],
    rating: 4.2,
    badge: 'new',
  },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find(p => p.id === id);
}

export function productsByCategory(category: CategoryId | 'all'): Product[] {
  return category === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === category);
}

export function relatedProducts(product: Product, limit = 4): Product[] {
  return PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(
    0,
    limit,
  );
}

/** Simple USD formatter — whole dollars, no trailing cents when round. */
export function formatPrice(value: number): string {
  return `$${value % 1 === 0 ? value.toFixed(0) : value.toFixed(2)}`;
}
