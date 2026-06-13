import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Sparkles} from 'lucide-react-native';
import {useAppTheme} from '../../../theme/ThemeProvider';

export default function ReportHeader() {
  const {theme} = useAppTheme();
  const today = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  return (
    <View style={[styles.header, {backgroundColor: theme.nav}]}>
      <View style={styles.iconWrap}>
        <Sparkles color={theme.text} size={24} />
      </View>
      <View>
        <Text style={[styles.title, {color: theme.text}]}>건강 리포트</Text>
        <Text style={[styles.subtitle, {color: theme.textMuted}]}>
          {today} 상태를 한눈에
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    borderRadius: 20,
    flexDirection: 'row',
    gap: 14,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.11,
    shadowRadius: 8,
    elevation: 3,
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderRadius: 15,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 4,
  },
});
