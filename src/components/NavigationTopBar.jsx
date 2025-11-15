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
              activeOpacity={0.9}
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
    paddingBottom: 16,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 100,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    shadowColor: '#171717',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 24,
    marginBottom: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#BABABA',
  },
  labelActive: {
    color: '#5B5B5B',
  },
});