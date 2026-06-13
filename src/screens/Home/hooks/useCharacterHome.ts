import {useState} from 'react';

import {pickRandomOptions} from '../constants/preferenceOptions';
import type {
  MoodType,
  PreferenceKey,
  PreferenceOption,
  UserPreferences,
} from '../types';

export const useCharacterHome = () => {
  const [userMood, setUserMood] = useState<MoodType>('neutral');
  const [isInteracting, setIsInteracting] = useState(false);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({});
  const [selectedAction, setSelectedAction] = useState<PreferenceKey | null>(
    null,
  );
  const [currentOptions, setCurrentOptions] = useState<PreferenceOption[]>([]);

  const handleActionSelect = (action: PreferenceKey) => {
    if (userPreferences[action]) {
      return;
    }

    setSelectedAction(action);
    setCurrentOptions(pickRandomOptions(action));
  };

  const handleOptionSelect = (choice: string) => {
    if (!selectedAction) {
      return;
    }

    setIsInteracting(true);
    setUserPreferences(prev => ({...prev, [selectedAction]: choice}));
    setSelectedAction(null);
    setCurrentOptions([]);

    if (userMood !== 'happy') {
      setTimeout(() => setUserMood('happy'), 500);
    }

    setTimeout(() => {
      setIsInteracting(false);
    }, 1000);
  };

  const handleCancelOptions = () => {
    setSelectedAction(null);
    setCurrentOptions([]);
  };

  return {
    userMood,
    setUserMood,
    isInteracting,
    userPreferences,
    selectedAction,
    currentOptions,
    handleActionSelect,
    handleOptionSelect,
    handleCancelOptions,
  };
};
