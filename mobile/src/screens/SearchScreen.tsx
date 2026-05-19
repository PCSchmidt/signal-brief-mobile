import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PaperCard } from '../components/PaperCard';
import { TopicChip } from '../components/TopicChip';
import { searchPapers } from '../services/briefApi';
import { colors, fontFamilies } from '../theme';
import { Paper, TopicKey } from '../types';

export function SearchScreen({
  onCachePapers,
  onOpenPaper,
  onToggleSave,
  savedPaperIds,
  suggestedTopics,
}: {
  onCachePapers: (papers: Paper[]) => void;
  onOpenPaper: (paperId: string) => void;
  onToggleSave: (paperId: string) => void;
  savedPaperIds: string[];
  suggestedTopics: TopicKey[];
}) {
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [results, setResults] = useState<Paper[]>([]);
  const [submittedQuery, setSubmittedQuery] = useState('');

  const runSearch = async (nextQuery?: string) => {
    const normalizedQuery = (nextQuery ?? query).trim();

    if (!normalizedQuery) {
      setErrorMessage('Enter a topic or question to search arXiv papers.');
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const payload = await searchPapers(normalizedQuery);
      setResults(payload.papers);
      setSubmittedQuery(payload.query);
      setHasSearched(true);
      onCachePapers(payload.papers);
    } catch (error) {
      setResults([]);
      setHasSearched(true);
      setErrorMessage(
        error instanceof Error
          ? `${error.message}. Confirm the backend is running and reachable from the app.`
          : 'Unable to search papers right now.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.sectionLabel}>Search</Text>
            <Text style={styles.dateText}>Find papers by topic</Text>
          </View>
          <View style={styles.headerActions}>
            <View style={styles.iconButton}>
              <Feather color={colors.text} name="search" size={18} />
            </View>
          </View>
        </View>

        <Text style={styles.title}>Search for the most relevant recent research</Text>
        <Text style={styles.subtitle}>
          Enter a targeted topic or question. The app pulls recent AI papers from arXiv and ranks the
          best matches.
        </Text>

        <View style={styles.searchPanel}>
          <Text style={styles.inputLabel}>Topic query</Text>
          <TextInput
            accessibilityLabel="Paper search query"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setQuery}
            onSubmitEditing={() => {
              void runSearch();
            }}
            placeholder="Try: retrieval augmented generation evaluation"
            placeholderTextColor={colors.mutedText}
            returnKeyType="search"
            style={styles.input}
            value={query}
          />

          <View style={styles.topicRow}>
            {suggestedTopics.map((topic) => (
              <TopicChip
                key={topic}
                label={topic.toUpperCase()}
                onPress={() => {
                  const nextQuery = topic.replace('-', ' ');
                  setQuery(nextQuery);
                  void runSearch(nextQuery);
                }}
              />
            ))}
          </View>

          <Pressable
            accessibilityLabel="Search papers"
            onPress={() => {
              void runSearch();
            }}
            style={[styles.primaryButton, isLoading ? styles.primaryButtonDisabled : null]}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryButtonLabel}>Search papers</Text>
            )}
          </Pressable>
        </View>

        {errorMessage ? (
          <View style={[styles.statePanel, styles.errorPanel]}>
            <Text style={styles.stateTitle}>We couldn&apos;t complete that search.</Text>
            <Text style={styles.stateCopy}>{errorMessage}</Text>
          </View>
        ) : null}

        {!errorMessage && !hasSearched ? (
          <View style={styles.statePanel}>
            <Text style={styles.stateTitle}>Start with a real topic</Text>
            <Text style={styles.stateCopy}>
              Use a precise topic, method, or research question to pull the strongest recent matches.
            </Text>
          </View>
        ) : null}

        {!errorMessage && hasSearched && results.length === 0 ? (
          <View style={styles.statePanel}>
            <Text style={styles.stateTitle}>No papers matched that query.</Text>
            <Text style={styles.stateCopy}>Try broader terms or a shorter topic phrase.</Text>
          </View>
        ) : null}

        {!errorMessage && results.length > 0 ? (
          <View style={styles.resultsWrap}>
            <View style={styles.resultsHeader}>
              <View>
                <Text style={styles.resultsLabel}>Results</Text>
                <Text style={styles.resultsTitle}>{submittedQuery}</Text>
              </View>
              <Text style={styles.resultsCount}>{results.length} papers</Text>
            </View>

            {results.map((paper) => (
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
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  errorPanel: {
    backgroundColor: colors.dangerSoft,
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
  input: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    color: colors.text,
    fontFamily: fontFamilies.body,
    fontSize: 16,
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  inputLabel: {
    color: colors.mutedText,
    fontFamily: fontFamilies.medium,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.text,
    borderRadius: 999,
    marginTop: 18,
    minHeight: 52,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  primaryButtonDisabled: {
    opacity: 0.75,
  },
  primaryButtonLabel: {
    color: '#fff',
    fontFamily: fontFamilies.semibold,
    fontSize: 15,
  },
  resultsCount: {
    color: colors.mutedText,
    fontFamily: fontFamilies.medium,
    fontSize: 13,
  },
  resultsHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  resultsLabel: {
    color: colors.teal,
    fontFamily: fontFamilies.semibold,
    fontSize: 13,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
  },
  resultsTitle: {
    color: colors.text,
    fontFamily: fontFamilies.serif,
    fontSize: 24,
    marginTop: 6,
  },
  resultsWrap: {
    marginTop: 24,
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  searchPanel: {
    backgroundColor: colors.backgroundStrong,
    borderRadius: 24,
    marginTop: 24,
    padding: 18,
  },
  sectionLabel: {
    color: colors.teal,
    fontFamily: fontFamilies.semibold,
    fontSize: 13,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
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
  subtitle: {
    color: colors.mutedText,
    fontFamily: fontFamilies.body,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
    maxWidth: '94%',
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
    marginTop: 16,
  },
});