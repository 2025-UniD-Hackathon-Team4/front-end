import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import {
  DRINK_CATEGORIES,
  DRINK_OPTIONS,
  COFFEE_BRANDS,
  COFFEE_SIZES,
} from '../constants/caffeineData';
import StepProgress from '../components/StepProgress';
import { buildApiUrl } from '../utils/api';

const COFFEE_BRAND_STORE_NAMES = {
  starbucks: '스타벅스',
  twosome: '투썸플레이스',
  mega: '메가커피',
  compose: '컴포즈커피',
};

const DEFAULT_SIZE_LABEL = 'regular';

const createResolvedDate = (input) => {
  if (input instanceof Date) {
    return new Date(input);
  }
  if (typeof input === 'string') {
    const parsed = new Date(input);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  return new Date();
};

const formatDateTimeForApi = (input) => {
  const resolvedDate = createResolvedDate(input);
  return resolvedDate.toISOString().replace(/\.\d{3}Z$/, '');
};

export default function CaffeineLog({
  onSave = () => {},
  onCancel = () => {},
  selectedTime = null,
}) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);
  const [customDrinkName, setCustomDrinkName] = useState('');
  const [customMg, setCustomMg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (!selectedCategory) {
      return;
    }
    if (selectedCategory === 'coffee') {
      setSelectedBrand(null);
    }
    setSelectedOption(null);
    setSelectedSize(null);
    setIsSizeDropdownOpen(false);
    if (selectedCategory !== 'other') {
      setCustomDrinkName('');
      setCustomMg('');
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedCategory !== 'coffee') {
      return;
    }
    setSelectedOption(null);
    setSelectedSize(null);
    setIsSizeDropdownOpen(false);
  }, [selectedCategory, selectedBrand]);

  useEffect(() => {
    if (selectedCategory !== 'coffee') {
      return;
    }
    if (selectedOption) {
      setSelectedSize(null);
      setIsSizeDropdownOpen(true);
    } else {
      setIsSizeDropdownOpen(false);
    }
  }, [selectedCategory, selectedOption]);

  const buildSaveArtifacts = useCallback(() => {
    const resolvedDate = createResolvedDate(selectedTime);
    const resolvedTime = resolvedDate.toISOString();
    const apiDateTime = formatDateTimeForApi(resolvedDate);
    const categoryName = DRINK_CATEGORIES.find((cat) => cat.id === selectedCategory)?.name ?? '';

    if (selectedCategory === 'coffee') {
      if (!selectedBrand || !selectedOption || !selectedSize) {
        return null;
      }
      const storeName = COFFEE_BRAND_STORE_NAMES[selectedBrand] ?? (categoryName || '커피');
      const sizeLabel = selectedSize.label;
      const menuName = selectedOption.name;
      return {
        payload: {
          dateTime: apiDateTime,
          storeName,
          size: sizeLabel,
          menuName,
        },
        clientEntry: {
          beverage: `${menuName} (${sizeLabel})`,
          category: categoryName,
          time: resolvedTime,
          storeName,
          size: sizeLabel,
        },
      };
    }

    if (selectedCategory === 'other') {
      const drinkName = customDrinkName.trim();
      const numericMg = parseInt(customMg, 10);
      if (!drinkName || !numericMg || Number.isNaN(numericMg) || numericMg <= 0) {
        return null;
      }
      const storeName = categoryName || '기타';
      return {
        payload: {
          dateTime: apiDateTime,
          storeName,
          size: DEFAULT_SIZE_LABEL,
          menuName: drinkName,
        },
        clientEntry: {
          beverage: drinkName,
          mg: numericMg,
          category: storeName,
          time: resolvedTime,
          storeName,
          size: DEFAULT_SIZE_LABEL,
        },
      };
    }

    if (!selectedOption) {
      return null;
    }

    const storeName = categoryName || '기타';
    const menuName = selectedOption.name;
    return {
      payload: {
        dateTime: apiDateTime,
        storeName,
        size: DEFAULT_SIZE_LABEL,
        menuName,
      },
      clientEntry: {
        beverage: menuName,
        mg: selectedOption.mg,
        category: storeName,
        time: resolvedTime,
        storeName,
        size: DEFAULT_SIZE_LABEL,
      },
    };
  }, [selectedTime, selectedCategory, selectedBrand, selectedOption, selectedSize, customDrinkName, customMg]);

  const handleSave = useCallback(async () => {
    if (submitting) {
      return;
    }

    const artifacts = buildSaveArtifacts();
    if (!artifacts) {
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch(buildApiUrl('/caffeine/add'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(artifacts.payload),
      });

      console.log(await response.json());
      console.log(artifacts.payload);

      if (!response.ok) {
        throw new Error(`caffeine/add 요청 실패 (status: ${response.status})`);
      }

      // eslint-disable-next-line no-unused-vars
      const _responseData = await response.json().catch(() => null);
      onSave(artifacts.clientEntry);
    } catch (error) {
      console.error('[CaffeineLog] caffeine/add error:', error);
      setSubmitError('실패');
    } finally {
      setSubmitting(false);
    }
  }, [buildSaveArtifacts, onSave, submitting]);

  const selectedTimeLabel = useMemo(() => {
    if (!selectedTime) return null;
    const date = new Date(selectedTime);
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const period = hours >= 12 ? '오후' : '오전';
    const hour12 = hours % 12 || 12;
    return `${period} ${hour12}:${minutes}`;
  }, [selectedTime]);
  const actionButtonLabel = submitting ? '저장 중...' : '완료';

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <Text style={styles.title}>오늘의 카페인 기록</Text>
            <StepProgress activeStep={2} />
            {/* {selectedTimeLabel && (
              <View style={styles.timeBadge}>
                <Text style={styles.timeBadgeLabel}>섭취 시간</Text>
                <Text style={styles.timeBadgeValue}>{selectedTimeLabel}</Text>
              </View>
            )} */}
            <Text style={styles.subtitle}>섭취 음료를 선택해주세요</Text>

            <View style={styles.categoryList}>
              {DRINK_CATEGORIES.map((category) => {
                const isActive = selectedCategory === category.id;
                return (
                  <TouchableOpacity
                    key={category.id}
                    style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                    onPress={() => setSelectedCategory(category.id)}
                  >
                    <Text
                      style={[styles.categoryChipText, isActive && styles.categoryChipTextActive]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {selectedCategory === 'coffee' && (
              <View style={styles.brandList}>
                {COFFEE_BRANDS.map((brand) => {
                  const isActive = selectedBrand === brand.id;
                  return (
                    <TouchableOpacity
                      key={brand.id}
                      style={[styles.brandIconWrapper, isActive && styles.brandIconWrapperActive]}
                      onPress={() => setSelectedBrand(brand.id)}
                      activeOpacity={0.8}
                    >
                      <Image source={brand.source} style={styles.brandIcon} resizeMode="contain" />
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {selectedCategory === 'coffee' ? (
              selectedBrand ? (
                <>
                  <View style={styles.coffeeOptionGrid}>
                    {(DRINK_OPTIONS.coffee[selectedBrand] || []).map((option) => {
                      const isActive = selectedOption && selectedOption.id === option.id;
                      return (
                        <TouchableOpacity
                          key={option.id}
                          style={[
                            styles.coffeeOptionCard,
                            isActive && styles.coffeeOptionCardActive,
                          ]}
                          onPress={() => setSelectedOption(option)}
                          activeOpacity={0.9}
                        >
                          <Image source={option.image} style={styles.coffeeOptionImage} />
                          <Text
                            style={[styles.coffeeOptionName, isActive && styles.coffeeOptionNameActive]}
                          >
                            {option.name}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                  <View style={styles.sizeDropdownContainer}>
                    <TouchableOpacity
                      style={[
                        styles.sizeDropdownTrigger,
                        !selectedOption && styles.sizeDropdownTriggerDisabled,
                      ]}
                      onPress={() => setIsSizeDropdownOpen((prev) => !prev)}
                      activeOpacity={0.9}
                      disabled={!selectedOption}
                    >
                      <Text
                        style={[
                          selectedSize ? styles.sizeDropdownValue : styles.sizeDropdownPlaceholder,
                          !selectedOption && styles.sizeDropdownPlaceholderDisabled,
                        ]}
                      >
                        {selectedSize
                          ? selectedSize.label
                          : '사이즈를 선택해주세요'}
                      </Text>
                      <Text
                        style={[
                          styles.sizeDropdownCaret,
                          !selectedOption && styles.sizeDropdownCaretDisabled,
                        ]}
                      >
                        {isSizeDropdownOpen ? '▲' : '▼'}
                      </Text>
                    </TouchableOpacity>
                    {selectedOption && isSizeDropdownOpen && (
                      <View style={styles.sizeDropdownList}>
                        {(COFFEE_SIZES[selectedBrand] || []).map((size, index, arr) => {
                          const isActive = selectedSize && selectedSize.id === size.id;
                          const isLast = index === arr.length - 1;
                          return (
                            <TouchableOpacity
                              key={size.id}
                              style={[
                                styles.sizeOption,
                                !isLast && styles.sizeOptionDivider,
                                isActive && styles.sizeOptionActive,
                              ]}
                              onPress={() => {
                                setSelectedSize(size);
                                setIsSizeDropdownOpen(false);
                              }}
                              activeOpacity={0.9}
                            >
                              <View>
                                <Text
                                  style={[
                                    styles.sizeOptionLabel,
                                    isActive && styles.sizeOptionLabelActive,
                                  ]}
                                >
                                  {size.label}
                                </Text>
                              </View>
                              <View style={[styles.radio, isActive && styles.sizeOptionRadioActive]}>
                                <View
                                  style={[
                                    styles.radioInner,
                                    isActive && styles.sizeOptionRadioInnerActive,
                                  ]}
                                />
                              </View>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    )}
                  </View>
                </>
              ) : null
            ) : selectedCategory === 'other' ? (
              <View style={styles.customMgContainer}>
                <View style={styles.customDrinkInputWrapper}>
                  <TextInput
                    style={styles.customDrinkInput}
                    placeholder="섭취 음료를 입력해주세요"
                    placeholderTextColor="#94A3B8"
                    value={customDrinkName}
                    onChangeText={setCustomDrinkName}
                    returnKeyType="next"
                  />
                </View>
                <View style={styles.customMgInputWrapper}>
                  <TextInput
                    style={styles.customMgInput}
                    placeholder="섭취량을 입력해주세요"
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    value={customMg}
                    onChangeText={setCustomMg}
                  />
                  <Text style={styles.customMgSuffix}>mg</Text>
                </View>
              </View>
            ) : (
              <View style={styles.optionList}>
                {(DRINK_OPTIONS[selectedCategory] || []).map((option) => {
                  const isActive = selectedOption && selectedOption.id === option.id;
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
                      </View>
                      <View style={styles.radio}>
                        <View style={[styles.radioInner, isActive && styles.radioInnerActive]} />
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            <View style={styles.actions}>
              <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={onCancel}>
                <Text style={styles.cancelButtonText}>이전</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.saveButton,
                  submitting && styles.saveButtonDisabled,
                ]}
                onPress={handleSave}
                disabled={submitting}
              >
                <Text style={styles.saveButtonText}>{actionButtonLabel}</Text>
              </TouchableOpacity>
            </View>
            {submitError && <Text style={styles.errorText}>{submitError}</Text>}
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
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
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'center',
    marginBottom: 12,
    marginTop: -39,
  },
  timeBadgeLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  timeBadgeValue: {
    fontSize: 15,
    color: '#1F2433',
    fontWeight: '700',
  },
  optionList: {
    gap: 14,
    marginBottom: 24,
  },
  categoryList: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
    marginBottom: 32,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#E4E8F0',
    backgroundColor: '#FFFFFF',
  },
  categoryChipActive: {
    borderColor: '#6B7280',
    backgroundColor: '#6B7280',
  },
  categoryChipText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  brandList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -16,
    marginBottom: 24,
  },
  brandIconWrapper: {
    width: 54,
    height: 54,
    borderRadius: 8,
    backgroundColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandIconWrapperActive: {
    borderWidth: 1.5,
    borderColor: '#404040',
  },
  brandIcon: {
    width: 40,
    height: 40,
  },
  coffeeOptionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  coffeeOptionCard: {
    width: '48%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4E8F0',
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    paddingHorizontal: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  coffeeOptionCardActive: {
    borderColor: '#3D7BFF',
    backgroundColor: '#F0F5FF',
  },
  coffeeOptionImage: {
    width: 80,
    height: 80,
    marginBottom: 12,
    resizeMode: 'contain',
  },
  coffeeOptionName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#171717',
  },
  coffeeOptionNameActive: {
    color: '#1C3FAA',
  },
  sizeDropdownContainer: {
    marginBottom: 32,
    gap: 12,
  },
  sizeDropdownTrigger: {
    borderWidth: 1,
    borderColor: '#E4E8F0',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sizeDropdownTriggerDisabled: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  sizeDropdownPlaceholder: {
    fontSize: 18,
    fontWeight: '500',
    color: '#94A3B8',
  },
  sizeDropdownPlaceholderDisabled: {
    color: '#CBD5F5',
  },
  sizeDropdownValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2433',
  },
  sizeDropdownCaret: {
    fontSize: 14,
    color: '#94A3B8',
    marginLeft: 8,
  },
  sizeDropdownCaretDisabled: {
    color: '#CBD5F5',
  },
  sizeDropdownList: {
    borderWidth: 1,
    borderColor: '#E4E8F0',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  sizeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  sizeOptionDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#E4E8F0',
  },
  sizeOptionActive: {
    backgroundColor: '#F0F5FF',
  },
  sizeOptionLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2433',
  },
  sizeOptionLabelActive: {
    color: '#1C3FAA',
  },
  sizeOptionRadioActive: {
    borderColor: '#3D7BFF',
  },
  sizeOptionRadioInnerActive: {
    backgroundColor: '#3D7BFF',
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
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2433',
  },
  optionNameActive: {
    color: '#1C3FAA',
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
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#D0D5DD',
  },
  saveButton: {
    backgroundColor: '#3D7BFF',
  },
  saveButtonDisabled: {
    backgroundColor: '#93C5FD',
  },
  cancelButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4B5563',
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  customMgContainer: {
    marginBottom: 32,
    gap: 20,
  },
  customDrinkInputWrapper: {
    borderWidth: 1,
    borderColor: '#E4E8F0',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  customDrinkInput: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1F2433',
  },
  customMgInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E4E8F0',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  customMgInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#1F2433',
  },
  customMgSuffix: {
    fontSize: 18,
    fontWeight: '600',
    color: '#94A3B8',
    marginLeft: 8,
  },
  errorText: {
    marginTop: 12,
    textAlign: 'center',
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '500',
  },
});