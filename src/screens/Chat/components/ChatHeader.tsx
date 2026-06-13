import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {ChevronLeft} from 'lucide-react-native';

import {useAppTheme} from '../../../theme/ThemeProvider';
import ChatAvatar from './ChatAvatar';

interface ChatHeaderProps {
  onBack: () => void;
}

export default function ChatHeader({onBack}: ChatHeaderProps) {
  const {theme} = useAppTheme();

  return (
    <View style={[styles.header, {backgroundColor: theme.background}]}>
      <Pressable
        onPress={onBack}
        style={({pressed}) => [
          styles.backButton,
          pressed && {backgroundColor: theme.pressed},
        ]}>
        <ChevronLeft color={theme.text} size={24} />
      </Pressable>
      <View style={styles.headerTitleArea}>
        <ChatAvatar />
        <Text style={[styles.headerTitle, {color: theme.text}]}>뿡뿡이</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  backButton: {
    alignItems: 'center',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    marginTop: 2,
    width: 36,
  },
  pressedBackButton: {
  },
  headerTitleArea: {
    alignItems: 'center',
    flex: 1,
    paddingRight: 36,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 5,
  },
});
