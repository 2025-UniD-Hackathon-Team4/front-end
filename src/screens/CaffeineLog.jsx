import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const DRINK_OPTIONS = [
  { id: 'americano', name: '아메리카노', mg: 95 },
  { id: 'latte', name: '카페라떼', mg: 75 },
  { id: 'espresso', name: '에스프레소', mg: 63 },
  { id: 'coldbrew', name: '콜드브루', mg: 150 },
];

export default function CaffeineLog({ onSave = () => {}, onCancel = () => {} }) {
  const [selectedOption, setSelectedOption] = useState(DRINK_OPTIONS[0]);

  const handleSave = () => {
    const now = new Date();
    onSave({
      beverage: selectedOption.name,
      mg: selectedOption.mg,
      time: now.toISOString(),
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>카페인 기록</Text>
        <Text style={styles.subtitle}>오늘 마신 음료를 선택해주세요.</Text>

        <View style={styles.optionList}>
          {DRINK_OPTIONS.map((option) => {
            const isActive = selectedOption.id === option.id;
            return (
              <TouchableOpacity
                key={option.id}
                style={[styles.optionButton, isActive && styles.optionButtonActive]}
                onPress={() => setSelectedOption(option)}
              >
                <View>
                  <Text style={[styles.optionName, isActive && styles.optionNameActive]}>
                    {option.name}
                  </Text>
                  <Text style={[styles.optionGuide, isActive && styles.optionGuideActive]}>
                    {option.mg}mg 기준
                  </Text>
                </View>
                <View style={styles.radio}>
                  <View style={[styles.radioInner, isActive && styles.radioInnerActive]} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>취소</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.saveButton]} onPress={handleSave}>
            <Text style={styles.saveButtonText}>기록 저장</Text>
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
    paddingVertical: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1D1D1F',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7285',
    marginTop: 8,
    marginBottom: 24,
  },
  optionList: {
    gap: 14,
    marginBottom: 24,
  },
  optionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E4E8F0',
    backgroundColor: '#FFFFFF',
  },
  optionButtonActive: {
    borderColor: '#3D7BFF',
    backgroundColor: '#F0F5FF',
  },
  optionName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2433',
  },
  optionNameActive: {
    color: '#1C3FAA',
  },
  optionGuide: {
    fontSize: 14,
    color: '#8B92A7',
    marginTop: 4,
  },
  optionGuideActive: {
    color: '#5571D9',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#B7C1D6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  radioInnerActive: {
    backgroundColor: '#3D7BFF',
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
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#D0D5DD',
  },
  saveButton: {
    backgroundColor: '#3D7BFF',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

