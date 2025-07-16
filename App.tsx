import React, { useState } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ItemProvider } from './src/context/ItemContext';
import { ThemeProvider, useTheme } from './src/theme/ThemeProvider';
import HomeScreen from './src/screens/HomeScreen';
import SplashScreen from './src/components/SplashScreen';

const AppContent = () => {
  const { isDark, colors } = useTheme();
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  return (
    <ItemProvider>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent={true}
      />

      {showSplash ? (
        <SplashScreen onFinish={handleSplashFinish} />
      ) : (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
          <HomeScreen />
        </SafeAreaView>
      )}
    </ItemProvider>
  );
};

function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;