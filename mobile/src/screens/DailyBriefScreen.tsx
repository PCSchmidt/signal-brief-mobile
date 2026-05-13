import { Feather } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PaperCard } from '../components/PaperCard';
import { TopicChip } from '../components/TopicChip';
import { colors, fontFamilies } from '../theme';
import { Paper, TopicKey } from '../types';

export function DailyBriefScreen({
  digestDateLabel,
  errorMessage,
  isLoading,
  onOpenPaper,
  onRefresh,
  onToggleSave,
  papers,
  savedPaperIds,
  selectedTopics,
}: {
  digestDateLabel: string;
  errorMessage: string | null;
  isLoading: boolean;
  onOpenPaper: (paperId: string) => void;
  onRefresh: () => void;
  onToggleSave: (paperId: string) => void;
  papers: Paper[];
  savedPaperIds: string[];
  selectedTopics: TopicKey[];
}) {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.sectionLabel}>Brief</Text>
            <Text style={styles.dateText}>{digestDateLabel}</Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable style={styles.iconButton}>
              <Feather color={colors.text} name="bell" size={18} />
            </Pressable>
            <Pressable onPress={onRefresh} style={styles.iconButton}>
              <Feather color={colors.text} name="refresh-cw" size={18} />
            </Pressable>
          </View>
        </View>

        <Text style={styles.title}>A compact scan of what matters today</Text>
        <Text style={styles.subtitle}>
          Today&apos;s brief ranks recent papers from the fixed source set using your chosen topics.
        </Text>

        <View style={styles.topicRow}>
          {selectedTopics.map((topic) => (
            <TopicChip key={topic} label={topic.toUpperCase()} />
          ))}
        </View>

        <View style={styles.digestMetaPanel}>
          <Text style={styles.digestMetaTitle}>Top five papers</Text>
          <Text style={styles.digestMetaCopy}>
            {isLoading
              ? 'Refreshing the latest persisted brief from the backend.'
              : 'Fast summaries first, full details one tap away.'}
          </Text>
        </View>

        {errorMessage ? (
          <View style={[styles.statePanel, styles.errorPanel]}>
            <Text style={styles.stateTitle}>We couldn&apos;t load today&apos;s brief.</Text>
            <Text style={styles.stateCopy}>{errorMessage}</Text>
            <Pressable onPress={onRefresh} style={styles.stateAction}>
              <Text style={styles.stateActionLabel}>Retry</Text>
            </Pressable>
          </View>
        ) : null}

        {!errorMessage && papers.length === 0 ? (
          <View style={styles.statePanel}>
            <Text style={styles.stateTitle}>Today&apos;s brief is still being prepared.</Text>
            <Text style={styles.stateCopy}>Check back shortly or refresh to request a fresh digest.</Text>
            <Pressable onPress={onRefresh} style={styles.stateAction}>
              <Text style={styles.stateActionLabel}>Refresh</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.cardsWrap}>
            {papers.map((paper) => (
              <PaperCard
                isSaved={savedPaperIds.includes(paper.id)}
                key={paper.id}
                onOpen={() => onOpenPaper(paper.id)}
                onToggleSave={() => onToggleSave(paper.id)}
                paper={paper}
                rank={paper.rank}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cardsWrap: {
    marginTop: 20,
  },
  content: {
    padding: 22,
    paddingBottom: 120,
  },
  dateText: {
    color: colors.text,
    fontFamily: fontFamilies.serif,
    fontSize: 28,
    marginTop: 6,
  },
  digestMetaCopy: {
    color: colors.mutedText,
    fontFamily: fontFamilies.body,
    fontSize: 14,
    marginTop: 6,
  },
  digestMetaPanel: {
    backgroundColor: colors.backgroundStrong,
    borderRadius: 24,
    marginTop: 24,
    padding: 18,
  },
  errorPanel: {
    backgroundColor: colors.dangerSoft,
  },
  digestMetaTitle: {
    color: colors.text,
    fontFamily: fontFamilies.medium,
    fontSize: 15,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  headerRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
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
    lineHeight: 22,
    marginTop: 12,
    maxWidth: '92%',
  },
  stateAction: {
    alignSelf: 'flex-start',
    backgroundColor: colors.text,
    borderRadius: 999,
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  stateActionLabel: {
    color: '#fff',
    fontFamily: fontFamilies.medium,
    fontSize: 13,
  },
  stateCopy: {
    color: colors.mutedText,
    fontFamily: fontFamilies.body,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  statePanel: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 24,
    borderWidth: 1,
    marginTop: 20,
    padding: 18,
  },
  stateTitle: {
    color: colors.text,
    fontFamily: fontFamilies.serif,
    fontSize: 24,
  },
  title: {
    color: colors.text,
    fontFamily: fontFamilies.serifBold,
    fontSize: 34,
    lineHeight: 38,
    marginTop: 24,
  },
  topicRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 18,
  },
});