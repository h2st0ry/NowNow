import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Activity } from 'lucide-react-native';

import { useAppTheme } from '../../../theme/ThemeProvider';
import { bloodPressureInsightData } from '../constants/reportData';
import ReportCard from './ReportCard';

export default function SleepCard() {
  const { theme } = useAppTheme();

  return (
    <ReportCard>
      <View style={styles.header}>
        <Activity color={theme.accent} size={21} />
        <View>
          <Text style={[styles.title, { color: theme.text }]}>
            혈압 변화 포인트
          </Text>
          <Text style={[styles.subtitle, { color: theme.textMuted }]}>
            수축기 기준 108-132mmHg
          </Text>
        </View>
      </View>

      <View style={styles.rows}>
        {bloodPressureInsightData.map((item, index) => (
          <View key={item.name} style={styles.row}>
            <Text style={[styles.name, { color: theme.text }]}>
              {item.name}
            </Text>
            <View style={styles.progressArea}>
              <View
                style={[styles.track, { backgroundColor: theme.surfaceMuted }]}
              >
                <View
                  style={[
                    styles.progress,
                    {
                      width: `${item.percentage}%`,
                      backgroundColor: index === 0 ? theme.accent : item.color,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.value, { color: theme.text }]}>
                {item.valueLabel}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ReportCard>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 3,
  },
  rows: {
    marginTop: 18,
    rowGap: 14,
  },
  row: {
    gap: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
  },
  progressArea: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  track: {
    borderRadius: 5,
    flex: 1,
    height: 9,
    overflow: 'hidden',
  },
  progress: {
    borderRadius: 5,
    height: '100%',
  },
  value: {
    fontSize: 12,
    fontWeight: '700',
    width: 88,
  },
});
