import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Login from './src/screens/Login';
import Home from './src/screens/Home';
import Stats from './src/screens/Stats';
import My from './src/screens/My';
import CaffeineLog from './src/screens/CaffeineLog';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login'); // login | main | caffeineLog
  const [activeTab, setActiveTab] = useState('home');
  const [caffeineEntries, setCaffeineEntries] = useState([]);

  const handleNaverLogin = () => {
    setActiveTab('home');
    setCurrentScreen('main');
  };

  const handleOpenCaffeineLog = () => {
    setCurrentScreen('caffeineLog');
  };

  const handleCancelCaffeineLog = () => {
    setCurrentScreen('main');
  };

  const handleSaveCaffeineEntry = (entry) => {
    setCaffeineEntries((prev) => [...prev, entry]);
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
            onAddCaffeinePress={handleOpenCaffeineLog}
          />
        );
    }
  };

  const renderContent = () => {
    if (currentScreen === 'login') {
      return <Login onNaverLogin={handleNaverLogin} />;
    }
    if (currentScreen === 'caffeineLog') {
      return (
        <CaffeineLog
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