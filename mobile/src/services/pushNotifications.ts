import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { API_BASE_URL } from '../config';
import { TopicKey } from '../types';

type NativePlatform = 'android' | 'ios';

type PushRegistrationPayload = {
  device_id: string;
  notifications_enabled: boolean;
  platform: NativePlatform;
  push_token: string | null;
  selected_topics: TopicKey[];
};

export type PushRegistrationStatus = 'error' | 'info' | 'success' | 'warning';

export type PushRegistrationResult = {
  message: string;
  registered: boolean;
  status: PushRegistrationStatus;
};

export async function syncPushNotificationPreference({
  deviceId,
  notificationsEnabled,
  selectedTopics,
}: {
  deviceId: string;
  notificationsEnabled: boolean;
  selectedTopics: TopicKey[];
}): Promise<PushRegistrationResult> {
  const platform = getNativePlatform();

  if (!platform) {
    return {
      message: 'Push registration only runs on iOS and Android builds.',
      registered: false,
      status: 'info',
    };
  }

  if (!notificationsEnabled) {
    await registerPushPreference({
      device_id: deviceId,
      notifications_enabled: false,
      platform,
      push_token: null,
      selected_topics: selectedTopics,
    });

    return {
      message: 'Notifications are turned off for this device.',
      registered: true,
      status: 'info',
    };
  }

  if (platform === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#0f766e',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const permissionRequest = await Notifications.requestPermissionsAsync();
    finalStatus = permissionRequest.status;
  }

  if (finalStatus !== 'granted') {
    await registerPushPreference({
      device_id: deviceId,
      notifications_enabled: false,
      platform,
      push_token: null,
      selected_topics: selectedTopics,
    });

    return {
      message: 'Notification permission was not granted on this device.',
      registered: false,
      status: 'warning',
    };
  }

  try {
    const pushToken = await getExpoPushToken();

    await registerPushPreference({
      device_id: deviceId,
      notifications_enabled: true,
      platform,
      push_token: pushToken,
      selected_topics: selectedTopics,
    });

    return {
      message: 'Push notifications are registered for this device.',
      registered: true,
      status: 'success',
    };
  } catch (error) {
    await registerPushPreference({
      device_id: deviceId,
      notifications_enabled: false,
      platform,
      push_token: null,
      selected_topics: selectedTopics,
    });

    return {
      message:
        error instanceof Error
          ? `Unable to register push notifications: ${error.message}`
          : 'Unable to register push notifications on this device.',
      registered: false,
      status: 'error',
    };
  }
}

async function getExpoPushToken(): Promise<string> {
  const projectId = getProjectId();
  const tokenResponse = projectId
    ? await Notifications.getExpoPushTokenAsync({ projectId })
    : await Notifications.getExpoPushTokenAsync();

  if (!tokenResponse.data) {
    throw new Error('Expo did not return a push token.');
  }

  return tokenResponse.data;
}

function getProjectId(): string | undefined {
  const extraProjectId = process.env.EXPO_PUBLIC_EXPO_PROJECT_ID?.trim();

  if (extraProjectId) {
    return extraProjectId;
  }

  const expoProjectId = Constants.expoConfig?.extra?.eas?.projectId;

  if (typeof expoProjectId === 'string' && expoProjectId.trim()) {
    return expoProjectId.trim();
  }

  if (typeof Constants.easConfig?.projectId === 'string' && Constants.easConfig.projectId.trim()) {
    return Constants.easConfig.projectId.trim();
  }

  return undefined;
}

async function registerPushPreference(payload: PushRegistrationPayload): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/device/register-push-token`, {
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error(`Push registration failed with status ${response.status}`);
  }
}

function getNativePlatform(): NativePlatform | null {
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    return Platform.OS;
  }

  return null;
}