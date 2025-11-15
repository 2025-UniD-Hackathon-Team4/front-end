import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavigationTopBar from '../components/NavigationTopBar';

import SleepTimeModal from '../components/SleepTimeModal';
import ConditionModal from '../components/ConditionModal';

export default function Home({ activeTab = 'home', onTabChange = () => {} }) {

  // ===== 모달 상태 추가 =====
  const [sleepModal, setSleepModal] = useState(false);
  const [conditionModal, setConditionModal] = useState(false);

  const [sleepTime, setSleepTime] = useState(new Date());
  const [condition, setCondition] = useState(null);
  // =========================

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.navButton}>
              <Text style={styles.navIcon}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.dateText}>2025/09/04</Text>
            <TouchableOpacity style={styles.navButton}>
              <Text style={styles.navIcon}>›</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.scoreSection}>
            <Text style={styles.scoreValue}>100°C</Text>
            <View style={styles.scoreBar}>
              <View style={styles.scoreBarFill} />
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardEmoji}>😴</Text>
              <Text style={styles.cardTitle}>목표 취침 시간</Text>
            </View>
            <View style={styles.chip}>
              <Text style={styles.chipText}>오후 11:00</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardEmoji}>☕</Text>
              <Text style={styles.cardTitle}>오늘의 카페인</Text>
              <View style={styles.cardValueWrapper}>
                <Text style={styles.cardValueLabel}>총</Text>
                <Text style={styles.cardValueAccent}>0mg</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>+  카페인 기록하기</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.metricsRow}>
            <View style={[styles.metricCard, styles.metricBlue]}>
              <Text style={styles.metricValue}>7시간 23분</Text>
              <Text style={styles.metricLabel}>평균 수면시간</Text>
            </View>
            <View style={[styles.metricCard, styles.metricYellow]}>
              <Text style={styles.metricValue}>130mg</Text>
              <Text style={styles.metricLabel}>평균 카페인 섭취량</Text>
            </View>
          </View>

          {/* ===== 수면 분석하기 버튼 (모달 연결) ===== */}
          <TouchableOpacity
            style={styles.analyzeButton}
            onPress={() => setSleepModal(true)}
          >
            <Text style={styles.analyzeButtonText}>수면 분석하기</Text>
          </TouchableOpacity>
        </View>

        {/* ===== 1단계 모달: 수면시간 ===== */}
        <SleepTimeModal
          visible={sleepModal}
          sleepTime={sleepTime}
          setSleepTime={setSleepTime}
          onNext={() => {
            setSleepModal(false);
            setConditionModal(true);
          }}
          onClose={() => setSleepModal(false)}
        />

        {/* ===== 2단계 모달: 컨디션 ===== */}
        <ConditionModal
          visible={conditionModal}
          condition={condition}
          setCondition={setCondition}
          onAnalyze={() => setConditionModal(false)}
          onClose={() => setConditionModal(false)}
        />

        <NavigationTopBar activeTab={activeTab} onTabChange={onTabChange} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  scoreSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  scoreValue: {
    fontSize: 56,
    fontWeight: '800',
    color: '#1D1D1F',
    marginBottom: 10,
  },
  scoreBar: {
    width: '100%',
    height: 12,
    borderRadius: 6,
    backgroundColor: '#C9D7F0',
    overflow: 'hidden',
  },
  scoreBarFill: {
    width: '100%',
    height: '100%',
    backgroundColor: '#66A9FF',
  },
  card: {
    backgroundColor: '#F7F9FF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#DCE6F7',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  cardTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#202234',
  },
  cardValueWrapper: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  cardValueLabel: {
    fontSize: 16,
    color: '#555B77',
  },
  cardValueAccent: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F29D3C',
  },
  chip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E3E8F2',
  },
  chipText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#202234',
  },
  primaryButton: {
    backgroundColor: '#3D7BFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  metricCard: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginHorizontal: 4,
  },
  metricBlue: {
    backgroundColor: '#BBDFFF',
  },
  metricYellow: {
    backgroundColor: '#FFE7A3',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#202234',
    marginBottom: 6,
  },
  metricLabel: {
    fontSize: 15,
    color: '#4E5875',
  },
  analyzeButton: {
    backgroundColor: '#FF8B3D',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  analyzeButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
