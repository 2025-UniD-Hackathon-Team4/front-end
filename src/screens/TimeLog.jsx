import React, { useCallback, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import StepProgress from '../components/StepProgress';

export default function TimeLog({ onSave = () => {}, onCancel = () => {}, initialTime = null }) {
  const [selectedTime, setSelectedTime] = useState(() =>
    initialTime ? new Date(initialTime) : new Date(),
  );
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);

  const formattedTime = useMemo(() => {
    const hours = selectedTime.getHours();
    const minutes = String(selectedTime.getMinutes()).padStart(2, '0');
    const period = hours >= 12 ? '오후' : '오전';
    const hour12 = hours % 12 || 12;
    return `${period} ${hour12}:${minutes}`;
  }, [selectedTime]);

  const handleSave = () => {
    onSave(selectedTime.toISOString());
  };

  const handleChangeTime = useCallback(
    (event, nextTime) => {
      if (event?.type === 'dismissed') {
        if (Platform.OS === 'android') {
          setIsTimePickerVisible(false);
        }
        return;
      }
      if (nextTime) {
        setSelectedTime(nextTime);
      }
      if (Platform.OS === 'android') {
        setIsTimePickerVisible(false);
      }
    },
    [],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>오늘의 카페인 기록</Text>
        <StepProgress activeStep={1} />
        <Text style={styles.subtitle}>섭취 시간을 선택해주세요</Text>

        <TouchableOpacity style={styles.timeChip} onPress={() => setIsTimePickerVisible(true)}>
            <Text style={styles.timeChipText}>{formattedTime}</Text>
        </TouchableOpacity>
        {isTimePickerVisible && (
          <View style={styles.timePickerWrapper}>
            <DateTimePicker
              value={selectedTime}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleChangeTime}
              locale="ko-KR"
            />
            {Platform.OS === 'ios' && (
              <TouchableOpacity
                style={styles.timePickerDoneButton}
                onPress={() => setIsTimePickerVisible(false)}
              >
                <Text style={styles.timePickerDoneText}>완료</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={styles.actions}>
          <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>취소</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.nextButton]} onPress={handleSave}>
            <Text style={styles.nextButtonText}>다음</Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#171717',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2F2F2F',
    textAlign: 'left',
    marginBottom: 20,
  },
  timeChip: {
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D7DEED',
  },
  timeChipText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2433',
  },
  timePickerWrapper: {
    marginTop: 12,
    borderWidth: Platform.OS === 'ios' ? 1 : 0,
    borderColor: '#D7DEED',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  timePickerDoneButton: {
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#D7DEED',
  },
  timePickerDoneText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3D7BFF',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#D0D5DD',
  },
  nextButton: {
    backgroundColor: '#3D7BFF',
  },
  cancelButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4B5563',
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

