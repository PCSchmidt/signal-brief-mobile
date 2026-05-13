import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontFamilies, shadows } from '../theme';
import { Paper } from '../types';
import { TopicChip } from './TopicChip';

export function PaperCard({
  isSaved,
  onOpen,
  onToggleSave,
  paper,
  rank,
}: {
  isSaved: boolean;
  onOpen: () => void;
  onToggleSave: () => void;
  paper: Paper;
  rank: number;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.rankRow}>
        <Text style={styles.rankLabel}>{rank.toString().padStart(2, '0')}</Text>
        <Text style={styles.dateText}>{paper.publishedAt}</Text>
      </View>

      <Pressable accessibilityLabel="Open paper title" accessibilityRole="button" onPress={onOpen} style={styles.titleWrap}>
        <Text style={styles.title}>{paper.title}</Text>
      </Pressable>

      <Text style={styles.authors}>{paper.authors}</Text>

      <View style={styles.actionRow}>
        <Pressable
          accessibilityLabel={isSaved ? 'Saved paper action' : 'Save paper action'}
          accessibilityRole="button"
          onPress={onToggleSave}
          style={styles.secondaryAction}
        >
          <Feather color={colors.text} name="bookmark" size={16} />
          <Text style={styles.secondaryActionLabel}>{isSaved ? 'Saved' : 'Save'}</Text>
        </Pressable>

        <Pressable accessibilityLabel="Open paper action" accessibilityRole="button" onPress={onOpen} style={styles.primaryAction}>
          <Text style={styles.primaryActionLabel}>Open</Text>
        </Pressable>
      </View>

      <View style={styles.tagRow}>
        {paper.tags.map((tag) => (
          <TopicChip key={tag} label={tag.toUpperCase()} selected />
        ))}
      </View>

      <View style={styles.bulletList}>
        {paper.summaryBullets.slice(0, 2).map((bullet) => (
          <View key={bullet} style={styles.bulletRow}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>{bullet}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  authors: {
    color: colors.mutedText,
    fontFamily: fontFamilies.body,
    fontSize: 13,
    marginTop: 8,
  },
  bulletDot: {
    backgroundColor: colors.teal,
    borderRadius: 999,
    height: 6,
    marginTop: 8,
    width: 6,
  },
  bulletList: {
    gap: 10,
    marginTop: 16,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 10,
  },
  bulletText: {
    color: colors.text,
    flex: 1,
    fontFamily: fontFamilies.body,
    fontSize: 14,
    lineHeight: 22,
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 18,
    padding: 20,
    ...shadows.card,
  },
  dateText: {
    color: colors.mutedText,
    fontFamily: fontFamilies.medium,
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  primaryAction: {
    backgroundColor: colors.text,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  primaryActionLabel: {
    color: '#fff',
    fontFamily: fontFamilies.semibold,
    fontSize: 13,
  },
  rankLabel: {
    color: colors.teal,
    fontFamily: fontFamilies.semibold,
    fontSize: 13,
    letterSpacing: 1.2,
  },
  rankRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryAction: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  secondaryActionLabel: {
    color: colors.text,
    fontFamily: fontFamilies.medium,
    fontSize: 14,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  title: {
    color: colors.text,
    fontFamily: fontFamilies.serifBold,
    fontSize: 26,
    lineHeight: 30,
  },
  titleWrap: {
    marginTop: 10,
  },
});