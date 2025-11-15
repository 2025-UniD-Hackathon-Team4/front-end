import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavigationTopBar from '../components/NavigationTopBar';
import { buildApiUrl, authHeaders } from '../utils/api';
import { BarChart } from "react-native-chart-kit";

const chartWidth = Dimensions.get("window").width - 60;

function parseHourString(str) {
  if (!str) return 0;
  const match = str.match(/(\d+)시간\s+(\d+)분/);
  if (!match) return 0;
  const hours = Number(match[1]);
  const mins = Number(match[2]);
  return hours + mins / 60;
}

export default function Stats({ activeTab = 'stats', onTabChange = () => {} }) {
  const [mode, setMode] = useState('week');
  const [currentDate, setCurrentDate] = useState(new Date());

  const [averageSleep, setAverageSleep] = useState(null);
  const [averageCaffeine, setAverageCaffeine] = useState(null);

  const [sleepGraphData, setSleepGraphData] = useState([]);
  const [caffeineGraphData, setCaffeineGraphData] = useState([]);   // ⭐ 추가

  const [loading, setLoading] = useState(false);

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
    const day = base.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const monday = new Date(base);
    monday.setDate(base.getDate() + diffToMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return `${formatDate(monday)} - ${formatDate(sunday)}`;
  };

  const getMonthLabel = (base) => {
    return `${base.getFullYear()}/${String(base.getMonth() + 1).padStart(2, '0')}`;
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

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);

      try {
        const sleepUrl = mode === 'week'
          ? `/api/sleepTime/weekly`
          : `/api/sleepTime/monthly`;

        const caffeineUrl = mode === 'week'
          ? `/caffeine/weekly?userId=1`
          : `/caffeine/monthly?userId=1`;

        const sleepGraphUrl = mode === 'week'
          ? `/api/sleepTime/fourWeek`
          : `/api/sleepTime/fourMonth`;

        const caffeineGraphUrl = mode === 'week'
          ? `/caffeine/fourWeeks`
          : `/caffeine/fourMonths`;

        const [sleepRes, caffeineRes, sleepGraphRes, caffeineGraphRes] = await Promise.all([
          fetch(buildApiUrl(sleepUrl), { headers: authHeaders }),
          fetch(buildApiUrl(caffeineUrl), { headers: authHeaders }),
          fetch(buildApiUrl(sleepGraphUrl), { headers: authHeaders }),
          fetch(buildApiUrl(caffeineGraphUrl), { headers: authHeaders }),
        ]);

        const sleepJson = await sleepRes.json();
        const caffeineJson = await caffeineRes.json();
        const sleepGraphJson = await sleepGraphRes.json();
        const caffeineGraphJson = await caffeineGraphRes.json();

        setAverageSleep(sleepJson?.result?.averageTime || "-");
        setAverageCaffeine(
          caffeineJson?.averagePerDayMg != null
            ? Number(caffeineJson.averagePerDayMg).toFixed(2)
            : "-"
        );

        setSleepGraphData(sleepGraphJson?.result || []);
        setCaffeineGraphData(caffeineGraphJson?.result || []);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [mode, currentDate]);

  const isNextDisabled = useMemo(() => {
    const nextDate = new Date(currentDate);
    nextDate.setHours(0, 0, 0, 0);

    if (mode === 'week') nextDate.setDate(nextDate.getDate() + 7);
    else nextDate.setMonth(nextDate.getMonth() + 1);

    return nextDate > today;
  }, [currentDate, mode, today]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        <ScrollView showsVerticalScrollIndicator={false}>

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
              <Text style={[styles.toggleText, mode === 'week' ? styles.active : styles.inactive]}>
                주간
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toggleButton} onPress={() => setMode('month')}>
              <Text style={[styles.toggleText, mode === 'month' ? styles.active : styles.inactive]}>
                월간
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.avgRow}>
            <View style={[styles.avgBox, { backgroundColor: '#D6ECFF' }]}>
              <Text style={styles.avgValue}>{averageSleep}</Text>
              <Text style={styles.avgLabel}>평균 수면시간</Text>
            </View>

            <View style={[styles.avgBox, { backgroundColor: '#FFF0B3' }]}>
              <Text style={styles.avgValue}>{averageCaffeine}mg</Text>
              <Text style={styles.avgLabel}>평균 카페인</Text>
            </View>
          </View>

          <View style={styles.chartBox}>
            <Text style={styles.chartTitle}>수면 시간 변화</Text>

            {sleepGraphData.length === 0 ? (
              <View style={styles.chartPlaceholder}><Text>(그래프 없음)</Text></View>
            ) : (
              <BarChart
                data={{
                  labels: sleepGraphData.map((_, idx) => `${idx + 1}`),
                  datasets: [
                    { data: sleepGraphData.map((item) => parseHourString(item.averageTime)) },
                  ],
                }}
                width={chartWidth}
                height={220}
                fromZero
                chartConfig={{
                  backgroundGradientFrom: "#FFFFFF",
                  backgroundGradientTo: "#FFFFFF",
                  barPercentage: 0.5,
                  decimalPlaces: 1,
                  color: () => "#316dbcff",
                  fillShadowGradient: "#3033b7ff",
                  fillShadowGradientOpacity: 1,
                  labelColor: () => "#777",
                }}
                style={{ borderRadius: 15 }}
              />
            )}
          </View>

          <View style={styles.chartBox}>
            <Text style={styles.chartTitle}>카페인 섭취 변화</Text>

            {caffeineGraphData.length === 0 ? (
              <View style={styles.chartPlaceholder}><Text>(그래프 없음)</Text></View>
            ) : (
              <BarChart
                data={{
                  labels: caffeineGraphData.map((_, idx) => `${idx + 1}`),
                  datasets: [
                    { data: caffeineGraphData.map((item) => item.averagePerDayMg || 0) },
                  ],
                }}
                width={chartWidth}
                height={220}
                fromZero
                chartConfig={{
                  backgroundGradientFrom: "#FFFFFF",
                  backgroundGradientTo: "#FFFFFF",
                  barPercentage: 0.5,
                  decimalPlaces: 1,
                  color: () => "#c76d55ff",
                  fillShadowGradient: "#bd4d35ff",
                  fillShadowGradientOpacity: 1,
                  labelColor: () => "#777",
                }}
                style={{ borderRadius: 15 }}
              />
            )}
          </View>

        </ScrollView>

        <NavigationTopBar activeTab={activeTab} onTabChange={onTabChange} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#EEF3FF' },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },

  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  navButton: {
    width: 32, height: 32, alignItems: 'center', justifyContent: 'center',
    borderRadius: 20, backgroundColor: '#F9F9F9', borderWidth: 1, borderColor: '#DDD',
  },
  navButtonDisabled: { opacity: 0.3 },

  navIcon: { fontSize: 20, color: '#555' },
  navIconDisabled: { color: '#CCC' },
  dateText: { fontSize: 20, fontWeight: '600' },

  toggleWrapper: {
    flexDirection: 'row',
    backgroundColor: '#E6E6E6',
    padding: 4,
    borderRadius: 10,
    marginBottom: 20,
    position: 'relative',
  },
  toggleIndicator: {
    position: 'absolute', top: 4, bottom: 4, width: '50%',
    backgroundColor: '#FFF', borderRadius: 10,
  },
  indicatorWeek: { left: 4 },
  indicatorMonth: { right: 4 },
  toggleButton: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  toggleText: { fontSize: 16, fontWeight: '700' },
  active: { color: '#222' },
  inactive: { color: '#999' },

  avgRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  avgBox: {
    flex: 1, marginHorizontal: 5, paddingVertical: 20, alignItems: 'center', borderRadius: 15,
  },
  avgValue: { fontSize: 24, fontWeight: '700' },
  avgLabel: { marginTop: 6, fontSize: 14, color: '#555' },

  chartBox: {
    backgroundColor: '#FFF', padding: 20,
    borderRadius: 15, marginBottom: 20,
  },
  chartTitle: { fontSize: 16, marginBottom: 10, fontWeight: '600' },

  chartPlaceholder: {
    height: 180,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
