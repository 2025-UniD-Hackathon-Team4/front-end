import Constants from 'expo-constants';

const resolveApiBaseUrl = () => {
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

export const getApiBaseUrl = () => resolveApiBaseUrl();

export const buildApiUrl = (path = '') => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
};

