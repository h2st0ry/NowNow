import React, { useEffect, useMemo, useRef } from 'react';
import {
  PanResponder,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { format, isToday } from 'date-fns';
import { ko } from 'date-fns/locale';
import { SafeAreaView } from 'react-native-safe-area-context';

import ChatHeader from './components/ChatHeader';
import ChatInput from './components/ChatInput';
import MessageBubble from './components/MessageBubble';
import { useChatDiary } from './hooks/useChatDiary';
import { useAppTheme } from '../../theme/ThemeProvider';

interface ChatPageProps {
  onBack: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

export default function ChatPage({ onBack }: ChatPageProps) {
  const { theme } = useAppTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const swipeBackStartXRef = useRef(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const { messages, input, setInput, handleSend, handleButtonClick } =
    useChatDiary();

  const renderedItems = useMemo(() => {
    type RenderItem =
      | { type: 'separator'; key: string; label: string }
      | { type: 'message'; key: string; message: (typeof messages)[number] };

    const items: RenderItem[] = [];
    let previousDateKey: string | null = null;

    messages.forEach((message, index) => {
      const messageDate = new Date(message.createdAtIso);
      const dateKey = format(messageDate, 'yyyy-MM-dd');

      if (previousDateKey !== dateKey) {
        items.push({
          type: 'separator',
          key: `separator-${dateKey}-${index}`,
          label: isToday(messageDate)
            ? '오늘'
            : format(messageDate, 'yyyy년 M월 d일 E요일', { locale: ko }),
        });
        previousDateKey = dateKey;
      }

      items.push({
        type: 'message',
        key: `message-${index}`,
        message,
      });
    });

    return items;
  }, [messages]);

  const animateBack = () => {
    Animated.spring(slideAnim, {
      damping: 14,
      mass: 0.9,
      stiffness: 160,
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const completeBack = () => {
    Animated.timing(slideAnim, {
      duration: 180,
      toValue: screenWidth,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        onBack();
      }
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: (_, gestureState) => {
        swipeBackStartXRef.current = gestureState.x0;
        return false;
      },
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const startedFromLeftEdge = swipeBackStartXRef.current <= 28;
        const mostlyHorizontal = Math.abs(gestureState.dy) < 22;
        return startedFromLeftEdge && mostlyHorizontal && gestureState.dx > 12;
      },
      onPanResponderMove: (_, gestureState) => {
        const dragX = Math.max(0, gestureState.dx);
        slideAnim.setValue(dragX);
      },
      onPanResponderRelease: (_, gestureState) => {
        const startedFromLeftEdge = swipeBackStartXRef.current <= 28;
        const shouldGoBack =
          startedFromLeftEdge &&
          gestureState.dx > 70 &&
          Math.abs(gestureState.dy) < 28;

        if (shouldGoBack) {
          completeBack();
          swipeBackStartXRef.current = 0;
          return;
        }

        swipeBackStartXRef.current = 0;
        animateBack();
      },
      onPanResponderTerminate: () => {
        swipeBackStartXRef.current = 0;
        animateBack();
      },
    }),
  ).current;

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
      edges={['top', 'bottom']}
    >
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: theme.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.chatPanel,
            {
              backgroundColor: theme.background,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <ChatHeader onBack={() => completeBack()} />

          <ScrollView
            ref={scrollViewRef}
            style={styles.messageList}
            contentContainerStyle={styles.messageListContent}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() =>
              scrollViewRef.current?.scrollToEnd({ animated: true })
            }
          >
            {renderedItems.map(item => {
              if (item.type === 'separator') {
                return (
                  <View key={item.key} style={styles.daySeparatorWrap}>
                    <View
                      style={[
                        styles.dayLine,
                        { backgroundColor: theme.textMuted },
                      ]}
                    />
                    <Text style={[styles.dayLabel, { color: theme.textMuted }]}>
                      {item.label}
                    </Text>
                    <View
                      style={[
                        styles.dayLine,
                        { backgroundColor: theme.textMuted },
                      ]}
                    />
                  </View>
                );
              }

              return (
                <MessageBubble
                  key={item.key}
                  message={item.message}
                  onButtonPress={handleButtonClick}
                />
              );
            })}
          </ScrollView>

          <ChatInput
            value={input}
            onChangeText={setInput}
            onSend={handleSend}
          />
        </Animated.View>
      </KeyboardAvoidingView>
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
  chatPanel: {
    flex: 1,
    paddingBottom: 0,
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    paddingBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 16,
    rowGap: 12,
  },
  daySeparatorWrap: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 2,
  },
  dayLine: {
    flex: 1,
    height: 1,
    opacity: 0.5,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginHorizontal: 12,
  },
});
