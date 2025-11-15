import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import HomeDefaultIcon from '../../assets/tab/home-default.svg';
import HomeIcon from '../../assets/tab/home.svg';
import StatsDefaultIcon from '../../assets/tab/stats-default.svg';
import StatsIcon from '../../assets/tab/stats.svg';
import MyDefaultIcon from '../../assets/tab/my-default.svg';
import MyIcon from '../../assets/tab/my.svg';

const ICON_SIZE = 32;

const TABS = [
  {
    key: 'home',
    label: '홈',
    icon: HomeDefaultIcon,
    activeIcon: HomeIcon,
  },
  {
    key: 'stats',
    label: '통계',
    icon: StatsDefaultIcon,
    activeIcon: StatsIcon,
  },
  {
    key: 'my',
    label: '마이',
    icon: MyDefaultIcon,
    activeIcon: MyIcon,
  },
];

export default function NavigationTopBar({ activeTab = 'home', onTabChange = () => {} }) {
  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const IconComponent = isActive ? tab.activeIcon : tab.icon;

          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabButton}
              activeOpacity={0.85}
              onPress={() => onTabChange(tab.key)}
            >
              <IconComponent
                width={ICON_SIZE}
                height={ICON_SIZE}
                style={styles.icon}
                preserveAspectRatio="xMidYMid meet"
              />
              <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 8,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 8,
    paddingVertical: 14,
    borderRadius: 999,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '92%',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6D6D72',
  },
  labelActive: {
    color: '#3D3D40',
  },
});