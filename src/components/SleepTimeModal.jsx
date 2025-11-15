import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function SleepTimeModal({
  visible,
  sleepTime,
  setSleepTime,
  onNext,
  onClose,
}) {
  const [startTime, setStartTime] = useState(sleepTime);

  const [endTime, setEndTime] = useState(() => {
    const d = new Date();
    d.setHours(8, 0, 0, 0);
    return d;
  });

  const [activePicker, setActivePicker] = useState(null);
  const [tempTime, setTempTime] = useState(new Date());

  const openPicker = (type) => {
    setActivePicker(type);
    setTempTime(type === 'start' ? startTime : endTime);
  };

  const formatTime = (date) => {
    let h = date.getHours();
    let m = date.getMinutes();
    const ampm = h >= 12 ? '오후' : '오전';
    h = h % 12 || 12;
    return `${ampm} ${h}:${m.toString().padStart(2, '0')}`;
  };

  const handleConfirm = () => {
    if (activePicker === 'start') setStartTime(tempTime);
    if (activePicker === 'end') setEndTime(tempTime);
    setActivePicker(null);
  };

  const handleNext = () => {
    setSleepTime(startTime);
    onNext();
  };

  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeX}>×</Text>
          </TouchableOpacity>

          <Text style={styles.title}>실제 수면 시간을 입력해주세요</Text>

          <View style={styles.row}>
            <TouchableOpacity style={styles.timeBox} onPress={() => openPicker('start')}>
              <Text style={styles.timeText}>{formatTime(startTime)}</Text>
            </TouchableOpacity>

            <Text style={styles.tilde}> ~ </Text>

            <TouchableOpacity style={styles.timeBox} onPress={() => openPicker('end')}>
              <Text style={styles.timeText}>{formatTime(endTime)}</Text>
            </TouchableOpacity>
          </View>

          {activePicker && (
            <View style={styles.pickerWrapper}>
              <DateTimePicker
                value={tempTime}
                mode="time"
                display="spinner"
                onChange={(event, selected) => {
                  if (selected) {
                    setTempTime(selected);
                  }
                }}
              />

              <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
                <Text style={styles.confirmText}>완료</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.btn} onPress={handleNext}>
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
  title: { fontSize: 18, fontWeight: '700', marginBottom: 25 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  timeBox: {
    width: 120,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  timeText: { fontSize: 18, fontWeight: '600' },
  tilde: { fontSize: 22, fontWeight: '700', marginHorizontal: 8 },

  pickerWrapper: {
    width: '100%',
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E3E8F2',
    overflow: 'hidden',
  },

  confirmBtn: {
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  confirmText: {
    color: '#8CB7FF',
    fontSize: 16,
    fontWeight: '700',
  },

  btn: {
    marginTop: 20,
    backgroundColor: '#8CB7FF',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
