import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavigationTopBar from '../components/NavigationTopBar';

export default function My({ activeTab = 'my', onTabChange = () => {} }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>...</Text>
            </View>
            <View>
              <Text style={styles.profileName}>user</Text>
              <Text style={styles.profileEmail}>user@test.com</Text>
            </View>
          </View>
        </View>
        <NavigationTopBar activeTab={activeTab} onTabChange={onTabChange} />
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
    paddingHorizontal: 20,
    paddingTop: 24,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#F7F9FF',
    borderWidth: 1,
    borderColor: '#E1E5ED',
    marginBottom: 24,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E1ECFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1D1D1F',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D1D1F',
  },
  profileEmail: {
    fontSize: 14,
    color: '#5C5C66',
    marginTop: 4,
  },
});