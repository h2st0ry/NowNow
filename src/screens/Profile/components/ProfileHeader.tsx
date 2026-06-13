import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {User} from 'lucide-react-native';

import {useAppTheme} from '../../../theme/ThemeProvider';
import {profile} from '../constants/profileData';

export default function ProfileHeader() {
  const {theme} = useAppTheme();

  return (
    <View style={[styles.card, {backgroundColor: theme.surface}]}>
      <View style={[styles.avatar, {backgroundColor: theme.accent}]}>
        <User color={theme.accentText} size={32} />
      </View>
      <View>
        <Text style={[styles.name, {color: theme.text}]}>{profile.name}</Text>
        <Text style={[styles.message, {color: theme.textMuted}]}>
          {profile.message}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    borderRadius: 20,
    flexDirection: 'row',
    gap: 16,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 4,
  },
  avatar: {
    alignItems: 'center',
    borderRadius: 32,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
  },
  message: {
    fontSize: 14,
    marginTop: 5,
  },
});
