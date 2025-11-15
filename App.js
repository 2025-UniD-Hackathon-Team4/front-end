import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Login from './src/screens/Login';
import Home from './src/screens/Home';
import Stats from './src/screens/Stats';
import My from './src/screens/My';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [activeTab, setActiveTab] = useState('home');

  const handleNaverLogin = () => {
    setActiveTab('home');
    setCurrentScreen('main');
  };

  const renderMainScreen = () => {
    switch (activeTab) {
      case 'stats':
        return <Stats activeTab={activeTab} onTabChange={setActiveTab} />;
      case 'my':
        return <My activeTab={activeTab} onTabChange={setActiveTab} />;
      case 'home':
      default:
        return <Home activeTab={activeTab} onTabChange={setActiveTab} />;
    }
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <StatusBar style="light" />
      {currentScreen === 'login' ? (
        <Login onNaverLogin={handleNaverLogin} />
      ) : (
        renderMainScreen()
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});