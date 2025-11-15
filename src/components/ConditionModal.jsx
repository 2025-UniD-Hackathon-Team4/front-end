import React, { useMemo, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { buildApiUrl } from '../utils/api';

const CONDITION_SCORE = {
  great: 3,
  normal: 2,
  bad: 1,
};

export default function ConditionModal({
  visible,
  condition,
  setCondition,
  sleepStartAt,
  sleepEndAt,
  authHeaders = {},
  userId = 1,
  onAnalyze,
  onClose,
}) {
  const [submitting, setSubmitting] = useState(false);
  const freshness = useMemo(() => CONDITION_SCORE[condition] || 0, [condition]);

  const sleepStartAtIso = useMemo(() => {
    if (sleepStartAt instanceof Date && !Number.isNaN(sleepStartAt.getTime())) {
      return sleepStartAt.toISOString();
    }
    return null;
  }, [sleepStartAt]);

  const sleepEndAtIso = useMemo(() => {
    if (sleepEndAt instanceof Date && !Number.isNaN(sleepEndAt.getTime())) {
      return sleepEndAt.toISOString();
    }
    return null;
  }, [sleepEndAt]);

  const handleAnalyze = async () => {
    if (!freshness || !sleepStartAtIso || !sleepEndAtIso || submitting) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(buildApiUrl('/api/daily-summary'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify({
          userId,
          sleepStartAt: sleepStartAtIso,
          sleepEndAt: sleepEndAtIso,
          freshness,
        }),
      });
      console.log(JSON.stringify({
        userId,
        sleepStartAt: sleepStartAtIso,
        sleepEndAt: sleepEndAtIso,
        freshness,
      }));

      if (!response.ok) {
        throw new Error(`daily-summary 요청 실패 (status: ${response.status})`);
      }

      const { conditionSummary } = await response.json();
      onAnalyze?.(conditionSummary);
    } catch (error) {
      console.error('[ConditionModal] daily-summary error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeX}>×</Text>
          </TouchableOpacity>

          <Text style={styles.title}>기상 후 컨디션을 선택해주세요</Text>

          <TouchableOpacity
            style={[styles.optionBox, condition === 'great' && styles.optionActive]}
            onPress={() => setCondition('great')}
          >
            <Text style={styles.emoji}>😍</Text>
            <View>
              <Text style={styles.optionTitle}>상쾌함</Text>
              <Text style={styles.optionDesc}>매우 좋은 컨디션</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionBox, condition === 'normal' && styles.optionActive]}
            onPress={() => setCondition('normal')}
          >
            <Text style={styles.emoji}>😄</Text>
            <View>
              <Text style={styles.optionTitle}>보통</Text>
              <Text style={styles.optionDesc}>평범한 컨디션</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionBox, condition === 'bad' && styles.optionActive]}
            onPress={() => setCondition('bad')}
          >
            <Text style={styles.emoji}>😫</Text>
            <View>
              <Text style={styles.optionTitle}>피곤함</Text>
              <Text style={styles.optionDesc}>나쁜 컨디션</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.analyzeBtn, (!freshness || submitting) && styles.analyzeBtnDisabled]}
            onPress={handleAnalyze}
            disabled={!freshness || submitting}
          >
            <Text style={styles.analyzeText}>{submitting ? '분석 중...' : '분석하기'}</Text>
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
  },
  closeButton: { position: 'absolute', left: 15, top: 15 },
  closeX: { fontSize: 28 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 20, textAlign: 'center',  },

  optionBox: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#DDD',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#F9FBFF',
  },
  optionActive: {
    borderColor: '#8CB7FF',
    backgroundColor: '#EAF2FF',
  },
  emoji: { fontSize: 28, marginRight: 12 },
  optionTitle: { fontSize: 16, fontWeight: '700' },
  optionDesc: { fontSize: 12, color: '#777' },

  analyzeBtn: {
    backgroundColor: '#3D7BFF',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
  },
  analyzeBtnDisabled: {
    backgroundColor: '#A5BDF5',
  },
  analyzeText: {
    textAlign: 'center',
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
