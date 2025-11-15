import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const STEPS = [1, 2];

export default function StepProgress({ activeStep = 1 }) {
  return (
    <View style={styles.wrapper}>
      {STEPS.map((step, index) => {
        const isActive = activeStep === step;
        const isCompleted = activeStep > step;
        return (
          <React.Fragment key={step}>
            <View style={styles.circleWrapper}>
              <View
                style={[
                  styles.circle,
                  isCompleted && styles.circleCompleted,
                  isActive && styles.circleActive,
                ]}
              />
            </View>
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 36,
  },
  circleWrapper: {
    paddingHorizontal: 4,
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 100,
    backgroundColor: '#D1D5DB',
  },
  circleActive: {
    backgroundColor: '#3B82F6',
  },
  circleCompleted: {
    backgroundColor: '#3B82F6',
  },
});

