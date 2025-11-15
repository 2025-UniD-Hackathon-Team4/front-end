import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import NavigationTopBar from '../components/NavigationTopBar';

export default function My({ activeTab = 'my', onTabChange = () => {} }) {
  const [selectedSensitivity, setSelectedSensitivity] = useState('normal');

  const [sleepTime, setSleepTime] = useState(new Date(2025, 0, 1, 23, 0)); 
  const [showPicker, setShowPicker] = useState(false);

  const formatTime = (date) => {
    let h = date.getHours();
    let m = date.getMinutes();
    const ampm = h >= 12 ? '오후' : '오전';
    h = h % 12 || 12;
    return `${ampm} ${h}:${m.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        <View style={styles.content}>
          {/* 프로필 */}
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>N</Text>
            </View>
            <Text style={styles.profileName}>홍길동</Text>
          </View>

          {/* 카페인 민감도 */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>카페인 민감도</Text>

            {/* 민감 */}
            <TouchableOpacity
              style={[
                styles.optionBox,
                selectedSensitivity === 'sensitive' && styles.optionActive,
              ]}
              onPress={() => setSelectedSensitivity('sensitive')}
            >
              <Text style={styles.optionTitle}>민감</Text>
              <Text style={styles.optionDesc}>카페인에 매우 민감함</Text>
            </TouchableOpacity>

            {/* 보통 */}
            <TouchableOpacity
              style={[
                styles.optionBox,
                selectedSensitivity === 'normal' && styles.optionActive,
              ]}
              onPress={() => setSelectedSensitivity('normal')}
            >
              <Text style={styles.optionTitle}>보통</Text>
              <Text style={styles.optionDesc}>일반적인 민감도</Text>
            </TouchableOpacity>

            {/* 둔함 */}
            <TouchableOpacity
              style={[
                styles.optionBox,
                selectedSensitivity === 'low' && styles.optionActive,
              ]}
              onPress={() => setSelectedSensitivity('low')}
            >
              <Text style={styles.optionTitle}>둔함</Text>
              <Text style={styles.optionDesc}>카페인 내성이 있음</Text>
            </TouchableOpacity>
          </View>

          {/* 취침 시간 */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>기본 목표 취침 시간</Text>

            <TouchableOpacity
              style={styles.timeBox}
              onPress={() => setShowPicker(true)}
            >
              <Text style={styles.timeText}>{formatTime(sleepTime)}</Text>
            </TouchableOpacity>
          </View>

          {/* 로그아웃 */}
          <TouchableOpacity style={styles.logoutButton}>
            <Text style={styles.logoutText}>로그아웃</Text>
          </TouchableOpacity>
        </View>

        <NavigationTopBar activeTab={activeTab} onTabChange={onTabChange} />

        {/* ===== 모달 TimePicker ===== */}
        <Modal
          transparent={true}
          visible={showPicker}
          animationType="fade"
          onRequestClose={() => setShowPicker(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              
              <DateTimePicker
                value={sleepTime}
                mode="time"
                display="spinner"
                onChange={(event, selectedDate) => {
                  if (selectedDate) setSleepTime(selectedDate);
                }}
              />

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowPicker(false)}
              >
                <Text style={styles.modalButtonText}>확인</Text>
              </TouchableOpacity>

            </View>
          </View>
        </Modal>

      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  modalContainer: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center'
  },

  modalButton: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: '#8CB7FF',
    borderRadius: 12
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '700'
  },

  /* 기존 스타일 아래 동일 */
  safeArea: { flex: 1, backgroundColor: '#F6F8FC' },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 24, justifyContent: 'space-between' },
  content: { flex: 1 },
  profileRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 32 },
  avatar: { width: 64, height: 64, backgroundColor: '#D9F0A2', borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  avatarText: { fontSize: 28, fontWeight: '700', color: '#1D1D1F' },
  profileName: { fontSize: 24, fontWeight: '700', color: '#1D1D1F' },

  sectionCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 28, borderWidth: 1, borderColor: '#CDD5DF' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#202234', marginBottom: 14 },

  optionBox: { backgroundColor: '#F9FBFF', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E5E8EF', marginBottom: 10 },
  optionActive: { borderColor: '#8CB7FF', backgroundColor: '#EAF2FF' },
  optionTitle: { fontSize: 16, fontWeight: '700', color: '#1D1D1F' },
  optionDesc: { fontSize: 13, color: '#646A7A', marginTop: 4 },

  timeBox: { backgroundColor: '#F9FBFF', borderRadius: 12, paddingVertical: 18, alignItems: 'center', borderWidth: 1, borderColor: '#E5E8EF' },
  timeText: { fontSize: 20, fontWeight: '600', color: '#1D1D1F' },

  logoutButton: { marginTop: 12, alignSelf: 'center' },
  logoutText: { fontSize: 15, color: '#8A8A95', textDecorationLine: 'underline' },
});
