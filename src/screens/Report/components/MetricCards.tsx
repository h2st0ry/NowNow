import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Activity, HeartPulse} from 'lucide-react-native';

import {useAppTheme} from '../../../theme/ThemeProvider';
import type {MetricType} from '../types';

interface MetricCardsProps {
  selectedMetric: MetricType;
  onSelectMetric: (metric: MetricType) => void;
}

const metrics: {
  key: MetricType;
  label: string;
  value: string;
  Icon: typeof HeartPulse;
}[] = [
  {key: 'heartRate', label: '심박수', value: '72 bpm', Icon: HeartPulse},
  {key: 'bloodPressure', label: '혈압', value: '118/76', Icon: Activity},
];

export default function MetricCards({
  selectedMetric,
  onSelectMetric,
}: MetricCardsProps) {
  const {theme} = useAppTheme();

  return (
    <View style={styles.grid}>
      {metrics.map(({key, label, value, Icon}) => {
        const selected = selectedMetric === key;

        return (
          <Pressable
            key={key}
            onPress={() => onSelectMetric(key)}
            style={({pressed}) => [
              styles.card,
              {backgroundColor: theme.surface, borderColor: theme.border},
              selected && styles.selectedCard,
              selected && {
                backgroundColor: theme.accent,
                borderColor: theme.accent,
              },
              pressed && styles.pressedCard,
            ]}>
            <Icon color={selected ? theme.accentText : theme.accent} size={22} />
            <Text
              style={[
                styles.label,
                {color: theme.text},
                selected && styles.selectedText,
                selected && {color: theme.accentText},
              ]}>
              {label}
            </Text>
            <Text
              style={[
                styles.value,
                {color: theme.text},
                selected && styles.selectedText,
                selected && {color: theme.accentText},
              ]}>
              {value}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    gap: 10,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    padding: 13,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.12,
    shadowRadius: 7,
    elevation: 3,
  },
  selectedCard: {
  },
  pressedCard: {
    opacity: 0.8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
  value: {
    fontSize: 19,
    fontWeight: '800',
    marginTop: 3,
  },
  selectedText: {
  },
});
