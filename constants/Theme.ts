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
  overlay: 'rgba(1, 4, 9, 0.8)',
  imageOverlay: 'rgba(0, 0, 0, 0.5)', // Koyu tema için siyah overlay
  info: '#0969DA',
};

const light = {
  background: '#F6F8FA', // Saf beyaz değil, çok hafif bir gri. Gözü yormaz.
  card: '#FFFFFF', // Kartlar saf beyaz kalsın ki arka plandan ayrılsın.
  cardSecondary: '#F6F8FA', // İkincil kartlar arka planla aynı olabilir.
  textPrimary: '#24292F',
  textSecondary: '#57606A', // Biraz daha koyu, daha okunabilir.
  textTertiary: '#8C959F',
  border: '#D0D7DE', // Daha belirgin bir border rengi.
  primary: '#0969DA', // GitHub'ın mavisi. Daha profesyonel.
  overlay: 'rgba(0, 0, 0, 0.4)',
  imageOverlay: 'rgba(255, 255, 255, 0.5)', // Açık tema için BEYAZ overlay
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

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};