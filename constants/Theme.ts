// constants/Theme.ts - GELİŞMİŞ TEMA SİSTEMİ

// ARTIK DIŞARIYA TEK BİR 'Colors' OBJESİ EXPORT ETMİYORUZ.
// SADECE RENK PALETLERİNİ TANIMLIYORUZ.

const dark = {
  background: '#010409',
  card: 'rgba(22, 27, 34, 0.7)',
  cardSecondary: 'rgba(22, 27, 34, 0.5)',
  textPrimary: '#E6EDF3',
  textSecondary: '#8B949E',
  textTertiary: '#6E7681',
  accentGreen: '#238636',
  accentRed: '#DA3633',
  accentBlue: '#1F6FEB',
  accentOrange: '#D29922',
  accentPurple: '#8250DF',
  border: 'rgba(139, 148, 158, 0.3)',
  primary: '#6A82FB', // Bu renk her iki temada da aynı kalabilir
  shadow: 'rgba(0, 0, 0, 0.3)', // Koyu tema için gölge
  overlay: 'rgba(1, 4, 9, 0.8)',
  imageOverlay: 'rgba(0, 0, 0, 0.5)', // Koyu tema için siyah overlay
  info: '#0969DA',
};

const light = {
  background: '#F6F8FA',
  card: '#FFFFFF',
  cardSecondary: '#F0F2F5', // Hafif gri, ana arka plandan ayrışsın.
  textPrimary: '#1A1D21', // Saf siyahtan daha yumuşak.
  textSecondary: '#57606A',
  textTertiary: '#8C959F',
  border: '#DDE2E7', // Daha yumuşak bir kenarlık.
  primary: '#0969DA',
  // YENİ RENK: Gölge rengi. Saf siyah değil, yarı saydam.
  shadow: 'rgba(26, 29, 33, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.4)',
  imageOverlay: 'rgba(255, 255, 255, 0.5)', // Bu şimdilik kalsın, gradyanı düzelteceğiz.
  accentGreen: '#1A7F37',
  accentRed: '#CF222E',
  accentBlue: '#0969DA',
  accentOrange: '#9A6700',
  accentPurple: '#8250DF',
  info: '#0969DA',
};

// Hook'umuz bu objeyi kullanacak
export const ThemeColors = {
  dark,
  light,
};

// Diğer sabitleri olduğu gibi bırakabilirsin
export const FontSize = {
  title: 24,
  subtitle: 18,
  body: 16,
  caption: 12,
  large: 32,
  xlarge: 48,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const createShadows = (shadowColor: string) => ({
  small: {
    shadowColor: shadowColor,
    shadowOffset: { width: 0, height: 2 }, // Hafifçe aşağıda
    shadowOpacity: 0.5, // Daha yumuşak opaklık
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: shadowColor,
    shadowOffset: { width: 1, height: 3 }, // Hafifçe sağa ve aşağıya
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 4,
  },
  large: {
    shadowColor: shadowColor,
    shadowOffset: { width: 1, height: 5 }, // Daha belirgin sağa ve aşağıya
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
});