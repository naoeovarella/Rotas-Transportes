import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Switch,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getHistory, getFavorites, clearHistory } from '../../services/storageService';

export default function ProfileScreen({ navigation }) {
  const { user, logout }        = useAuth();
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = getStyles(colors);

  const [historyCount,   setHistoryCount]   = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);

  useEffect(() => {
    getHistory().then((h) => setHistoryCount(h.length));
    getFavorites().then((f) => setFavoritesCount(f.length));
  }, []);

  const initials = user?.name
    ?.split(' ')
    .map((n) => n.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();

  function handleLogout() {
    Alert.alert('Sair', 'Deseja encerrar a sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ]);
  }

  async function handleClearHistory() {
    Alert.alert('Limpar histórico', 'Deseja apagar todas as buscas recentes?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Limpar',
        style: 'destructive',
        onPress: async () => {
          await clearHistory();
          setHistoryCount(0);
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meu Perfil</Text>
      </View>

      {/* Avatar */}
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{historyCount}</Text>
          <Text style={styles.statLabel}>Buscas</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{favoritesCount}</Text>
          <Text style={styles.statLabel}>Favoritos</Text>
        </View>
      </View>

      {/* Ações */}
      <View style={styles.actions}>
        {/* Dark mode toggle */}
        <View style={styles.actionItem}>
          <Text style={styles.actionIcon}>{isDark ? '🌙' : '☀️'}</Text>
          <Text style={styles.actionText}>Tema escuro</Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#FFF"
          />
        </View>

        <TouchableOpacity
          style={styles.actionItem}
          onPress={() => navigation.navigate('Favorites')}
        >
          <Text style={styles.actionIcon}>★</Text>
          <Text style={styles.actionText}>Rotas favoritas</Text>
          <Text style={styles.actionArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionItem, { borderBottomWidth: 0 }]} onPress={handleClearHistory}>
          <Text style={styles.actionIcon}>🕐</Text>
          <Text style={styles.actionText}>Limpar histórico de buscas</Text>
          <Text style={styles.actionArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Encerrar sessão</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    header: {
      backgroundColor: colors.headerBg,
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    backBtn: { paddingVertical: 4, paddingRight: 8 },
    backText: { color: colors.primaryLight, fontSize: 14, fontWeight: '600' },
    headerTitle: { color: '#FFF', fontSize: 17, fontWeight: '700' },
    avatarSection: { alignItems: 'center', paddingTop: 32, paddingBottom: 24 },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 14,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    avatarText: { fontSize: 28, fontWeight: '700', color: '#FFF' },
    userName:   { fontSize: 20, fontWeight: '700', color: colors.text },
    userEmail:  { fontSize: 14, color: colors.textMuted, marginTop: 4 },
    statsRow: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      marginHorizontal: 20,
      borderRadius: 14,
      paddingVertical: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 2,
      marginBottom: 20,
    },
    statBox:     { flex: 1, alignItems: 'center' },
    statValue:   { fontSize: 24, fontWeight: '700', color: colors.primary },
    statLabel:   { fontSize: 12, color: colors.textMuted, marginTop: 4 },
    statDivider: { width: 1, backgroundColor: colors.divider },
    actions: {
      backgroundColor: colors.surface,
      marginHorizontal: 20,
      borderRadius: 14,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 2,
      overflow: 'hidden',
    },
    actionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
      gap: 12,
    },
    actionIcon:  { fontSize: 18, width: 24, textAlign: 'center' },
    actionText:  { flex: 1, fontSize: 15, color: colors.text },
    actionArrow: { fontSize: 20, color: colors.textLight },
    logoutBtn: {
      marginHorizontal: 20,
      marginTop: 24,
      backgroundColor: colors.dangerBg,
      borderRadius: 12,
      paddingVertical: 15,
      alignItems: 'center',
    },
    logoutText: { color: colors.danger, fontSize: 15, fontWeight: '700' },
  });
}
