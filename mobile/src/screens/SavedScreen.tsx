import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { colors, fontFamilies } from '../theme';
import { Paper } from '../types';

export function SavedScreen({
  onOpenPaper,
  onToggleSave,
  papers,
}: {
  onOpenPaper: (paperId: string) => void;
  onToggleSave: (paperId: string) => void;
  papers: Paper[];
}) {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionLabel}>Saved</Text>
        <Text style={styles.title}>Papers worth revisiting</Text>
        <Text style={styles.subtitle}>Build a short reading list from the daily brief.</Text>

        {papers.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather color={colors.teal} name="bookmark" size={22} />
            <Text style={styles.emptyTitle}>No saved papers yet</Text>
            <Text style={styles.emptyCopy}>
              Save papers from the brief to collect a short reading list.
            </Text>
          </View>
        ) : (
          <View style={styles.savedList}>
            {papers.map((paper) => (
              <View key={paper.id} style={styles.savedCard}>
                <Pressable onPress={() => onOpenPaper(paper.id)}>
                  <Text style={styles.savedTitle}>{paper.title}</Text>
                </Pressable>
                <Text style={styles.savedMeta}>{paper.tags.map((tag) => tag.toUpperCase()).join(' • ')}</Text>
                <View style={styles.savedActions}>
                  <Text style={styles.savedTimestamp}>Saved recently</Text>
                  <Pressable onPress={() => onToggleSave(paper.id)}>
                    <Text style={styles.removeLabel}>Remove</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 22,
    paddingBottom: 120,
  },
  emptyCopy: {
    color: colors.mutedText,
    fontFamily: fontFamilies.body,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 26,
    borderWidth: 1,
    marginTop: 28,
    paddingHorizontal: 24,
    paddingVertical: 44,
  },
  emptyTitle: {
    color: colors.text,
    fontFamily: fontFamilies.serif,
    fontSize: 26,
    marginTop: 18,
  },
  removeLabel: {
    color: colors.teal,
    fontFamily: fontFamilies.medium,
    fontSize: 14,
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  savedActions: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  savedCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 24,
    borderWidth: 1,
    padding: 18,
  },
  savedList: {
    gap: 14,
    marginTop: 26,
  },
  savedMeta: {
    color: colors.mutedText,
    fontFamily: fontFamilies.medium,
    fontSize: 12,
    letterSpacing: 0.8,
    marginTop: 10,
    textTransform: 'uppercase',
  },
  savedTimestamp: {
    color: colors.mutedText,
    fontFamily: fontFamilies.body,
    fontSize: 13,
  },
  savedTitle: {
    color: colors.text,
    fontFamily: fontFamilies.serif,
    fontSize: 24,
    lineHeight: 30,
  },
  sectionLabel: {
    color: colors.teal,
    fontFamily: fontFamilies.semibold,
    fontSize: 13,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
  },
  subtitle: {
    color: colors.mutedText,
    fontFamily: fontFamilies.body,
    fontSize: 15,
    marginTop: 10,
  },
  title: {
    color: colors.text,
    fontFamily: fontFamilies.serifBold,
    fontSize: 34,
    lineHeight: 38,
    marginTop: 8,
  },
});