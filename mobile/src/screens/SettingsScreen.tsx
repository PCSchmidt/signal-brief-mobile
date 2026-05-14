import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { PushRegistrationStatus } from '../services/pushNotifications';
import { colors, fontFamilies } from '../theme';
import { TopicKey } from '../types';

export function SettingsScreen({
  isSyncingNotifications,
  notificationStatusMessage,
  notificationStatusKind,
  notificationsEnabled,
  onEditTopics,
  onToggleNotifications,
  selectedTopics,
}: {
  isSyncingNotifications: boolean;
  notificationStatusMessage: string | null;
  notificationStatusKind: PushRegistrationStatus | null;
  notificationsEnabled: boolean;
  onEditTopics: () => void;
  onToggleNotifications: () => void;
  selectedTopics: TopicKey[];
}) {
  const statusStyle = getStatusStyle(notificationStatusKind);

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.sectionLabel}>Settings</Text>
        <Text style={styles.title}>Keep the brief narrow and useful</Text>

        <View style={styles.panel}>
          <View style={styles.panelRow}>
            <View>
              <Text style={styles.panelTitle}>Topics</Text>
              <Text style={styles.panelCopy}>{selectedTopics.map((topic) => topic.toUpperCase()).join(', ')}</Text>
            </View>
            <Pressable onPress={onEditTopics} style={styles.inlineAction}>
              <Text style={styles.inlineActionLabel}>Edit</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.panel}>
          <View style={styles.panelRow}>
            <View style={styles.panelCopyWrap}>
              <Feather color={colors.teal} name="bell" size={18} />
              <View>
                <Text style={styles.panelTitle}>Daily brief ready</Text>
                <Text style={styles.panelCopy}>Notify me when today&apos;s digest is available.</Text>
                {notificationStatusMessage ? (
                  <Text style={[styles.statusCopy, statusStyle]}>
                    {isSyncingNotifications ? 'Syncing. ' : ''}
                    {notificationStatusMessage}
                  </Text>
                ) : null}
              </View>
            </View>
            <Switch
              disabled={isSyncingNotifications}
              onValueChange={onToggleNotifications}
              thumbColor="#fff"
              trackColor={{ false: '#c8c1b1', true: colors.teal }}
              value={notificationsEnabled}
            />
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Digest info</Text>
          <Text style={styles.panelCopy}>Source set: arXiv AI categories</Text>
          <Text style={styles.panelCopy}>Daily count: 5 papers</Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>About this prototype</Text>
          <Text style={styles.panelCopy}>
            Built as a narrow mobile briefing app focused on concise summaries of recent AI papers.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
    padding: 22,
  },
  inlineAction: {
    backgroundColor: colors.backgroundStrong,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  inlineActionLabel: {
    color: colors.text,
    fontFamily: fontFamilies.medium,
    fontSize: 13,
  },
  panel: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 24,
    borderWidth: 1,
    padding: 18,
  },
  panelCopy: {
    color: colors.mutedText,
    fontFamily: fontFamilies.body,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  panelCopyWrap: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
    marginRight: 12,
  },
  panelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  panelTitle: {
    color: colors.text,
    fontFamily: fontFamilies.serif,
    fontSize: 24,
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  statusCopy: {
    color: colors.text,
    fontFamily: fontFamilies.medium,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
  },
  sectionLabel: {
    color: colors.teal,
    fontFamily: fontFamilies.semibold,
    fontSize: 13,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontFamily: fontFamilies.serifBold,
    fontSize: 34,
    lineHeight: 38,
    marginBottom: 8,
    marginTop: 4,
  },
});

function getStatusStyle(status: PushRegistrationStatus | null) {
  if (status === 'success') {
    return { color: colors.teal };
  }

  if (status === 'warning') {
    return { color: '#9a6700' };
  }

  if (status === 'error') {
    return { color: '#b42318' };
  }

  return { color: colors.text };
}