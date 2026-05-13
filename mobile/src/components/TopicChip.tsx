import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, fontFamilies } from '../theme';

export function TopicChip({
  label,
  onPress,
  selected,
}: {
  label: string;
  onPress?: () => void;
  selected?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected ? styles.selectedChip : null,
        pressed ? styles.pressedChip : null,
      ]}
    >
      <Text style={[styles.label, selected ? styles.selectedLabel : null]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  label: {
    color: colors.text,
    fontFamily: fontFamilies.medium,
    fontSize: 13,
  },
  pressedChip: {
    opacity: 0.88,
  },
  selectedChip: {
    backgroundColor: colors.teal,
    borderColor: colors.teal,
  },
  selectedLabel: {
    color: '#fff',
  },
});