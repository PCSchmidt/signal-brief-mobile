import AsyncStorage from '@react-native-async-storage/async-storage';

import { Paper, TopicKey } from '../types';

const STORAGE_KEY = 'signal-brief-mobile/app-state-v1';

const VALID_TOPICS: TopicKey[] = [
  'agents',
  'evaluation',
  'fine-tuning',
  'inference',
  'llms',
  'multimodal',
  'optimization',
  'rag',
  'reasoning',
  'robotics',
  'safety',
  'vision',
];

export type PersistedAppState = {
  deviceId: string;
  hasCompletedOnboarding: boolean;
  notificationsEnabled: boolean;
  paperCache: Paper[];
  savedPaperIds: string[];
  selectedTopics: TopicKey[];
};

export async function loadPersistedAppState(): Promise<PersistedAppState | null> {
  const rawState = await AsyncStorage.getItem(STORAGE_KEY);

  if (!rawState) {
    return null;
  }

  try {
    return parsePersistedState(JSON.parse(rawState));
  } catch {
    await AsyncStorage.removeItem(STORAGE_KEY);
    return null;
  }
}


export async function savePersistedAppState(state: PersistedAppState): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}


function parsePersistedState(value: unknown): PersistedAppState | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const candidate = value as Partial<PersistedAppState>;

  if (
    typeof candidate.hasCompletedOnboarding !== 'boolean' ||
    typeof candidate.notificationsEnabled !== 'boolean' ||
    !Array.isArray(candidate.savedPaperIds) ||
    !Array.isArray(candidate.selectedTopics) ||
    !Array.isArray(candidate.paperCache)
  ) {
    return null;
  }

  return {
    deviceId: typeof candidate.deviceId === 'string' ? candidate.deviceId : '',
    hasCompletedOnboarding: candidate.hasCompletedOnboarding,
    notificationsEnabled: candidate.notificationsEnabled,
    paperCache: candidate.paperCache.filter(isPaper),
    savedPaperIds: candidate.savedPaperIds.filter((paperId): paperId is string => typeof paperId === 'string'),
    selectedTopics: candidate.selectedTopics.filter(isTopicKey),
  };
}


function isPaper(value: unknown): value is Paper {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<Paper>;

  return (
    typeof candidate.abstractExcerpt === 'string' &&
    typeof candidate.arxivUrl === 'string' &&
    typeof candidate.authors === 'string' &&
    typeof candidate.id === 'string' &&
    typeof candidate.publishedAt === 'string' &&
    typeof candidate.rank === 'number' &&
    Array.isArray(candidate.summaryBullets) &&
    candidate.summaryBullets.every((bullet) => typeof bullet === 'string') &&
    Array.isArray(candidate.tags) &&
    candidate.tags.every(isTopicKey) &&
    typeof candidate.title === 'string' &&
    Array.isArray(candidate.whyItMatters) &&
    candidate.whyItMatters.every((bullet) => typeof bullet === 'string')
  );
}


function isTopicKey(value: unknown): value is TopicKey {
  return typeof value === 'string' && VALID_TOPICS.includes(value as TopicKey);
}