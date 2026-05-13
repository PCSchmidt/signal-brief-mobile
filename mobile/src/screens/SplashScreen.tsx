import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors, fontFamilies } from '../theme';

export function SplashScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.orbLarge} />
      <View style={styles.orbSmall} />
      <Text style={styles.wordmark}>SIGNAL BRIEF</Text>
      <Text style={styles.tagline}>Daily AI paper briefing</Text>
      <ActivityIndicator color={colors.teal} size="small" style={styles.spinner} />
      <Text style={styles.helper}>Checking preferences and today&apos;s brief</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: 24,
  },
  helper: {
    color: colors.mutedText,
    fontFamily: fontFamilies.body,
    fontSize: 14,
    marginTop: 16,
  },
  orbLarge: {
    backgroundColor: colors.backgroundStrong,
    borderRadius: 160,
    height: 320,
    position: 'absolute',
    right: -80,
    top: -30,
    width: 320,
  },
  orbSmall: {
    backgroundColor: colors.goldSoft,
    borderRadius: 90,
    bottom: 110,
    height: 180,
    left: -70,
    position: 'absolute',
    width: 180,
  },
  spinner: {
    marginTop: 24,
  },
  tagline: {
    color: colors.text,
    fontFamily: fontFamilies.serif,
    fontSize: 30,
    marginTop: 12,
  },
  wordmark: {
    color: colors.teal,
    fontFamily: fontFamilies.semibold,
    fontSize: 14,
    letterSpacing: 2.4,
  },
});