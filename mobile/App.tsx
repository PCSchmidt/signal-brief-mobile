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

import { MOCK_PAPERS, TOPIC_OPTIONS } from './src/data/mockData';
import { DailyBriefScreen } from './src/screens/DailyBriefScreen';
import { PaperDetailScreen } from './src/screens/PaperDetailScreen';
import { SavedScreen } from './src/screens/SavedScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { SplashScreen } from './src/screens/SplashScreen';
import { TopicOnboardingScreen } from './src/screens/TopicOnboardingScreen';
import { colors, navigationTheme } from './src/theme';
import { MainTabParamList, Paper, RootStackParamList, TopicKey } from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const DEFAULT_TOPICS: TopicKey[] = ['llms', 'evaluation', 'inference'];

function MainTabs({
  digestPapers,
  papersById,
  savedPaperIds,
  selectedTopics,
  notificationsEnabled,
  onEditTopics,
  onOpenPaper,
  onToggleNotifications,
  onToggleSave,
}: {
  digestPapers: Paper[];
  papersById: Map<string, Paper>;
  savedPaperIds: string[];
  selectedTopics: TopicKey[];
  notificationsEnabled: boolean;
  onEditTopics: () => void;
  onOpenPaper: (paperId: string) => void;
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
            digestDateLabel="Today, May 13"
            onOpenPaper={onOpenPaper}
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
  const [isBooting, setIsBooting] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<TopicKey[]>(DEFAULT_TOPICS);
  const [savedPaperIds, setSavedPaperIds] = useState<string[]>(['paper-3']);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    if (!fontsLoaded) {
      return;
    }

    const timer = setTimeout(() => {
      setIsBooting(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [fontsLoaded]);

  const digestPapers = useMemo(() => {
    return [...MOCK_PAPERS]
      .sort((left, right) => {
        const leftOverlap = left.tags.filter((tag) => selectedTopics.includes(tag)).length;
        const rightOverlap = right.tags.filter((tag) => selectedTopics.includes(tag)).length;

        if (rightOverlap !== leftOverlap) {
          return rightOverlap - leftOverlap;
        }

        return right.score - left.score;
      })
      .slice(0, 5);
  }, [selectedTopics]);

  const papersById = useMemo(() => {
    return new Map(MOCK_PAPERS.map((paper) => [paper.id, paper]));
  }, []);

  const toggleSave = (paperId: string) => {
    setSavedPaperIds((currentIds) => {
      if (currentIds.includes(paperId)) {
        return currentIds.filter((currentId) => currentId !== paperId);
      }

      return [paperId, ...currentIds];
    });
  };

  if (!fontsLoaded || isBooting) {
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
                digestPapers={digestPapers}
                notificationsEnabled={notificationsEnabled}
                onEditTopics={() => navigation.navigate('Onboarding', { mode: 'edit' })}
                onOpenPaper={(paperId) => navigation.navigate('PaperDetail', { paperId })}
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
