import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  IBMPlexSans_400Regular,
  IBMPlexSans_500Medium,
  IBMPlexSans_600SemiBold,
} from '@expo-google-fonts/ibm-plex-sans';
import {
  SourceSerif4_600SemiBold,
  SourceSerif4_700Bold,
} from '@expo-google-fonts/source-serif-4';
import { Feather } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useMemo, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { TOPIC_OPTIONS } from './src/data/mockData';
import { DailyBriefScreen } from './src/screens/DailyBriefScreen';
import { PaperDetailScreen } from './src/screens/PaperDetailScreen';
import { SavedScreen } from './src/screens/SavedScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { SplashScreen } from './src/screens/SplashScreen';
import { loadPersistedAppState, savePersistedAppState } from './src/services/appStorage';
import { TopicOnboardingScreen } from './src/screens/TopicOnboardingScreen';
import { fetchTodayBrief } from './src/services/briefApi';
import { colors, navigationTheme } from './src/theme';
import { DailyBrief, MainTabParamList, Paper, RootStackParamList, TopicKey } from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const DEFAULT_TOPICS: TopicKey[] = ['llms', 'evaluation', 'inference'];

function MainTabs({
  briefError,
  digestDateLabel,
  digestPapers,
  isRefreshing,
  papersById,
  savedPaperIds,
  selectedTopics,
  notificationsEnabled,
  onEditTopics,
  onOpenPaper,
  onRefreshBrief,
  onToggleNotifications,
  onToggleSave,
}: {
  briefError: string | null;
  digestDateLabel: string;
  digestPapers: Paper[];
  isRefreshing: boolean;
  papersById: Map<string, Paper>;
  savedPaperIds: string[];
  selectedTopics: TopicKey[];
  notificationsEnabled: boolean;
  onEditTopics: () => void;
  onOpenPaper: (paperId: string) => void;
  onRefreshBrief: () => void;
  onToggleNotifications: () => void;
  onToggleSave: (paperId: string) => void;
}) {
  const savedPapers = savedPaperIds
    .map((paperId) => papersById.get(paperId))
    .filter((paper): paper is Paper => Boolean(paper));

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.teal,
        tabBarInactiveTintColor: colors.mutedText,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: 74,
          paddingTop: 10,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontFamily: 'IBMPlexSans_500Medium',
          fontSize: 12,
        },
        tabBarIcon: ({ color, size }) => {
          const iconName =
            route.name === 'Brief'
              ? 'file-text'
              : route.name === 'Saved'
                ? 'bookmark'
                : 'sliders';

          return <Feather color={color} name={iconName} size={size} />;
        },
      })}
    >
      <Tab.Screen name="Brief">
        {() => (
          <DailyBriefScreen
            digestDateLabel={digestDateLabel}
            errorMessage={briefError}
            isLoading={isRefreshing}
            onOpenPaper={onOpenPaper}
            onRefresh={onRefreshBrief}
            onToggleSave={onToggleSave}
            papers={digestPapers}
            savedPaperIds={savedPaperIds}
            selectedTopics={selectedTopics}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Saved">
        {() => (
          <SavedScreen
            onOpenPaper={onOpenPaper}
            onToggleSave={onToggleSave}
            papers={savedPapers}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Settings">
        {() => (
          <SettingsScreen
            notificationsEnabled={notificationsEnabled}
            onEditTopics={onEditTopics}
            onToggleNotifications={onToggleNotifications}
            selectedTopics={selectedTopics}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    IBMPlexSans_400Regular,
    IBMPlexSans_500Medium,
    IBMPlexSans_600SemiBold,
    SourceSerif4_600SemiBold,
    SourceSerif4_700Bold,
  });
  const [hasHydratedState, setHasHydratedState] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<TopicKey[]>(DEFAULT_TOPICS);
  const [savedPaperIds, setSavedPaperIds] = useState<string[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dailyBrief, setDailyBrief] = useState<DailyBrief | null>(null);
  const [paperCache, setPaperCache] = useState<Record<string, Paper>>({});
  const [briefError, setBriefError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!fontsLoaded) {
      return;
    }

    const timer = setTimeout(() => {
      setIsBooting(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [fontsLoaded]);

  useEffect(() => {
    let isMounted = true;

    async function hydrateState() {
      try {
        const persistedState = await loadPersistedAppState();

        if (!isMounted || !persistedState) {
          return;
        }

        setHasCompletedOnboarding(persistedState.hasCompletedOnboarding);
        setNotificationsEnabled(persistedState.notificationsEnabled);
        setPaperCache(
          Object.fromEntries(persistedState.paperCache.map((paper) => [paper.id, paper]))
        );
        setSavedPaperIds(persistedState.savedPaperIds);
        setSelectedTopics(
          persistedState.selectedTopics.length > 0 ? persistedState.selectedTopics : DEFAULT_TOPICS
        );
      } finally {
        if (isMounted) {
          setHasHydratedState(true);
        }
      }
    }

    void hydrateState();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hasHydratedState) {
      return;
    }

    void savePersistedAppState({
      hasCompletedOnboarding,
      notificationsEnabled,
      paperCache: Object.values(paperCache),
      savedPaperIds,
      selectedTopics,
    });
  }, [
    hasCompletedOnboarding,
    hasHydratedState,
    notificationsEnabled,
    paperCache,
    savedPaperIds,
    selectedTopics,
  ]);

  const refreshBrief = async () => {
    setIsRefreshing(true);

    try {
      const nextBrief = await fetchTodayBrief(selectedTopics);
      setDailyBrief(nextBrief);
      setBriefError(null);
      setPaperCache((currentCache) => {
        const nextCache = { ...currentCache };

        nextBrief.papers.forEach((paper) => {
          nextCache[paper.id] = paper;
        });

        return nextCache;
      });
    } catch (error) {
      setBriefError(
        error instanceof Error
          ? `${error.message}. Confirm the FastAPI backend is running and reachable from Expo.`
          : 'Unexpected error while loading the brief.'
      );
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!fontsLoaded || !hasHydratedState || isBooting || !hasCompletedOnboarding) {
      return;
    }

    void refreshBrief();
  }, [fontsLoaded, hasCompletedOnboarding, hasHydratedState, isBooting, selectedTopics]);

  const digestPapers = useMemo(() => {
    return dailyBrief?.papers ?? [];
  }, [dailyBrief]);

  const digestDateLabel = useMemo(() => {
    if (!dailyBrief?.digestDate) {
      return 'Today';
    }

    return new Date(`${dailyBrief.digestDate}T00:00:00`).toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'long',
    });
  }, [dailyBrief]);

  const papersById = useMemo(() => {
    return new Map(Object.entries(paperCache));
  }, [paperCache]);

  const toggleSave = (paperId: string) => {
    setSavedPaperIds((currentIds) => {
      if (currentIds.includes(paperId)) {
        return currentIds.filter((currentId) => currentId !== paperId);
      }

      return [paperId, ...currentIds];
    });
  };

  if (!fontsLoaded || !hasHydratedState || isBooting) {
    return <SplashScreen />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navigationTheme}>
        <StatusBar style="dark" />
        <Stack.Navigator
          initialRouteName={hasCompletedOnboarding ? 'MainTabs' : 'Onboarding'}
          key={hasCompletedOnboarding ? 'ready' : 'setup'}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Onboarding">
            {({ navigation, route }) => (
              <TopicOnboardingScreen
                mode={hasCompletedOnboarding ? route.params?.mode ?? 'edit' : 'setup'}
                onContinue={() => {
                  if (!hasCompletedOnboarding) {
                    setHasCompletedOnboarding(true);
                    return;
                  }

                  navigation.goBack();
                }}
                onSelectionChange={setSelectedTopics}
                selectedTopics={selectedTopics}
                topics={TOPIC_OPTIONS}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="MainTabs">
            {({ navigation }) => (
              <MainTabs
                briefError={briefError}
                digestDateLabel={digestDateLabel}
                digestPapers={digestPapers}
                isRefreshing={isRefreshing}
                notificationsEnabled={notificationsEnabled}
                onEditTopics={() => navigation.navigate('Onboarding', { mode: 'edit' })}
                onOpenPaper={(paperId) => navigation.navigate('PaperDetail', { paperId })}
                onRefreshBrief={() => {
                  void refreshBrief();
                }}
                onToggleNotifications={() => setNotificationsEnabled((current) => !current)}
                onToggleSave={toggleSave}
                papersById={papersById}
                savedPaperIds={savedPaperIds}
                selectedTopics={selectedTopics}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="PaperDetail">
            {({ navigation, route }) => (
              <PaperDetailScreen
                isSaved={savedPaperIds.includes(route.params.paperId)}
                onBack={() => navigation.goBack()}
                onToggleSave={toggleSave}
                paper={papersById.get(route.params.paperId) ?? null}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
