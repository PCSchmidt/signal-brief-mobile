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
import { SearchScreen } from './src/screens/SearchScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { SplashScreen } from './src/screens/SplashScreen';
import { loadPersistedAppState, savePersistedAppState } from './src/services/appStorage';
import {
  PushRegistrationStatus,
  syncPushNotificationPreference,
} from './src/services/pushNotifications';
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
  isSyncingNotifications,
  isRefreshing,
  notificationStatusMessage,
  notificationStatusKind,
  papersById,
  savedPaperIds,
  selectedTopics,
  notificationsEnabled,
  onCachePapers,
  onEditTopics,
  onOpenPaper,
  onRefreshBrief,
  onToggleNotifications,
  onToggleSave,
}: {
  briefError: string | null;
  digestDateLabel: string;
  digestPapers: Paper[];
  isSyncingNotifications: boolean;
  isRefreshing: boolean;
  notificationStatusMessage: string | null;
  notificationStatusKind: PushRegistrationStatus | null;
  papersById: Map<string, Paper>;
  savedPaperIds: string[];
  selectedTopics: TopicKey[];
  notificationsEnabled: boolean;
  onCachePapers: (papers: Paper[]) => void;
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
            route.name === 'Search'
              ? 'search'
              : route.name === 'Brief'
              ? 'file-text'
              : route.name === 'Saved'
                ? 'bookmark'
                : 'sliders';

          return <Feather color={color} name={iconName} size={size} />;
        },
      })}
    >
      <Tab.Screen name="Search">
        {() => (
          <SearchScreen
            onCachePapers={onCachePapers}
            onOpenPaper={onOpenPaper}
            onToggleSave={onToggleSave}
            savedPaperIds={savedPaperIds}
            suggestedTopics={selectedTopics}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Brief">
        {() => (
          <DailyBriefScreen
            digestDateLabel={digestDateLabel}
            errorMessage={briefError}
            isLoading={isRefreshing}
            onEditTopics={onEditTopics}
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
            isSyncingNotifications={isSyncingNotifications}
            notificationStatusMessage={notificationStatusMessage}
            notificationStatusKind={notificationStatusKind}
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
  const [deviceId, setDeviceId] = useState('');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<TopicKey[]>(DEFAULT_TOPICS);
  const [savedPaperIds, setSavedPaperIds] = useState<string[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isSyncingNotifications, setIsSyncingNotifications] = useState(false);
  const [notificationStatusMessage, setNotificationStatusMessage] = useState<string | null>(null);
  const [notificationStatusKind, setNotificationStatusKind] = useState<PushRegistrationStatus | null>(null);
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
          if (isMounted) {
            setDeviceId(createDeviceId());
          }

          return;
        }

        setDeviceId(persistedState.deviceId || createDeviceId());
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
      deviceId,
      hasCompletedOnboarding,
      notificationsEnabled,
      paperCache: Object.values(paperCache),
      savedPaperIds,
      selectedTopics,
    });
  }, [
    deviceId,
    hasCompletedOnboarding,
    hasHydratedState,
    notificationsEnabled,
    paperCache,
    savedPaperIds,
    selectedTopics,
  ]);

  useEffect(() => {
    if (!hasHydratedState || !hasCompletedOnboarding || !deviceId) {
      return;
    }

    let isCancelled = false;

    async function syncNotifications() {
      if (!isCancelled) {
        setIsSyncingNotifications(true);
        setNotificationStatusKind('info');
        setNotificationStatusMessage(
          notificationsEnabled
            ? 'Saving notification settings for this device.'
            : 'Turning off notifications for this device.'
        );
      }

      try {
        const result = await syncPushNotificationPreference({
          deviceId,
          notificationsEnabled,
          selectedTopics,
        });

        if (!isCancelled) {
          setNotificationStatusKind(result.status);
          setNotificationStatusMessage(result.message);
        }
      } catch (error) {
        if (!isCancelled) {
          setNotificationStatusKind('error');
          setNotificationStatusMessage(
            error instanceof Error
              ? `Unable to sync notifications: ${error.message}`
              : 'Unable to sync notifications for this device.'
          );
        }
      } finally {
        if (!isCancelled) {
          setIsSyncingNotifications(false);
        }
      }
    }

    void syncNotifications();

    return () => {
      isCancelled = true;
    };
  }, [deviceId, hasCompletedOnboarding, hasHydratedState, notificationsEnabled, selectedTopics]);

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

  const cachePapers = (papers: Paper[]) => {
    setPaperCache((currentCache) => {
      const nextCache = { ...currentCache };

      papers.forEach((paper) => {
        nextCache[paper.id] = paper;
      });

      return nextCache;
    });
  };

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
                isSyncingNotifications={isSyncingNotifications}
                isRefreshing={isRefreshing}
                notificationStatusMessage={notificationStatusMessage}
                notificationStatusKind={notificationStatusKind}
                notificationsEnabled={notificationsEnabled}
                onCachePapers={cachePapers}
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

function createDeviceId(): string {
  return `device-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
