import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Linking,
  Alert,
  Modal,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import Constants from 'expo-constants';
import { WebView } from 'react-native-webview';

const Logo = require('../../assets/login/logo.png');
const ZZZ_LAYERS = [
  { id: 'z-small', size: 20, offsetX: 20, offsetY: -12, driftX: 8, driftY: -10, rotate: -4 },
  { id: 'z-mid', size: 32, offsetX: 46, offsetY: -24, driftX: 12, driftY: -16, rotate: -6 },
  { id: 'z-big', size: 48, offsetX: 78, offsetY: -34, driftX: 16, driftY: -22, rotate: -8 },
];
const NAVER_LOGIN_PATH = '/oauth2/authorization/naver';
const NAVER_LOGIN_SUCCESS_PATH = '/login-success';

const getApiBaseUrl = () => {
  const expoConfig = Constants.expoConfig ?? Constants.manifest ?? {};
  const apiUrlFromConfig = expoConfig?.extra?.apiUrl;
  const apiUrlFromEnv = process.env.EXPO_PUBLIC_API_URL ?? process.env.API_URL;
  const resolvedUrl = [apiUrlFromConfig, apiUrlFromEnv].find(
    (value) => typeof value === 'string' && value.trim().length > 0,
  );

  if (!resolvedUrl) {
    throw new Error('API URL 환경 변수가 설정되지 않았습니다.');
  }

  return resolvedUrl.replace(/\/+$/, '');
};

const buildNaverLoginUrl = () => `${getApiBaseUrl()}${NAVER_LOGIN_PATH}`;

const openNaverLoginPage = async () => {
  try {
    const url = buildNaverLoginUrl();
    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      throw new Error('링크 열기 미지원');
    }
    await Linking.openURL(url);
  } catch (error) {
    console.error('[Login] Naver login redirect failed:', error);
    Alert.alert('로그인 오류', '네이버 로그인 페이지로 이동하지 못했어요. 잠시 후 다시 시도해 주세요.');
  }
};

export default function Login({ onNaverLogin, onNaverLoginSuccess }) {
  const animatedValues = useRef(ZZZ_LAYERS.map(() => new Animated.Value(0))).current;
  const [isWebViewVisible, setWebViewVisible] = useState(false);
  const [webViewLoading, setWebViewLoading] = useState(false);
  const [webViewKey, setWebViewKey] = useState(0);

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

  const handleNaverLoginPress = () => {
    if (typeof onNaverLogin === 'function') {
      onNaverLogin();
      return;
    }
    setWebViewVisible(true);
    setWebViewLoading(true);
    setWebViewKey((prev) => prev + 1);
  };

  const handleCloseWebView = () => {
    setWebViewVisible(false);
  };

  const handleWebViewError = async () => {
    setWebViewVisible(false);
    Alert.alert('로그인 오류', '웹뷰를 불러오지 못했어요. 기본 브라우저에서 다시 시도해 주세요.');
    await openNaverLoginPage();
  };

  const handleNavigationChange = (navState) => {
    if (typeof onNaverLoginSuccess !== 'function' || !navState?.url) {
      return;
    }

    try {
      const parsedUrl = new URL(navState.url);
      if (parsedUrl.pathname !== NAVER_LOGIN_SUCCESS_PATH) {
        return;
      }
      const params = Object.fromEntries(parsedUrl.searchParams.entries());
      setWebViewVisible(false);
      setWebViewLoading(false);
      onNaverLoginSuccess(params);
    } catch (error) {
      console.warn('[Login] Failed to parse login success URL', error);
    }
  };

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
        <TouchableOpacity activeOpacity={0.85} style={styles.naverButton} onPress={handleNaverLoginPress}>
          <Text style={styles.naverLogo}>N</Text>
          <Text style={styles.naverText}>네이버 로그인</Text>
        </TouchableOpacity>
        <Modal
          visible={isWebViewVisible}
          animationType="slide"
          presentationStyle="fullScreen"
          onRequestClose={handleCloseWebView}
        >
          <SafeAreaView style={styles.webViewSafeArea}>
            <View style={styles.webViewContainer}>
              <View style={styles.webViewHeader}>
                <Text style={styles.webViewTitle}>네이버 로그인</Text>
                <TouchableOpacity onPress={handleCloseWebView} style={styles.webViewCloseButton}>
                  <Text style={styles.webViewCloseText}>닫기</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.webViewBody}>
                <WebView
                  key={webViewKey}
                  source={{ uri: buildNaverLoginUrl() }}
                  onNavigationStateChange={handleNavigationChange}
                  onLoadStart={() => setWebViewLoading(true)}
                  onLoadEnd={() => setWebViewLoading(false)}
                  startInLoadingState
                  onError={handleWebViewError}
                />
                {webViewLoading && (
                  <View style={styles.webViewLoadingOverlay}>
                    <ActivityIndicator size="large" color="#03C75A" />
                  </View>
                )}
              </View>
            </View>
          </SafeAreaView>
        </Modal>
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
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: 'center',
  },
  naverLogo: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    marginRight: 12,
  },
  naverText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  webViewSafeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webViewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 18,
    paddingBottom: 12,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E5EA',
  },
  webViewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },
  webViewCloseButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  webViewCloseText: {
    fontSize: 16,
    color: '#1D6EFF',
    fontWeight: '600',
  },
  webViewBody: {
    flex: 1,
  },
  webViewLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.65)',
  },
});