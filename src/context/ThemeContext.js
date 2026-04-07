import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = '@theme';

export const lightColors = {
  background:    '#F5F7FB',
  surface:       '#FFFFFF',
  surfaceAlt:    '#FAFAFA',
  primary:       '#1565C0',
  primaryLight:  '#90CAF9',
  primaryBg:     '#E3F2FD',
  text:          '#212121',
  textSecondary: '#424242',
  textMuted:     '#757575',
  textLight:     '#9E9E9E',
  border:        '#E0E0E0',
  divider:       '#F0F0F0',
  danger:        '#E53935',
  dangerBg:      '#FFEBEE',
  success:       '#43A047',
  warning:       '#FFC107',
  headerBg:      '#1565C0',
  inputBg:       '#FAFAFA',
  badge: {
    SUBWAY: '#1565C0',
    BUS:    '#2E7D32',
    TRAIN:  '#6A1B9A',
  },
};

export const darkColors = {
  background:    '#0F0F0F',
  surface:       '#1C1C1C',
  surfaceAlt:    '#252525',
  primary:       '#90CAF9',
  primaryLight:  '#64B5F6',
  primaryBg:     '#1A2744',
  text:          '#F0F0F0',
  textSecondary: '#CCCCCC',
  textMuted:     '#9E9E9E',
  textLight:     '#616161',
  border:        '#333333',
  divider:       '#2A2A2A',
  danger:        '#EF5350',
  dangerBg:      '#2D1111',
  success:       '#66BB6A',
  warning:       '#FFC107',
  headerBg:      '#0D1B2A',
  inputBg:       '#252525',
  badge: {
    SUBWAY: '#1E88E5',
    BUS:    '#388E3C',
    TRAIN:  '#7B1FA2',
  },
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((val) => {
      if (val === 'dark') setIsDark(true);
    });
  }, []);

  async function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    await AsyncStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
  }

  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
