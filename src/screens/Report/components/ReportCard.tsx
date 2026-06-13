import React from 'react';
import {StyleSheet, View, type ViewStyle} from 'react-native';
import {useAppTheme} from '../../../theme/ThemeProvider';

interface ReportCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function ReportCard({children, style}: ReportCardProps) {
  const {theme} = useAppTheme();

  return (
    <View style={[styles.card, {backgroundColor: theme.surface}, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 18,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 4,
  },
});
