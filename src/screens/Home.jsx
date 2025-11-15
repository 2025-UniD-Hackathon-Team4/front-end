import React, { useMemo, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavigationTopBar from '../components/NavigationTopBar';
import DateTimePicker from '@react-native-community/datetimepicker';
import SleepTimeModal from '../components/SleepTimeModal';
import ConditionModal from '../components/ConditionModal';
import { buildApiUrl } from '../utils/api';

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

const createDefaultSleepGoalTime = () => {
  const date = new Date();
  date.setHours(23, 0, 0, 0);
  return date;
};

export default function Home({
  activeTab = 'home',
  onTabChange = () => {},
  caffeineEntries = [],
  onAddCaffeinePress = () => {},
  naverAuthParams = null,
}) {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [targetSleepTime, setTargetSleepTime] = useState(createDefaultSleepGoalTime);
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const [sleepModal, setSleepModal] = useState(false);
  const [conditionModal, setConditionModal] = useState(false);
  const [sleepTime, setSleepTime] = useState(new Date());
  const [condition, setCondition] = useState(null);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const initial = new Date();
    initial.setDate(1);
    initial.setHours(0, 0, 0, 0);
    return initial;
  });
  const [casuon, setCasuon] = useState(null);
  const [casuonLoading, setCasuonLoading] = useState(false);
  const [casuonError, setCasuonError] = useState(null);
  const authHeaders = useMemo(() => {
    if (naverAuthParams?.accessToken) {
      return { Authorization: `Bearer ${naverAuthParams.accessToken}` };
    }
    return {};
  }, [naverAuthParams]);

  const changeDateBy = useCallback((days) => {
    setSelectedDate((prev) => {
      const nextDate = new Date(prev);
      nextDate.setDate(prev.getDate() + days);
      return nextDate;
    });
  }, []);

  const today = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }, []);

  const isSelectedDateToday = useMemo(() => {
    const normalizedSelected = new Date(selectedDate);
    normalizedSelected.setHours(0, 0, 0, 0);
    return normalizedSelected.getTime() === today.getTime();
  }, [selectedDate, today]);

  const formatGoalTime = useCallback((date) => {
    if (!(date instanceof Date)) {
      return '';
    }
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const period = hours >= 12 ? '오후' : '오전';
    const hour12 = hours % 12 || 12;
    return `${period} ${hour12}:${minutes}`;
  }, []);

  const parseGoalTimeString = useCallback((value) => {
    if (typeof value !== 'string') {
      return null;
    }
    const trimmed = value.trim();
    const match = trimmed.match(/^(오전|오후)\s*(\d{1,2}):(\d{2})$/);
    if (!match) {
      return null;
    }

    let hours = parseInt(match[2], 10);
    const minutes = parseInt(match[3], 10);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      return null;
    }

    const period = match[1];
    if (period === '오후' && hours !== 12) {
      hours += 12;
    } else if (period === '오전' && hours === 12) {
      hours = 0;
    }

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }, []);

  const openTimePicker = useCallback(() => {
    if (!isSelectedDateToday) {
      return;
    }
    setIsTimePickerVisible(true);
  }, [isSelectedDateToday]);

  const openDatePicker = useCallback(() => {
    setCalendarMonth(() => {
      const monthDate = new Date(selectedDate);
      monthDate.setDate(1);
      monthDate.setHours(0, 0, 0, 0);
      return monthDate;
    });
    setIsDatePickerVisible(true);
  }, [selectedDate]);

  const saveSleepGoal = useCallback(
    async (goalDate) => {
      if (!(goalDate instanceof Date)) {
        return;
      }

      try {
        const response = await fetch(buildApiUrl('/api/add/sleapGoal'), {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            ...authHeaders,
          },
          body: formatGoalTime(goalDate),
        });
        
        console.log(await response.json());

        if (!response.ok) {
          throw new Error(`sleapGoal 요청 실패 (status: ${response.status})`);
        }
      } catch (error) {
        console.error('[Home] sleapGoal save error:', error);
      }
    },
    [authHeaders, formatGoalTime],
  );

  const handleTimeChange = useCallback(
    (event, selectedTime) => {
      if (event?.type === 'dismissed') {
        if (Platform.OS === 'android') {
          setIsTimePickerVisible(false);
        }
        return;
      }

      if (!isSelectedDateToday) {
        if (Platform.OS === 'android') {
          setIsTimePickerVisible(false);
        }
        return;
      }

      if (selectedTime) {
        setTargetSleepTime(selectedTime);
        if (Platform.OS === 'android') {
          setIsTimePickerVisible(false);
          saveSleepGoal(selectedTime);
        }
      } else if (Platform.OS === 'android') {
        setIsTimePickerVisible(false);
      }
    },
    [isSelectedDateToday, saveSleepGoal],
  );

  const handleTimePickerDone = useCallback(() => {
    if (!isSelectedDateToday) {
      setIsTimePickerVisible(false);
      return;
    }
    setIsTimePickerVisible(false);
    saveSleepGoal(targetSleepTime);
  }, [isSelectedDateToday, saveSleepGoal, targetSleepTime]);

  useEffect(() => {
    if (!isSelectedDateToday && isTimePickerVisible) {
      setIsTimePickerVisible(false);
    }
  }, [isSelectedDateToday, isTimePickerVisible]);

  const closeDatePicker = useCallback(() => {
    setIsDatePickerVisible(false);
  }, []);

  const dateLabel = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    return `${year}년 ${month}월 ${day}일`;
  }, [selectedDate]);

  const isNextDisabled = useMemo(() => {
    const normalizedSelected = new Date(selectedDate);
    normalizedSelected.setHours(0, 0, 0, 0);
    return normalizedSelected >= today;
  }, [selectedDate, today]);

  const handleDateChange = useCallback(
    (event, pickedDate) => {
      if (event?.type === 'dismissed') {
        if (Platform.OS === 'android') {
          setIsDatePickerVisible(false);
        }
        return;
      }
      if (pickedDate) {
        const normalized = new Date(pickedDate);
        normalized.setHours(0, 0, 0, 0);
        if (normalized <= today) {
          setSelectedDate(normalized);
        }
      }
      if (Platform.OS === 'android') {
        setIsDatePickerVisible(false);
      }
    },
    [today],
  );

  const normalizedSelectedTime = useMemo(() => {
    const normalized = new Date(selectedDate);
    normalized.setHours(0, 0, 0, 0);
    return normalized.getTime();
  }, [selectedDate]);

  const selectedDateParam = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, [selectedDate]);

  useEffect(() => {
    let isActive = true;

    const fetchSleepGoal = async () => {
      try {
        const query = `date=${encodeURIComponent(selectedDateParam)}`;
        const response = await fetch(`${buildApiUrl('/api/sleepGoal')}?${query}`, {
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders,
          },
        });
        console.log(query);

        if (!response.ok) {
          throw new Error(`sleepGoal 요청 실패 (status: ${response.status})`);
        }

        const data = await response.json();
        console.log(data);
        if (!isActive) {
          return;
        }

        const parsedSleepGoal = parseGoalTimeString(data?.result);
        if (parsedSleepGoal) {
          setTargetSleepTime(parsedSleepGoal);
        } else {
          setTargetSleepTime(createDefaultSleepGoalTime());
        }
      } catch (error) {
        if (!isActive) {
          return;
        }
        console.error('[Home] sleepGoal fetch error:', error);
        setTargetSleepTime(createDefaultSleepGoalTime());
      }
    };

    fetchSleepGoal();

    return () => {
      isActive = false;
    };
  }, [selectedDateParam, authHeaders, parseGoalTimeString]);

  const calendarWeeks = useMemo(() => {
    const start = new Date(calendarMonth);
    start.setDate(1 - start.getDay());
    start.setHours(0, 0, 0, 0);

    const weeks = [];
    for (let weekIndex = 0; weekIndex < 6; weekIndex += 1) {
      const week = [];
      for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
        const cell = new Date(start);
        cell.setDate(start.getDate() + weekIndex * 7 + dayIndex);
        cell.setHours(0, 0, 0, 0);
        week.push({
          date: cell,
          key: `${cell.getFullYear()}-${cell.getMonth()}-${cell.getDate()}`,
          isCurrentMonth:
            cell.getMonth() === calendarMonth.getMonth() && cell.getFullYear() === calendarMonth.getFullYear(),
          isDisabled: cell > today,
          isSelected: cell.getTime() === normalizedSelectedTime,
          isToday: cell.getTime() === today.getTime(),
        });
      }
      weeks.push(week);
    }
    return weeks;
  }, [calendarMonth, normalizedSelectedTime, today]);

  const goToPrevCalendarMonth = useCallback(() => {
    setCalendarMonth((prev) => {
      const next = new Date(prev);
      next.setMonth(prev.getMonth() - 1);
      next.setDate(1);
      next.setHours(0, 0, 0, 0);
      return next;
    });
  }, []);

  const goToNextCalendarMonth = useCallback(() => {
    setCalendarMonth((prev) => {
      const next = new Date(prev);
      next.setMonth(prev.getMonth() + 1);
      next.setDate(1);
      next.setHours(0, 0, 0, 0);
      return next;
    });
  }, []);

  const isCalendarNextDisabled = useMemo(() => {
    const next = new Date(calendarMonth);
    next.setMonth(next.getMonth() + 1);
    next.setDate(1);
    next.setHours(0, 0, 0, 0);
    return next > today;
  }, [calendarMonth, today]);

  const handleCalendarSelect = useCallback(
    (date) => {
      if (date > today) return;
      const normalized = new Date(date);
      normalized.setHours(0, 0, 0, 0);
      setSelectedDate(normalized);
      setIsDatePickerVisible(false);
    },
    [today],
  );

  const targetSleepLabel = useMemo(() => formatGoalTime(targetSleepTime), [formatGoalTime, targetSleepTime]);

  const totalCaffeineIntake = useMemo(
    () => caffeineEntries.reduce((sum, entry) => sum + (entry.mg || 0), 0),
    [caffeineEntries],
  );

  const casuonDisplayValue = useMemo(() => {
    if (casuonLoading) {
      return '...';
    }
    if (typeof casuon === 'number' && Number.isFinite(casuon)) {
      return casuon;
    }
    return '--';
  }, [casuon, casuonLoading]);

  const casuonStatusLabel = useMemo(() => {
    if (casuonLoading) {
      return '...';
    }
    if (casuonError) {
      return '해당 날짜의 데이터가 없습니다';
    }
    return "Today's Casuon";
  }, [casuonLoading, casuonError]);

  useEffect(() => {
    let isActive = true;

    const fetchConditionTemp = async () => {
      setCasuonLoading(true);
      setCasuonError(null);
      try {
        const query = `date=${encodeURIComponent(selectedDateParam)}`;
        const response = await fetch(`${buildApiUrl('/api/conditionTemp')}?${query}`, {
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders,
          },
        });

        if (!response.ok) {
          throw new Error(`conditionTemp 요청 실패 (status: ${response.status})`);
        }

        const data = await response.json();
        if (!isActive) {
          return;
        }

        const nextValue = typeof data?.result === 'number' ? data.result : null;
        setCasuon(nextValue);
      } catch (error) {
        if (!isActive) {
          return;
        }
        console.error('[Home] conditionTemp fetch error:', error);
        setCasuonError(error);
        setCasuon(null);
      } finally {
        if (isActive) {
          setCasuonLoading(false);
        }
      }
    };

    fetchConditionTemp();

    return () => {
      isActive = false;
    };
  }, [selectedDateParam, authHeaders]);

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
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity style={styles.navButton} onPress={() => changeDateBy(-1)}>
                <Text style={styles.navIcon}>←</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={openDatePicker} activeOpacity={0.7}>
              <Text style={styles.dateText}>{dateLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.navButton, isNextDisabled && styles.navButtonDisabled]}
              onPress={() => changeDateBy(1)}
              disabled={isNextDisabled}
            >
                <Text style={[styles.navIcon, isNextDisabled && styles.navIconDisabled]}>→</Text>
            </TouchableOpacity>
          </View>
          {isDatePickerVisible && Platform.OS === 'android' && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
              locale="ko-KR"
              maximumDate={today}
            />
          )}

          <View style={styles.scoreSection}>
            <Text style={styles.scoreValue}>{casuonDisplayValue}°C</Text>
            <Text style={styles.scoreLabel}>{casuonStatusLabel}</Text>
            <View style={styles.scoreBar}>
                <View style={styles.scoreBarFill} />
            </View>
          </View>

          <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardEmoji}>😴</Text>
            <Text style={styles.cardTitle}>목표 취침 시간</Text>
          </View>
          <TouchableOpacity
            style={[styles.chip, !isSelectedDateToday && styles.chipDisabled]}
            onPress={openTimePicker}
            disabled={!isSelectedDateToday}
          >
            <Text style={styles.chipText}>{targetSleepLabel}</Text>
          </TouchableOpacity>
          {!isSelectedDateToday && (
            <Text style={styles.chipHelperText}>지난 날짜의 취침 시간은 변경할 수 없어요</Text>
          )}
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
                <TouchableOpacity style={styles.timePickerDoneButton} onPress={handleTimePickerDone}>
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
        </ScrollView>

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

        {Platform.OS === 'ios' && (
          <Modal visible={isDatePickerVisible} transparent animationType="fade">
            <TouchableWithoutFeedback onPress={closeDatePicker}>
              <View style={styles.datePickerModalOverlay}>
                <TouchableWithoutFeedback onPress={() => {}}>
                  <View style={styles.datePickerSheet}>
                    <View style={styles.calendarHeader}>
                      <TouchableOpacity style={styles.calendarNavButton} onPress={goToPrevCalendarMonth}>
                        <Text style={styles.calendarNavIcon}>←</Text>
                      </TouchableOpacity>
                      <Text style={styles.datePickerTitle}>
                        {`${calendarMonth.getFullYear()}년 ${String(calendarMonth.getMonth() + 1).padStart(2, '0')}월`}
                      </Text>
                      <TouchableOpacity
                        style={[
                          styles.calendarNavButton,
                          isCalendarNextDisabled && styles.calendarNavButtonDisabled,
                        ]}
                        onPress={goToNextCalendarMonth}
                        disabled={isCalendarNextDisabled}
                      >
                        <Text
                          style={[
                            styles.calendarNavIcon,
                            isCalendarNextDisabled && styles.calendarNavIconDisabled,
                          ]}
                        >
                          →
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.calendarWeekdayRow}>
                      {DAY_LABELS.map((label) => (
                        <Text key={label} style={styles.calendarWeekday}>
                          {label}
                        </Text>
                      ))}
                    </View>
                    {calendarWeeks.map((week, index) => (
                      <View key={`week-${index}`} style={styles.calendarWeekRow}>
                        {week.map((day) => (
                          <TouchableOpacity
                            key={day.key}
                            style={[
                              styles.calendarDayCell,
                              !day.isCurrentMonth && styles.calendarDayOutside,
                              day.isDisabled && styles.calendarDayDisabled,
                              day.isToday && styles.calendarDayToday,
                              day.isSelected && styles.calendarDaySelected,
                            ]}
                            onPress={() => handleCalendarSelect(day.date)}
                            disabled={day.isDisabled}
                          >
                            <Text
                              style={[
                                styles.calendarDayText,
                                !day.isCurrentMonth && styles.calendarDayTextOutside,
                                day.isDisabled && styles.calendarDayTextDisabled,
                                day.isSelected && styles.calendarDayTextSelected,
                              ]}
                            >
                              {day.date.getDate()}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    ))}
                    <TouchableOpacity style={styles.timePickerDoneButton} onPress={closeDatePicker}>
                      <Text style={styles.timePickerDoneText}>닫기</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        )}

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
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
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
  chipDisabled: {
    opacity: 0.5,
  },
  chipText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#202234',
  },
  chipHelperText: {
    marginTop: 8,
    fontSize: 13,
    color: '#8B92A7',
    textAlign: 'center',
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
  datePickerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  datePickerSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  calendarNavButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  calendarNavButtonDisabled: {
    opacity: 0.4,
  },
  calendarNavIcon: {
    fontSize: 16,
    color: '#1F2937',
  },
  calendarNavIconDisabled: {
    color: '#94A3B8',
  },
  calendarWeekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  calendarWeekday: {
    width: `${100 / 7}%`,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
  },
  calendarWeekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  calendarDayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarDayOutside: {
    opacity: 0.4,
  },
  calendarDayDisabled: {
    opacity: 0.3,
  },
  calendarDayToday: {
    borderWidth: 1,
    borderColor: '#3D7BFF',
  },
  calendarDaySelected: {
    backgroundColor: '#3D7BFF',
  },
  calendarDayText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  calendarDayTextOutside: {
    color: '#94A3B8',
  },
  calendarDayTextDisabled: {
    color: '#94A3B8',
  },
  calendarDayTextSelected: {
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