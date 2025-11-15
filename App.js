import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Login from './src/screens/Login';
import Home from './src/screens/Home';
import Stats from './src/screens/Stats';
import My from './src/screens/My';
import TimeLog from './src/screens/TimeLog';
import CaffeineLog from './src/screens/CaffeineLog';
import * as WebBrowser from 'expo-web-browser';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login'); // login | main | timeLog | caffeineLog
  const [activeTab, setActiveTab] = useState('home');
  const [caffeineEntries, setCaffeineEntries] = useState([]);
  const [pendingIntakeTime, setPendingIntakeTime] = useState(null);

  /*const handleNaverLogin = () => {
    setActiveTab('home');
    setCurrentScreen('main');
  };*/
    const handleNaverLogin = async () => {
    const loginUrl = `${process.env.EXPO_PUBLIC_API_URL}/oauth2/authorization/naver`;
    await WebBrowser.openBrowserAsync(loginUrl);
  };

  const handleOpenTimeLog = () => {
    setCurrentScreen('timeLog');
  };

  const handleCancelTimeLog = () => {
    setPendingIntakeTime(null);
    setCurrentScreen('main');
  };

  const handleCancelCaffeineLog = () => {
    setCurrentScreen('timeLog');
  };

  const handleSelectTime = (timeISO) => {
    setPendingIntakeTime(timeISO);
    setCurrentScreen('caffeineLog');
  };

  const handleSaveCaffeineEntry = (entry) => {
    setCaffeineEntries((prev) => [...prev, entry]);
    setPendingIntakeTime(null);
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
        return (
          <Home
            activeTab={activeTab}
            onTabChange={setActiveTab}
            caffeineEntries={caffeineEntries}
            onAddCaffeinePress={handleOpenTimeLog}
          />
        );
    }
  };

  const renderContent = () => {
    if (currentScreen === 'login') {
      return <Login onNaverLogin={handleNaverLogin} />;
    }
    if (currentScreen === 'timeLog') {
      return (
        <TimeLog
          initialTime={pendingIntakeTime}
          onCancel={handleCancelTimeLog}
          onSave={handleSelectTime}
        />
      );
    }
    if (currentScreen === 'caffeineLog') {
      return (
        <CaffeineLog
          selectedTime={pendingIntakeTime}
          onCancel={handleCancelCaffeineLog}
          onSave={(entry) =>
            handleSaveCaffeineEntry({
              ...entry,
              id: `${Date.now()}`,
            })
          }
        />
      );
    }
    return renderMainScreen();
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <StatusBar style="light" />
      {renderContent()}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});