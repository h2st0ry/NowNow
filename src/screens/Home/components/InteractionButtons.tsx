import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Gamepad2, Music, PartyPopper, Utensils } from 'lucide-react-native';

import { useAppTheme } from '../../../theme/ThemeProvider';
import type {
  PreferenceKey,
  PreferenceOption,
  UserPreferences,
} from '../types';

interface InteractionButtonsProps {
  selectedAction: PreferenceKey | null;
  options: PreferenceOption[];
  completedPreferences: UserPreferences;
  onActionSelect: (action: PreferenceKey) => void;
  onOptionSelect: (choice: string) => void;
  onCancelOptions: () => void;
}

const actions: {
  key: PreferenceKey;
  label: string;
  Icon: typeof Utensils;
}[] = [
  { key: 'feed', label: '먹이 주기', Icon: Utensils },
  { key: 'play', label: '놀아 주기', Icon: Gamepad2 },
  { key: 'music', label: '음악 듣기', Icon: Music },
  { key: 'hobby', label: '휴식 취하기', Icon: PartyPopper },
];

export default function InteractionButtons({
  selectedAction,
  options,
  completedPreferences,
  onActionSelect,
  onOptionSelect,
  onCancelOptions,
}: InteractionButtonsProps) {
  const { theme } = useAppTheme();

  if (selectedAction) {
    return (
      <View style={[styles.panel, { backgroundColor: theme.surface }]}>
        <Pressable
          onPress={onCancelOptions}
          style={styles.optionBackdrop}
          accessibilityRole="button"
        >
          {options.map(option => (
            <Pressable
              key={option.label}
              onPress={() => onOptionSelect(option.label)}
              style={({ pressed }) => [
                styles.optionButton,
                {
                  backgroundColor: theme.surfaceMuted,
                  borderColor: theme.border,
                },
                pressed && styles.pressedButton,
              ]}
            >
              <Text style={[styles.optionLabel, { color: theme.text }]}>
                {option.label}
              </Text>
            </Pressable>
          ))}
        </Pressable>
      </View>
    );
  }

  return (
    <View
      style={[styles.panel, styles.grid, { backgroundColor: theme.surface }]}
    >
      {actions.map(({ key, label, Icon }) => {
        const completedValue = completedPreferences[key];
        const displayLabel = completedValue ?? label;

        return (
          <Pressable
            key={key}
            disabled={Boolean(completedValue)}
            onPress={() => onActionSelect(key)}
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: theme.surfaceMuted,
                borderColor: theme.border,
              },
              pressed && !completedValue && styles.pressedButton,
              completedValue && styles.completedButton,
            ]}
          >
            <Icon
              color={completedValue ? theme.textMuted : theme.icon}
              size={24}
            />
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[styles.label, { color: theme.text }]}
            >
              {displayLabel}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderRadius: 20,
    height: 144,
    padding: 12,
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  button: {
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 18,
    flexBasis: '48%',
    flexDirection: 'row',
    gap: 9,
    height: 54,
    justifyContent: 'center',
  },
  completedButton: {
    opacity: 0.78,
  },
  pressedButton: {
    opacity: 0.72,
  },
  label: {
    flexShrink: 1,
    fontSize: 13,
    fontWeight: '600',
  },
  optionBackdrop: {
    flex: 1,
    justifyContent: 'center',
    rowGap: 8,
  },
  optionButton: {
    borderRadius: 17,
    borderWidth: 1,
    height: 34,
    paddingHorizontal: 14,
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  optionLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
});
