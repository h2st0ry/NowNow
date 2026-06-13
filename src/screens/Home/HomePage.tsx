import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CharacterMessage from './components/CharacterMessage';
import CharacterPet from './components/CharacterPet';
import InteractionButtons from './components/InteractionButtons';
import MoodSelector from './components/MoodSelector';
import { useCharacterHome } from './hooks/useCharacterHome';
import { useAppTheme } from '../../theme/ThemeProvider';

export default function HomePage() {
  const { theme } = useAppTheme();
  const {
    userMood,
    setUserMood,
    isInteracting,
    userPreferences,
    selectedAction,
    currentOptions,
    handleActionSelect,
    handleOptionSelect,
    handleCancelOptions,
  } = useCharacterHome();

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
      edges={['top']}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <View
            style={[styles.moodSection, { backgroundColor: theme.surface }]}
          >
            <Text style={[styles.title, { color: theme.text }]}>
              오늘 기분은 어떠세요?
            </Text>
            <MoodSelector selectedMood={userMood} onMoodChange={setUserMood} />
          </View>

          <View style={styles.petCard}>
            <CharacterPet mood={userMood} isInteracting={isInteracting} />
          </View>

          <View style={styles.middleStack}>
            <CharacterMessage userMood={userMood} />
            <InteractionButtons
              selectedAction={selectedAction}
              options={currentOptions}
              completedPreferences={userPreferences}
              onActionSelect={handleActionSelect}
              onOptionSelect={handleOptionSelect}
              onCancelOptions={handleCancelOptions}
            />
          </View>
          <View style={styles.footerSpacer} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 12,
  },

  moodSection: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 16,
    rowGap: 9,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },

  petCard: {
    flex: 0.9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  middleStack: {
    flex: 1,
    justifyContent: 'center',
    rowGap: 14,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 23,
    paddingHorizontal: 4,
    textAlign: 'center',
  },
  footerSpacer: {
    height: 78,
  },
});
