import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavigationTopBar from '../components/NavigationTopBar';

export default function Stats({ activeTab = 'stats', onTabChange = () => {} }) {
  const [mode, setMode] = useState('week'); 
  const [currentDate, setCurrentDate] = useState(new Date()); 

  const today = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }, []);

  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}/${m}/${d}`;
  };

  const getWeekRange = (base) => {
    const day = base.getDay(); // 0=일요일
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const monday = new Date(base);
    monday.setDate(base.getDate() + diffToMonday);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return `${formatDate(monday)} - ${formatDate(sunday)}`;
  };

  const getMonthLabel = (base) => {
    const year = base.getFullYear();
    const month = base.getMonth() + 1;
    return `${year}/${String(month).padStart(2, '0')}`;
  };

  const movePrev = () => {
    const newDate = new Date(currentDate);

    if (mode === 'week') newDate.setDate(currentDate.getDate() - 7);
    else newDate.setMonth(currentDate.getMonth() - 1);

    setCurrentDate(newDate);
  };

  const moveNext = () => {
    const newDate = new Date(currentDate);

    if (mode === 'week') newDate.setDate(currentDate.getDate() + 7);
    else newDate.setMonth(currentDate.getMonth() + 1);

    setCurrentDate(newDate);
  };

  const isNextDisabled = useMemo(() => {
    const nextDate = new Date(currentDate);
    nextDate.setHours(0, 0, 0, 0);

    if (mode === 'week') {
      nextDate.setDate(nextDate.getDate() + 7);
    } else {
      nextDate.setDate(1);
      nextDate.setMonth(nextDate.getMonth() + 1);
    }

    return nextDate > today;
  }, [currentDate, mode, today]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

          <View style={styles.header}>
            <TouchableOpacity style={styles.navButton} onPress={movePrev}>
              <Text style={styles.navIcon}>←</Text>
            </TouchableOpacity>

            <Text style={styles.dateText}>
              {mode === 'week' ? getWeekRange(currentDate) : getMonthLabel(currentDate)}
            </Text>

            <TouchableOpacity
              style={[styles.navButton, isNextDisabled && styles.navButtonDisabled]}
              onPress={moveNext}
              disabled={isNextDisabled}
            >
              <Text style={[styles.navIcon, isNextDisabled && styles.navIconDisabled]}>→</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.toggleWrapper}>
            <View
              style={[
                styles.toggleIndicator,
                mode === 'week' ? styles.indicatorWeek : styles.indicatorMonth,
              ]}
            />

            <TouchableOpacity style={styles.toggleButton} onPress={() => setMode('week')}>
              <Text
                style={[
                  styles.toggleText,
                  mode === 'week' ? styles.toggleTextActive : styles.toggleTextInactive,
                ]}
              >
                주간
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toggleButton} onPress={() => setMode('month')}>
              <Text
                style={[
                  styles.toggleText,
                  mode === 'month' ? styles.toggleTextActive : styles.toggleTextInactive,
                ]}
              >
                월간
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.avgRow}>
            <View style={[styles.avgBox, { backgroundColor: '#D6ECFF' }]}>
              <Text style={styles.avgValue}>7시간 39분</Text>
              <Text style={styles.avgLabel}>평균 수면시간</Text>
            </View>

            <View style={[styles.avgBox, { backgroundColor: '#FFF0B3' }]}>
              <Text style={styles.avgValue}>140mg</Text>
              <Text style={styles.avgLabel}>평균 카페인 섭취량</Text>
            </View>
          </View>

          <View style={styles.chartBox}>
            <Text style={styles.chartTitle}>카페인 섭취량</Text>
            <View style={styles.chartPlaceholder}>
              <Text style={{ color: '#BBBBBB' }}>(그래프 영역)</Text>
            </View>
          </View>

          <View style={styles.chartBox}>
            <Text style={styles.chartTitle}>수면 시간</Text>
            <View style={styles.chartPlaceholder}>
              <Text style={{ color: '#BBBBBB' }}>(그래프 영역)</Text>
            </View>
          </View>

        </ScrollView>

        <NavigationTopBar activeTab={activeTab} onTabChange={onTabChange} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EEF3FF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  navButton: {
    width: 32,
  height: 32,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 20,
  backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navIcon: {
    fontSize: 20,
    color: '#828282',
    lineHeight: 38,
  },
  navIconDisabled: {
    color: '#BDBDBD',
  },
  dateText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  toggleWrapper: {
    position: 'relative',
    flexDirection: 'row',
    borderRadius: 10,
    backgroundColor: '#E6E6E6',
    padding: 4,
    marginBottom: 24,
    shadowColor: '#C0D3FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
  },
  toggleIndicator: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    width: '50%',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#94A3B8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 12,
  },
  indicatorWeek: {
    left: 4,
  },
  indicatorMonth: {
    right: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleText: {
    fontWeight: '700',
    fontSize: 16,
  },
  toggleTextActive: {
    color: '#1F2433',
  },
  toggleTextInactive: {
    color: '#6B7280',
  },
  avgRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  avgBox: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 15,
    paddingVertical: 20,
    alignItems: 'center',
    elevation: 2,
  },
  avgValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  avgLabel: {
    fontSize: 14,
    marginTop: 5,
    color: '#555555',
  },

  chartBox: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '600',
  },
  chartPlaceholder: {
    height: 180,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
