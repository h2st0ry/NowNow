export type MoodType = 'happy' | 'neutral' | 'sad';

export type PreferenceKey = 'feed' | 'play' | 'hobby' | 'music';

export type UserPreferences = Partial<Record<PreferenceKey, string>>;

export interface PreferenceOption {
  label: string;
}
