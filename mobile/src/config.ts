import { Platform } from 'react-native';

const fallbackApiBaseUrl = Platform.select({
  android: 'http://10.0.2.2:8000',
  default: 'http://127.0.0.1:8000',
});

const configuredApiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim().replace(/\/$/, '');

export const API_BASE_URL =
  configuredApiBaseUrl || fallbackApiBaseUrl || 'http://127.0.0.1:8000';