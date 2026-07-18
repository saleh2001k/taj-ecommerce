/**
 * Arabic strings. Must satisfy `AppTranslation` — missing or extra keys are
 * compile errors, keeping locales in lockstep with `en`.
 */
import type { AppTranslation } from './en';

export const ar: AppTranslation = {
  nav: {
    brand: 'أتولييه',
    home: 'الرئيسية',
    shop: 'المتجر',
    components: 'المكونات',
    profile: 'الملف الشخصي',
    about: 'حول',
    modalTitle: 'حول',
    back: 'رجوع',
  },

  profile: {
    title: 'الملف الشخصي',
    guest: 'متسوّق ضيف',
    tagline: 'سجّل الدخول لمزامنة الحقيبة والمفضلة عبر أجهزتك.',
    orders: 'الطلبات',
    wishlist: 'المفضلة',
    bag: 'الحقيبة',
    search: 'البحث',
    preferences: 'التفضيلات',
    about: 'حول',
  },

  preferences: {
    title: 'التفضيلات',
  },

  bag: {
    title: 'الحقيبة',
    items: '{{count}} قطعة',
    empty: 'حقيبتك فارغة.',
    browse: 'تصفّح المتجر',
    size: 'المقاس {{size}}',
    total: 'الإجمالي',
    checkout: 'إتمام الشراء',
    note: 'يُحتسب الشحن والضرائب عند إتمام الشراء.',
  },

  search: {
    title: 'البحث',
    placeholder: 'ابحث في المجموعة…',
    results: '{{count}} نتيجة',
    empty: 'لا شيء يطابق بحثك.',
    categories: 'الفئات',
  },

  orders: {
    title: 'الطلبات',
    order: 'طلب {{id}}',
    items: 'القطع: {{count}}',
    total: 'الإجمالي',
    status: {
      delivered: 'تم التوصيل',
      shipped: 'تم الشحن',
      processing: 'قيد المعالجة',
    },
  },

  wishlist: {
    title: 'المفضلة',
    saved: '{{count}} محفوظة',
    empty: 'لا شيء محفوظ بعد. اضغط على القلب على أي قطعة لحفظها هنا.',
    browse: 'تصفّح المتجر',
  },

  home: {
    heroEyebrow: 'خريف / شتاء ٢٠٢٦',
    heroTitle: 'أناقة مدروسة',
    heroSubtitle: 'أقمشة مدروسة، ألوان هادئة، صُنعت لتدوم.',
    shopNow: 'تسوّق المجموعة',
    shopByCategory: 'تسوّق حسب الفئة',
    featured: 'مميّز',
    newArrivals: 'وصل حديثًا',
    viewAll: 'عرض الكل',
    promo: 'شحن مجاني للطلبات فوق ١٥٠$ · إرجاع خلال ٣٠ يومًا',
  },

  catalog: {
    title: 'المتجر',
    subtitle: '{{count}} قطعة',
    all: 'الكل',
    new: 'جديد',
    sale: 'تخفيض',
    empty: 'لا يوجد شيء في هذه الفئة بعد.',
    categories: {
      tops: 'قمصان',
      outerwear: 'ملابس خارجية',
      bottoms: 'بناطيل',
      shoes: 'أحذية',
      accessories: 'إكسسوارات',
    },
  },

  product: {
    colorLabel: 'اللون',
    sizeLabel: 'المقاس',
    selectSize: 'اختر مقاسًا',
    addToCart: 'أضف إلى الحقيبة',
    added: 'أُضيف إلى الحقيبة',
    description: 'الوصف',
    descriptionBody:
      'قطعة أساسية في خزانتك مصنوعة من قماش فاخر بقَصّة أنيقة تُنسّق بسهولة عبر كل المواسم.',
    shipping: 'شحن مجاني للطلبات فوق ١٥٠$ · إرجاع خلال ٣٠ يومًا',
    ratingReviews: '{{rating}} · {{count}} تقييم',
    youMayLike: 'قد يعجبك أيضًا',
  },

  components: {
    title: 'المكونات',
    subtitle: 'اللبنات الأساسية للتطبيق — اضغط على أي منها لرؤية جميع أنواعها.',
    useCases: 'حالات الاستخدام',
  },

  settings: {
    title: 'الإعدادات',
    appearanceSection: 'المظهر',
    languageSection: 'اللغة والمنطقة',
    aboutSection: 'حول',
    intro: 'كل ما يلي يُحفظ في التخزين ويُطبَّق فورًا.',
    brandField: 'سمة العلامة',
    modeField: 'الوضع',
    fontField: 'الخط',
    radiusField: 'استدارة الحواف',
    languageField: 'اللغة / الاتجاه',
    rtlNote: 'التبديل إلى English يقلب التخطيط بالكامل فورًا — بدون إعادة تحميل.',
    reset: 'إعادة التعيين للافتراضي',
    version: 'الإصدار {{version}}',
  },

  modal: {
    title: 'حول',
    cardTitle: 'السمات الديناميكية',
    cardBody:
      'يستخدم هذا التطبيق Unistyles 3.3 مع سمات متعددة (لكل منها وضع فاتح وداكن، ١٠ ألوان دلالية، واستدارة خاصة)، و٤ خطوط عربية/إنجليزية قابلة للاختيار، ودعم كامل للاتجاه أثناء التشغيل، وإعدادات محفوظة في MMKV، وتخطيطات متجاوبة للأجهزة اللوحية وسطح المكتب.',
  },

  notFound: {
    title: 'عذرًا!',
    message: 'هذه الشاشة غير موجودة.',
    goHome: 'الانتقال إلى الشاشة الرئيسية',
  },

  brands: {
    atelier: 'أتولييه',
    ocean: 'المحيط',
    sunset: 'الغروب',
    forest: 'الغابة',
  },

  modes: {
    system: 'النظام',
    light: 'فاتح',
    dark: 'داكن',
  },

  radius: {
    brand: 'افتراضي السمة',
    sharp: 'حاد',
    minimal: 'بسيط',
    rounded: 'مستدير',
    soft: 'ناعم',
    round: 'دائري',
  },

  // Endonyms — identical across locales by design.
  languages: {
    en: 'English',
    ar: 'العربية',
  },
};
