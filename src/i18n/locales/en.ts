/**
 * English strings — the SOURCE locale.
 *
 * `en` defines the canonical shape; every other locale must implement
 * `AppTranslation` (derived from this object), so adding/removing a key here
 * is a compile error until all locales are updated.
 *
 * Product data (names, prices) and the component gallery's demo text are NOT
 * here — they're passed as `children` (the non-copy opt-out), so this file stays
 * the set of real, translatable UI copy.
 */
export const en = {
  nav: {
    brand: 'ATELIER',
    home: 'Home',
    shop: 'Shop',
    components: 'Components',
    profile: 'Profile',
    about: 'About',
    modalTitle: 'About',
    back: 'Back',
  },

  profile: {
    title: 'Profile',
    guest: 'Guest shopper',
    tagline: 'Sign in to sync your bag and wishlist across devices.',
    orders: 'Orders',
    wishlist: 'Wishlist',
    bag: 'Bag',
    search: 'Search',
    preferences: 'Preferences',
    about: 'About',
  },

  preferences: {
    title: 'Preferences',
  },

  bag: {
    title: 'Bag',
    items: '{{count}} pieces',
    empty: 'Your bag is empty.',
    browse: 'Browse the shop',
    size: 'Size {{size}}',
    total: 'Total',
    checkout: 'Checkout',
    note: 'Shipping and taxes calculated at checkout.',
  },

  search: {
    title: 'Search',
    placeholder: 'Search the collection…',
    results: '{{count}} results',
    empty: 'Nothing matches your search.',
    categories: 'Categories',
  },

  orders: {
    title: 'Orders',
    order: 'Order {{id}}',
    items: 'Pieces: {{count}}',
    total: 'Total',
    status: {
      delivered: 'Delivered',
      shipped: 'Shipped',
      processing: 'Processing',
    },
  },

  wishlist: {
    title: 'Wishlist',
    saved: '{{count}} saved',
    empty: 'Nothing saved yet. Tap the heart on any piece to keep it here.',
    browse: 'Browse the shop',
  },

  home: {
    heroEyebrow: 'Fall / Winter 2026',
    heroTitle: 'Dress with intention',
    heroSubtitle: 'Considered fabrics, quiet colours, built to last.',
    shopNow: 'Shop the collection',
    shopByCategory: 'Shop by category',
    featured: 'Featured',
    newArrivals: 'New arrivals',
    viewAll: 'View all',
    promo: 'Free shipping over $150 · 30-day returns',
  },

  catalog: {
    title: 'Shop',
    subtitle: '{{count}} pieces',
    all: 'All',
    new: 'New',
    sale: 'Sale',
    empty: 'Nothing in this category yet.',
    categories: {
      tops: 'Tops',
      outerwear: 'Outerwear',
      bottoms: 'Bottoms',
      shoes: 'Shoes',
      accessories: 'Accessories',
    },
  },

  product: {
    colorLabel: 'Colour',
    sizeLabel: 'Size',
    selectSize: 'Select a size',
    addToCart: 'Add to cart',
    added: 'Added to bag',
    description: 'Description',
    descriptionBody:
      'A wardrobe staple cut from premium fabric with a clean silhouette that layers effortlessly across the seasons.',
    shipping: 'Free shipping over $150 · 30-day returns',
    ratingReviews: '{{rating}} · {{count}} reviews',
    youMayLike: 'You may also like',
  },

  components: {
    title: 'Components',
    subtitle: 'The building blocks of the app — tap any to see every variant.',
    useCases: 'Use cases',
  },

  settings: {
    title: 'Settings',
    appearanceSection: 'Appearance',
    languageSection: 'Language & region',
    aboutSection: 'About',
    intro: 'Everything below persists to storage and applies instantly.',
    brandField: 'Brand theme',
    modeField: 'Mode',
    fontField: 'Font',
    radiusField: 'Corner radius',
    languageField: 'Language / direction',
    rtlNote: 'Switching to العربية flips the whole layout to RTL instantly — no reload.',
    reset: 'Reset to defaults',
    version: 'Version {{version}}',
  },

  modal: {
    title: 'About',
    cardTitle: 'Dynamic theming',
    cardBody:
      'This app uses Unistyles 3.3 with multiple brand themes (each with light + dark, 10 semantic colors, and its own radius), 4 selectable Arabic/English fonts, full runtime RTL, MMKV-persisted settings, and responsive tablet/desktop layouts.',
  },

  notFound: {
    title: 'Oops!',
    message: "This screen doesn't exist.",
    goHome: 'Go to home screen',
  },

  brands: {
    atelier: 'Atelier',
    ocean: 'Ocean',
    sunset: 'Sunset',
    forest: 'Forest',
  },

  modes: {
    system: 'System',
    light: 'Light',
    dark: 'Dark',
  },

  radius: {
    brand: 'Theme default',
    sharp: 'Sharp',
    minimal: 'Minimal',
    rounded: 'Rounded',
    soft: 'Soft',
    round: 'Round',
  },

  /** Language names stay in their OWN language (endonyms) — never translated. */
  languages: {
    en: 'English',
    ar: 'العربية',
  },
} as const;

/** Values every locale must provide: same keys as `en`, string leaves. */
export type AppTranslation = DeepStringify<typeof en>;

type DeepStringify<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepStringify<T[K]>;
};
