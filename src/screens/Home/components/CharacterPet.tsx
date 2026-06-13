import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, View} from 'react-native';

import type {MoodType} from '../types';

interface CharacterPetProps {
  mood: MoodType;
  isInteracting: boolean;
}

const characterImage = require('../../../assets/images/charactor.png');

export default function CharacterPet({isInteracting}: CharacterPetProps) {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const bounceDirectionRef = useRef(-1);

  useEffect(() => {
    if (!isInteracting) {
      return;
    }

    bounceDirectionRef.current *= -1;
    bounceAnim.setValue(0);

    Animated.sequence([
      Animated.timing(bounceAnim, {
        duration: 130,
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        duration: 130,
        toValue: -0.45,
        useNativeDriver: true,
      }),
      Animated.spring(bounceAnim, {
        friction: 4,
        tension: 120,
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  }, [bounceAnim, isInteracting]);

  const translateY = bounceAnim.interpolate({
    inputRange: [-0.45, 0, 1],
    outputRange: [3, 0, -13],
  });

  const scale = bounceAnim.interpolate({
    inputRange: [-0.45, 0, 1],
    outputRange: [0.98, 1, 1.08],
  });

  const direction = bounceDirectionRef.current;

  const translateX = bounceAnim.interpolate({
    inputRange: [-0.45, 0, 1],
    outputRange: [-3 * direction, 0, 9 * direction],
  });

  const rotate = bounceAnim.interpolate({
    inputRange: [-0.45, 0, 1],
    outputRange:
      direction > 0 ? ['-3deg', '0deg', '5deg'] : ['3deg', '0deg', '-5deg'],
  });

  return (
    <View style={styles.stage}>
      <Animated.Image
        source={characterImage}
        resizeMode="contain"
        style={[
          styles.character,
          {
            transform: [{translateX}, {translateY}, {scale}, {rotate}],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    alignItems: 'center',
    height: 164,
    justifyContent: 'center',
    width: '100%',
  },
  character: {
    height: 140,
    width: 140,
  },
});
