/**
 * Arabic strings. Must satisfy `AppTranslation` — missing or extra keys are
 * compile errors, keeping locales in lockstep with `en`.
 */
import type { AppTranslation } from './en';

export const ar: AppTranslation = {
  nav: {
    brand: 'المتجر',
    showcase: 'المعرض',
    settings: 'الإعدادات',
    about: 'حول',
    modalTitle: 'حول',
  },

  showcase: {
    title: 'معرض السمات',
    subtitle: 'السمة: {{brand}}  ·  الوضع: {{mode}}  ·  الخط: {{font}}',
    paletteSection: 'الألوان · ١٠ أدوار (فاتح + داكن)',
    typographySection: 'الخطوط',
    display: 'عرض كبير',
    heading: 'عنوان رئيسي',
    titleSample: 'عنوان',
    bodySample: 'نص أساسي — الثعلب البني السريع. English text here.',
    captionSample: 'شرح / باهت',
    buttonsSection: 'الأزرار',
    buttonPrimary: 'أساسي',
    buttonSecondary: 'ثانوي',
    buttonAccent: 'مميز',
    buttonOutline: 'محدد',
    buttonGhost: 'شفاف',
    buttonDanger: 'خطر',
    buttonLoading: 'عرض كامل · تحميل',
    radiusSection: 'الاستدارة (شكل السمة)',
    radiusHint:
      'لكل سمة شكلها الخاص — المحيط مستدير، الغروب ناعم، الغابة بسيط. يمكنك تغييره من الإعدادات.',
    cardTitle: 'بطاقة مرتفعة',
    cardBody:
      'سطح + حدود + استدارة السمة + ظل يتكيف مع الوضع. كل شيء هنا مبني على الرموز — لا قيم ثابتة.',
  },

  settings: {
    title: 'المظهر',
    intro: 'كل ما يلي يُحفظ في التخزين ويُطبَّق فورًا.',
    brandField: 'سمة العلامة',
    modeField: 'الوضع',
    fontField: 'الخط',
    radiusField: 'استدارة الحواف',
    languageField: 'اللغة / الاتجاه',
    rtlNote: 'التبديل إلى English يقلب التخطيط بالكامل فورًا — بدون إعادة تحميل.',
    reset: 'إعادة التعيين للافتراضي',
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
