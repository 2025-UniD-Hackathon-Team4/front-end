import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavigationTopBar from '../components/NavigationTopBar';

export default function Stats({ activeTab = 'stats', onTabChange = () => {} }) {
  const [mode, setMode] = useState('week'); // 'week' | 'month'

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          
          {/* 날짜 범위 */}
             <View style={styles.header}>
            <TouchableOpacity style={styles.navButton}>
              <Text style={styles.navIcon}>‹</Text>
            </TouchableOpacity>
            
            <Text style={styles.dateText}>2025/09/04 - 2025/09/13</Text>
                 <TouchableOpacity style={styles.navButton}>
              <Text style={styles.navIcon}>›</Text>
            </TouchableOpacity>
          </View>

          {/* 주간 / 월간 토글 */}
          <View style={styles.toggleWrapper}>
            <TouchableOpacity
              style={[styles.toggleButton, mode === 'week' && styles.toggleActiveWeek]}
              onPress={() => setMode('week')}
            >
              <Text style={styles.toggleText}>주간</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toggleButton, mode === 'month' && styles.toggleActiveMonth]}
              onPress={() => setMode('month')}
            >
              <Text style={styles.toggleText}>월간</Text>
            </TouchableOpacity>
          </View>

          {/* 평균 카드 2개 */}
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

          {/* 그래프 박스 - 카페인 섭취량 */}
          <View style={styles.chartBox}>
            <Text style={styles.chartTitle}>카페인 섭취량</Text>
            <View style={styles.chartPlaceholder}>
              <Text style={{ color: '#BBBBBB' }}>(그래프 영역)</Text>
            </View>
          </View>

          {/* 그래프 박스 - 수면 시간 */}
          <View style={styles.chartBox}>
            <Text style={styles.chartTitle}>수면 시간</Text>
            <View style={styles.chartPlaceholder}>
              <Text style={{ color: '#BBBBBB' }}>(그래프 영역)</Text>
            </View>
          </View>

         <View style={styles.chartBox}>
            <Text style={styles.chartTitle}>컨디션 온도</Text>
            <View style={styles.chartPlaceholder}>
              <Text style={{ color: '#BBBBBB' }}>(그래프 영역)</Text>
            </View>
          </View>
        </ScrollView>

        {/* 하단 네비게이션 */}
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
    borderRadius: 12,
  },
  navIcon: {
    fontSize: 28,
    color: '#1D1D1F',
  },
  dateText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1D1D1F',
  },

  // 주간 월간 토글
  toggleWrapper: {
    flexDirection: 'row',
    borderRadius: 30,
    backgroundColor: '#F0F0F0',
    overflow: 'hidden',
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  toggleText: {
    fontWeight: '600',
    fontSize: 16,
  },
  toggleActiveWeek: {
    backgroundColor: '#BDFCC9',
  },
  toggleActiveMonth: {
    backgroundColor: '#FFDDDD',
  },

  // 평균 박스
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

  // 그래프 박스
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

