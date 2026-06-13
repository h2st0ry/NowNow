import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {ChevronRight, type LucideIcon} from 'lucide-react-native';
import {useAppTheme} from '../../../theme/ThemeProvider';

interface SettingItem {
  label: string;
  description?: string;
  Icon: LucideIcon;
  destructive?: boolean;
  onPress?: () => void;
}

interface SettingsSectionProps {
  title?: string;
  items: SettingItem[];
}

export default function SettingsSection({title, items}: SettingsSectionProps) {
  const {theme} = useAppTheme();

  return (
    <View style={styles.section}>
      {title && (
        <Text style={[styles.sectionTitle, {color: theme.textMuted}]}>
          {title}
        </Text>
      )}
      <View style={[styles.card, {backgroundColor: theme.surface}]}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const {Icon} = item;

          return (
            <Pressable
              key={item.label}
              onPress={item.onPress}
              style={({pressed}) => [
                styles.row,
                !isLast && styles.divider,
                !isLast && {borderBottomColor: theme.border},
                pressed && styles.pressedRow,
                pressed && {backgroundColor: theme.pressed},
              ]}>
              <View
                style={[
                  styles.iconWrap,
                  {backgroundColor: theme.iconSurface},
                  item.destructive && styles.destructiveIconWrap,
                  item.destructive && {backgroundColor: theme.accentMuted},
                ]}>
                <Icon
                  color={item.destructive ? theme.accent : theme.icon}
                  size={20}
                />
              </View>
              <View style={styles.textArea}>
                <Text
                  style={[
                    styles.label,
                    {color: theme.text},
                    item.destructive && styles.destructiveLabel,
                    item.destructive && {color: theme.accent},
                  ]}>
                  {item.label}
                </Text>
                {item.description && (
                  <Text style={[styles.description, {color: theme.textMuted}]}>
                    {item.description}
                  </Text>
                )}
              </View>
              {!item.destructive && (
                <ChevronRight color={theme.textMuted} size={18} />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    rowGap: 8,
  },
  sectionTitle: {
    color: '#5B6559',
    fontSize: 13,
    fontWeight: '800',
    paddingHorizontal: 4,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.12,
    shadowRadius: 7,
    elevation: 3,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    minHeight: 66,
    paddingHorizontal: 16,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  pressedRow: {
    backgroundColor: '#F4F8F1',
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: '#EEF7EC',
    borderRadius: 14,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  destructiveIconWrap: {
  },
  textArea: {
    flex: 1,
  },
  label: {
    color: '#2F352F',
    fontSize: 15,
    fontWeight: '800',
  },
  destructiveLabel: {
  },
  description: {
    color: '#788276',
    fontSize: 12,
    marginTop: 4,
  },
});
