import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const stored = await AsyncStorage.getItem('@current_user');
      if (stored) setUser(JSON.parse(stored));
    } catch {
      // sessão inválida, ignora
    } finally {
      setLoading(false);
    }
  }

  async function register(name, email, password) {
    const raw = await AsyncStorage.getItem('@users');
    const users = raw ? JSON.parse(raw) : [];

    if (users.find((u) => u.email === email)) {
      throw new Error('E-mail já cadastrado.');
    }

    const newUser = { id: Date.now().toString(), name, email, password };
    users.push(newUser);
    await AsyncStorage.setItem('@users', JSON.stringify(users));
    await AsyncStorage.setItem('@current_user', JSON.stringify(newUser));
    setUser(newUser);
  }

  async function login(email, password) {
    const raw = await AsyncStorage.getItem('@users');
    const users = raw ? JSON.parse(raw) : [];

    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) throw new Error('E-mail ou senha incorretos.');

    await AsyncStorage.setItem('@current_user', JSON.stringify(found));
    setUser(found);
  }

  async function logout() {
    await AsyncStorage.removeItem('@current_user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
