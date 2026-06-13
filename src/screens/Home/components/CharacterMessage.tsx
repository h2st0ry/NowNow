import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '../../../theme/ThemeProvider';
import type { MoodType } from '../types';

interface CharacterMessageProps {
  userMood: MoodType;
}

const messages: Record<MoodType, string> = {
  sad: '오늘 기분이 좋지 않아 보여...\n무슨 일 있어?',
  neutral: '오늘은 차분한 하루였나 봐.\n조금 더 들려줄래?',
  happy: '기분이 좋아 보여서 나도 좋아!\n오늘 좋은 일이 있었어?',
};

export default function CharacterMessage({ userMood }: CharacterMessageProps) {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.surface }]}>
      <Text style={[styles.message, { color: theme.text }]}>
        {messages[userMood]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    borderRadius: 20,
    minHeight: 86,
    justifyContent: 'center',
    paddingHorizontal: 22,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
  message: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
  },
});
