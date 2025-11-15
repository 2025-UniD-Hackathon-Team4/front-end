// components/SleepTimeModal.jsx
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function SleepTimeModal({
  visible,
  sleepTime,
  setSleepTime,
  onNext,
  onClose,
}) {
  const formatTime = (date) => {
    let h = date.getHours();
    let m = date.getMinutes();
    const ampm = h >= 12 ? '오후' : '오전';
    h = h % 12 || 12;
    return `${ampm} ${h}:${m.toString().padStart(2, '0')}`;
  };

  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeX}>×</Text>
          </TouchableOpacity>

          <Text style={styles.title}>실제 수면 시간을 입력해주세요</Text>

          <View style={styles.timeBox}>
            <Text style={styles.timeText}>{formatTime(sleepTime)}</Text>
          </View>

          <DateTimePicker
            value={sleepTime}
            mode="time"
            display="spinner"
            onChange={(e, selected) => {
              if (selected) setSleepTime(selected);
            }}
          />

          <TouchableOpacity style={styles.btn} onPress={onNext}>
            <Text style={styles.btnText}>다음</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#FFF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  closeButton: { position: 'absolute', left: 15, top: 15 },
  closeX: { fontSize: 28 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 20 },
  timeBox: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  timeText: { fontSize: 18, fontWeight: '600' },
  btn: {
    marginTop: 12,
    backgroundColor: '#8CB7FF',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
