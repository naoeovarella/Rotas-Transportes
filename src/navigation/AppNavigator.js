import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

import LoginScreen          from '../screens/auth/LoginScreen';
import RegisterScreen       from '../screens/auth/RegisterScreen';
import HomeScreen           from '../screens/home/HomeScreen';
import RouteDetailScreen    from '../screens/home/RouteDetailScreen';
import ProfileScreen        from '../screens/profile/ProfileScreen';
import FavoritesScreen      from '../screens/favorites/FavoritesScreen';
import PopularRoutesScreen  from '../screens/popular/PopularRoutesScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useAuth();
  const { colors } = useTheme();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      {user ? (
        <>
          <Stack.Screen name="Home"           component={HomeScreen} />
          <Stack.Screen name="RouteDetail"    component={RouteDetailScreen} />
          <Stack.Screen name="Profile"        component={ProfileScreen} />
          <Stack.Screen name="Favorites"      component={FavoritesScreen} />
          <Stack.Screen name="PopularRoutes"  component={PopularRoutesScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login"    component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
