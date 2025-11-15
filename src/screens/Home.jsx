import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavigationTopBar from '../components/NavigationTopBar';
import DateTimePicker from '@react-native-community/datetimepicker';
import SleepTimeModal from '../components/SleepTimeModal';
import ConditionModal from '../components/ConditionModal';

export default function Home({
  activeTab = 'home',
  onTabChange = () => {},
  caffeineEntries = [],
  onAddCaffeinePress = () => {},
}) {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [targetSleepTime, setTargetSleepTime] = useState(() => {
    const date = new Date();
    date.setHours(23, 0, 0, 0);
    return date;
  });
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const [sleepModal, setSleepModal] = useState(false);
  const [conditionModal, setConditionModal] = useState(false);
  const [sleepTime, setSleepTime] = useState(new Date());
  const [condition, setCondition] = useState(null);

  const changeDateBy = useCallback((days) => {
    setSelectedDate((prev) => {
      const nextDate = new Date(prev);
      nextDate.setDate(prev.getDate() + days);
      return nextDate;
    });
  }, []);

  const openTimePicker = useCallback(() => {
    setIsTimePickerVisible(true);
  }, []);

  const handleTimeChange = useCallback(
    (event, selectedTime) => {
      if (event?.type === 'dismissed') {
        if (Platform.OS === 'android') {
          setIsTimePickerVisible(false);
        }
        return;
      }
      if (selectedTime) {
        setTargetSleepTime(selectedTime);
      }
      if (Platform.OS === 'android') {
        setIsTimePickerVisible(false);
      }
    },
    [],
  );

  const closeTimePicker = useCallback(() => {
    setIsTimePickerVisible(false);
  }, []);

  const dateLabel = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    return `${year}년 ${month}월 ${day}일`;
  }, [selectedDate]);

  const targetSleepLabel = useMemo(() => {
    const hours = targetSleepTime.getHours();
    const minutes = String(targetSleepTime.getMinutes()).padStart(2, '0');
    const period = hours >= 12 ? '오후' : '오전';
    const hour12 = hours % 12 || 12;
    return `${period} ${hour12}:${minutes}`;
  }, [targetSleepTime]);

  const totalCaffeineIntake = useMemo(
    () => caffeineEntries.reduce((sum, entry) => sum + (entry.mg || 0), 0),
    [caffeineEntries],
  );

  const formatEntryTime = useCallback((value) => {
    const date = new Date(value);
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const period = hours >= 12 ? '오후' : '오전';
    const hour12 = hours % 12 || 12;
    return `${period} ${hour12}:${minutes}`;
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.navButton} onPress={() => changeDateBy(-1)}>
                <Text style={styles.navIcon}>←</Text>
            </TouchableOpacity>
            <Text style={styles.dateText}>{dateLabel}</Text>
            <TouchableOpacity style={styles.navButton} onPress={() => changeDateBy(1)}>
                <Text style={styles.navIcon}>→</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.scoreSection}>
            <Text style={styles.scoreValue}>--°C</Text>
            <Text style={styles.scoreLabel}>Today's Cosuon</Text>
            <View style={styles.scoreBar}>
                <View style={styles.scoreBarFill} />
            </View>
          </View>

          <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardEmoji}>😴</Text>
            <Text style={styles.cardTitle}>목표 취침 시간</Text>
          </View>
          <TouchableOpacity style={styles.chip} onPress={openTimePicker}>
            <Text style={styles.chipText}>{targetSleepLabel}</Text>
          </TouchableOpacity>
          {isTimePickerVisible && (
            <View style={styles.timePickerWrapper}>
              <DateTimePicker
                value={targetSleepTime}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleTimeChange}
                locale="ko-KR"
              />
              {Platform.OS === 'ios' && (
                <TouchableOpacity style={styles.timePickerDoneButton} onPress={closeTimePicker}>
                  <Text style={styles.timePickerDoneText}>완료</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                <Text style={styles.cardEmoji}>☕</Text>
                <Text style={styles.cardTitle}>오늘의 카페인</Text>
                </View>
                <View style={styles.cardValueWrapper}>
                <Text style={styles.cardValueLabel}>총</Text>
                <Text style={styles.cardValueAccent}>{totalCaffeineIntake}</Text>
                <Text style={styles.cardValueLabel}>mg</Text>
                <TouchableOpacity style={styles.addButton} onPress={onAddCaffeinePress}>
                    <Text style={styles.addButtonIcon}>➕</Text>
                </TouchableOpacity>
                </View>
            </View>
            {caffeineEntries.length === 0 ? (
                <View style={styles.caffeinePlaceholder}>
                <Text style={styles.caffeinePlaceholderText}>오늘의 카페인을 기록해보세요.</Text>
                </View>
            ) : (
                <View style={styles.caffeineList}>
                {caffeineEntries.map((entry) => (
                    <View key={entry.id} style={styles.caffeineItem}>
                    <View>
                        <Text style={styles.caffeineItemName}>{entry.beverage}</Text>
                        <Text style={styles.caffeineItemTime}>{formatEntryTime(entry.time)}</Text>
                    </View>
                    <Text style={styles.caffeineItemAmount}>{entry.mg}mg</Text>
                    </View>
                ))}
                </View>
            )}
          </View>

          <TouchableOpacity
            style={styles.analyzeButton}
            onPress={() => setSleepModal(true)}
          >
            <Text style={styles.analyzeButtonText}>수면 분석하기</Text>
          </TouchableOpacity>
        </View>

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
    borderRadius: 20,
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  navIcon: {
    fontSize: 20,
    color: '#828282',
    lineHeight: 38,
  },
  dateText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  scoreSection: {
    alignItems: 'center',
    marginVertical: 32,
  },
  scoreValue: {
    fontSize: 60,
    fontWeight: '700',
    color: '#1D1D1F',
    marginBottom: 16,
  },
  scoreLabel: {
    fontSize: 22,
    color: '#9AA1B4',
    marginBottom: 16,
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
    borderRadius: 10,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1.5,
    borderColor: '#DCE6F7',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    minWidth: 0,
  },
  cardEmoji: {
    fontSize: 28,
    marginRight: 8,
  },
  cardTitle: {
    flex: 1,
    flexShrink: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#171717',
    minWidth: 0,
  },
  cardValueWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
    marginLeft: 12,
    flexWrap: 'nowrap',
  },
  cardValueLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555B77',
  },
  cardValueAccent: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F29D3C',
  },
  addButton: {
    marginLeft: 12,
  },
  addButtonIcon: {
    fontSize: 24,
  },
  chip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
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
  caffeinePlaceholder: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E3E8F2',
  },
  caffeinePlaceholderText: {
    fontSize: 16,
    color: '#9AA1B4',
    fontWeight: '600',
  },
  caffeineList: {
    gap: 12,
  },
  caffeineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderRadius: 10,
    paddingHorizontal: 4,
  },
  caffeineItemName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1F2433',
  },
  caffeineItemTime: {
    fontSize: 14,
    color: '#8B92A7',
    marginTop: 2,
  },
  caffeineItemAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333D4D',
  },
  timePickerWrapper: {
    marginTop: 12,
    borderWidth: Platform.OS === 'ios' ? 1 : 0,
    borderColor: '#E3E8F2',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  timePickerDoneButton: {
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E3E8F2',
  },
  timePickerDoneText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3D7BFF',
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
    backgroundColor: '#C8E6FF',
  },
  metricLightBlue: {
    backgroundColor: '#DAEEFF',
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
    backgroundColor: '#66A9FF',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 5,
  },
  analyzeButtonText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 28,
  },
});