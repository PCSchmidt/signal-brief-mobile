import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { TopicChip } from '../components/TopicChip';
import { colors, fontFamilies } from '../theme';
import { Paper } from '../types';

export function PaperDetailScreen({
  isSaved,
  onBack,
  onToggleSave,
  paper,
}: {
  isSaved: boolean;
  onBack: () => void;
  onToggleSave: (paperId: string) => void;
  paper: Paper | null;
}) {
  if (!paper) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.missingWrap}>
          <Text style={styles.missingTitle}>Paper not found</Text>
          <Text style={styles.missingCopy}>The selected paper could not be loaded from the mock dataset.</Text>
          <Pressable onPress={onBack} style={styles.primaryAction}>
            <Text style={styles.primaryActionLabel}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Feather color={colors.text} name="arrow-left" size={16} />
          <Text style={styles.backLabel}>Back</Text>
        </Pressable>

        <Text style={styles.title}>{paper.title}</Text>
        <Text style={styles.metaText}>{paper.authors}</Text>
        <Text style={styles.metaText}>{paper.publishedAt}</Text>

        <View style={styles.tagRow}>
          {paper.tags.map((tag) => (
            <TopicChip key={tag} label={tag.toUpperCase()} />
          ))}
        </View>

        <View style={styles.sectionWrap}>
          <Text style={styles.sectionLabel}>Why it matters</Text>
          {paper.whyItMatters.map((bullet) => (
            <View key={bullet} style={styles.bulletRow}>
              <View style={styles.bulletDot} />
              <Text style={styles.bodyText}>{bullet}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionWrap}>
          <Text style={styles.sectionLabel}>Abstract snapshot</Text>
          <Text style={styles.bodyText}>{paper.abstractExcerpt}</Text>
        </View>

        <View style={styles.actionsRow}>
          <Pressable onPress={() => onToggleSave(paper.id)} style={styles.secondaryAction}>
            <Text style={styles.secondaryActionLabel}>{isSaved ? 'Saved' : 'Save'}</Text>
          </Pressable>
          <Pressable onPress={() => Linking.openURL(paper.arxivUrl)} style={styles.primaryAction}>
            <Text style={styles.primaryActionLabel}>Open on arXiv</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 28,
  },
  backButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  backLabel: {
    color: colors.text,
    fontFamily: fontFamilies.medium,
    fontSize: 14,
  },
  bodyText: {
    color: colors.text,
    flex: 1,
    fontFamily: fontFamilies.body,
    fontSize: 15,
    lineHeight: 24,
  },
  bulletDot: {
    backgroundColor: colors.teal,
    borderRadius: 999,
    height: 6,
    marginTop: 9,
    width: 6,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  metaText: {
    color: colors.mutedText,
    fontFamily: fontFamilies.body,
    fontSize: 14,
    marginTop: 6,
  },
  missingCopy: {
    color: colors.mutedText,
    fontFamily: fontFamilies.body,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
    textAlign: 'center',
  },
  missingTitle: {
    color: colors.text,
    fontFamily: fontFamilies.serifBold,
    fontSize: 30,
  },
  missingWrap: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  primaryAction: {
    alignItems: 'center',
    backgroundColor: colors.text,
    borderRadius: 999,
    flex: 1,
    paddingVertical: 14,
  },
  primaryActionLabel: {
    color: '#fff',
    fontFamily: fontFamilies.semibold,
    fontSize: 14,
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  secondaryAction: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 14,
  },
  secondaryActionLabel: {
    color: colors.text,
    fontFamily: fontFamilies.medium,
    fontSize: 14,
  },
  sectionLabel: {
    color: colors.text,
    fontFamily: fontFamilies.serif,
    fontSize: 24,
  },
  sectionWrap: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 24,
    borderWidth: 1,
    marginTop: 24,
    padding: 18,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 18,
  },
  title: {
    color: colors.text,
    fontFamily: fontFamilies.serifBold,
    fontSize: 38,
    lineHeight: 42,
  },
});