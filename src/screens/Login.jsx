import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';

const Logo = require('../../assets/login/logo.png');
const ZZZ_LAYERS = [
  { id: 'z-small', size: 20, offsetX: 20, offsetY: -12, driftX: 8, driftY: -10, rotate: -4 },
  { id: 'z-mid', size: 32, offsetX: 46, offsetY: -24, driftX: 12, driftY: -16, rotate: -6 },
  { id: 'z-big', size: 48, offsetX: 78, offsetY: -34, driftX: 16, driftY: -22, rotate: -8 },
];

export default function Login({ onNaverLogin = () => {} }) {
  const animatedValues = useRef(ZZZ_LAYERS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const animations = animatedValues.map((value, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 220),
          Animated.timing(value, {
            toValue: 1,
            duration: 1400,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.delay(500),
          Animated.timing(value, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ),
    );

    animations.forEach((anim) => anim.start());
    return () => {
      animations.forEach((anim) => anim.stop());
    };
  }, [animatedValues]);

  return (
    <View style={styles.container}>
      <View style={styles.logoWrapper}>
        <Image source={Logo} style={styles.logo} resizeMode="contain" />
        <View style={styles.zzzContainer}>
          {ZZZ_LAYERS.map((layer, index) => {
            const opacity = animatedValues[index].interpolate({
              inputRange: [0, 0.4, 1],
              outputRange: [0, 1, 0],
            });
            const translateX = animatedValues[index].interpolate({
              inputRange: [0, 1],
              outputRange: [layer.offsetX, layer.offsetX + layer.driftX],
            });
            const translateY = animatedValues[index].interpolate({
              inputRange: [0, 1],
              outputRange: [layer.offsetY, layer.offsetY + layer.driftY],
            });

            return (
              <Animated.Text
                key={layer.id}
                style={[
                  styles.zzz,
                  {
                    fontSize: layer.size,
                    opacity,
                    transform: [
                      { translateX },
                      { translateY },
                      { rotate: `${layer.rotate}deg` },
                    ],
                  },
                ]}
              >
                Z
              </Animated.Text>
            );
          })}
        </View>
      </View>
        <Text style={styles.title}>CASUON</Text>
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.naverButton}
          onPress={onNaverLogin}
        >
          <Text style={styles.naverLogo}>N</Text>
          <Text style={styles.naverText}>네이버 로그인</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
  },
  zzzContainer: {
    position: 'absolute',
    top: -12,
    right: -20,
    width: 160,
    height: 130,
  },
  zzz: {
    color: '#1D6EFF',
    fontWeight: '800',
    position: 'absolute',
    textShadowColor: 'rgba(29,110,255,0.2)',
    textShadowRadius: 8,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 60,
  },
  naverButton: {
    width: '100%',
    maxWidth: 300,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#03C75A',
    borderRadius: 6,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignSelf: 'center',
  },
  naverLogo: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    marginRight: 12,
  },
  naverText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});