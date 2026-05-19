import { Feather } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TopicChip } from '../components/TopicChip';
import { colors, fontFamilies } from '../theme';
import { TopicKey, TopicOption } from '../types';

export function TopicOnboardingScreen({
  mode,
  onContinue,
  onSelectionChange,
  selectedTopics,
  topics,
}: {
  mode: 'edit' | 'setup';
  onContinue: () => void;
  onSelectionChange: (topics: TopicKey[]) => void;
  selectedTopics: TopicKey[];
  topics: TopicOption[];
}) {
  const toggleTopic = (topic: TopicKey) => {
    if (selectedTopics.includes(topic)) {
      if (selectedTopics.length <= 1) {
        return;
      }

      onSelectionChange(selectedTopics.filter((currentTopic) => currentTopic !== topic));
      return;
    }

    onSelectionChange([...selectedTopics, topic]);
  };

  const minimumSelected = selectedTopics.length >= 1;

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.skipRow}>
          <Text style={styles.skipLabel}>{mode === 'setup' ? 'Skip' : 'Edit topics'}</Text>
        </View>

        <View style={styles.heroWrap}>
          <Text style={styles.kicker}>Daily setup</Text>
          <Text style={styles.title}>Build your brief</Text>
          <Text style={styles.subtitle}>
            Pick one or more topics to shape which AI papers rise into today&apos;s top five.
          </Text>
        </View>

        <View style={styles.topicGrid}>
          {topics.map((topic) => (
            <TopicChip
              key={topic.key}
              label={topic.label}
              onPress={() => toggleTopic(topic.key)}
              selected={selectedTopics.includes(topic.key)}
            />
          ))}
        </View>

        <View style={styles.infoPanel}>
          <View>
            <Text style={styles.infoLabel}>Selected</Text>
            <Text style={styles.infoValue}>{selectedTopics.length.toString().padStart(2, '0')}</Text>
          </View>
          <View style={styles.infoCopyWrap}>
            <Feather color={colors.teal} name="filter" size={18} />
            <Text style={styles.infoCopy}>Choose one topic for a narrow brief, or combine several for a wider scan.</Text>
          </View>
        </View>

        <Pressable
          disabled={!minimumSelected}
          onPress={onContinue}
          style={[styles.primaryButton, !minimumSelected ? styles.primaryButtonDisabled : null]}
        >
          <Text style={styles.primaryButtonLabel}>{mode === 'setup' ? 'Continue' : 'Save topics'}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  heroWrap: {
    marginTop: 28,
  },
  infoCopy: {
    color: colors.text,
    flex: 1,
    fontFamily: fontFamilies.body,
    fontSize: 14,
    lineHeight: 20,
  },
  infoCopyWrap: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    maxWidth: '68%',
  },
  infoLabel: {
    color: colors.mutedText,
    fontFamily: fontFamilies.medium,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  infoPanel: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 28,
    padding: 20,
  },
  infoValue: {
    color: colors.teal,
    fontFamily: fontFamilies.serifBold,
    fontSize: 30,
    marginTop: 4,
  },
  kicker: {
    color: colors.teal,
    fontFamily: fontFamilies.semibold,
    fontSize: 13,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.text,
    borderRadius: 999,
    marginTop: 30,
    paddingVertical: 16,
  },
  primaryButtonDisabled: {
    opacity: 0.45,
  },
  primaryButtonLabel: {
    color: '#fff',
    fontFamily: fontFamilies.semibold,
    fontSize: 15,
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  skipLabel: {
    color: colors.mutedText,
    fontFamily: fontFamilies.medium,
    fontSize: 14,
  },
  skipRow: {
    alignItems: 'flex-end',
  },
  subtitle: {
    color: colors.mutedText,
    fontFamily: fontFamilies.body,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 14,
    maxWidth: '90%',
  },
  title: {
    color: colors.text,
    fontFamily: fontFamilies.serifBold,
    fontSize: 42,
    lineHeight: 46,
    marginTop: 8,
  },
  topicGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 28,
  },
});