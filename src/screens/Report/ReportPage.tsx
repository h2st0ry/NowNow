import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import MetricCards from './components/MetricCards';
import ReportHeader from './components/ReportHeader';
import SleepCard from './components/SleepCard';
import StressCauseCard from './components/StressCauseCard';
import TrendChart from './components/TrendChart';
import { useReport } from './hooks/useReport';
import { useAppTheme } from '../../theme/ThemeProvider';

export default function ReportPage() {
  const { theme } = useAppTheme();
  const {
    selectedMetric,
    setSelectedMetric,
    stressPeriod,
    setStressPeriod,
    stressCauses,
  } = useReport();

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
      edges={['top']}
    >
      <ScrollView
        alwaysBounceVertical
        keyboardShouldPersistTaps="handled"
        scrollEnabled
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ReportHeader />
        <MetricCards
          selectedMetric={selectedMetric}
          onSelectMetric={setSelectedMetric}
        />
        <TrendChart selectedMetric={selectedMetric} />
        <StressCauseCard
          causes={stressCauses}
          period={stressPeriod}
          onPeriodChange={setStressPeriod}
        />
        <SleepCard />
      </ScrollView>
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
    paddingBottom: 110,
    paddingHorizontal: 18,
    paddingTop: 18,
    rowGap: 16,
  },
});
