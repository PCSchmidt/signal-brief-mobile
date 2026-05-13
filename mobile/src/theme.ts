import { DefaultTheme } from '@react-navigation/native';

export const colors = {
  background: '#f4f1e8',
  backgroundStrong: '#ebe4d6',
  border: '#d9d0be',
  card: '#fffdf8',
  dangerSoft: '#f8d9d2',
  goldSoft: '#efe2b7',
  mutedText: '#667085',
  teal: '#1d6f71',
  tealSoft: '#d8ece8',
  text: '#1b2333',
};

export const fontFamilies = {
  body: 'IBMPlexSans_400Regular',
  medium: 'IBMPlexSans_500Medium',
  semibold: 'IBMPlexSans_600SemiBold',
  serif: 'SourceSerif4_600SemiBold',
  serifBold: 'SourceSerif4_700Bold',
};

export const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    border: colors.border,
    card: colors.card,
    primary: colors.teal,
    text: colors.text,
  },
};

export const shadows = {
  card: {
    elevation: 4,
    shadowColor: '#2d3137',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
  },
};