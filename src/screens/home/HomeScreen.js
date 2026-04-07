import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { fetchRoutes } from '../../services/mapsService';
import { addToHistory, getHistory, clearHistory } from '../../services/storageService';
import RouteCard from '../../components/RouteCard';

const FILTERS = [
  { key: 'ALL',    label: 'Todos' },
  { key: 'SUBWAY', label: 'Metrô' },
  { key: 'BUS',    label: 'Ônibus' },
  { key: 'TRAIN',  label: 'Trem' },
];

const SORTS = [
  { key: 'duration', label: '⏱ Tempo' },
  { key: 'distance', label: '📍 Distância' },
];

export default function HomeScreen({ navigation, route }) {
  const { user, logout } = useAuth();
  const { colors }       = useTheme();
  const styles           = getStyles(colors);

  const [origin, setOrigin]           = useState('');
  const [destination, setDestination] = useState('');
  const [routes, setRoutes]           = useState([]);
  const [loading, setLoading]         = useState(false);
  const [searched, setSearched]       = useState(false);
  const [history, setHistory]         = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [filterType, setFilterType]   = useState('ALL');
  const [sortBy, setSortBy]           = useState('duration');

  // Relógio ao vivo
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Histórico
  useEffect(() => {
    getHistory().then(setHistory);
  }, []);

  // Preenche campos vindos de Rotas Populares
  useEffect(() => {
    if (route?.params?.prefillOrigin) {
      setOrigin(route.params.prefillOrigin);
      setDestination(route.params.prefillDestination);
    }
  }, [route?.params]);

  const formattedTime = currentTime.toLocaleTimeString('pt-BR', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const formattedDate = currentTime.toLocaleDateString('pt-BR', {
    weekday: 'short', day: '2-digit', month: 'short',
  });

  // Filtro + ordenação
  const displayedRoutes = useMemo(() => {
    let list = routes;
    if (filterType !== 'ALL') {
      list = routes.filter((r) => {
        const t = r.steps.find((s) => s.type === 'transit');
        return t?.vehicle === filterType;
      });
    }
    return [...list].sort((a, b) =>
      sortBy === 'duration'
        ? a.durationValue - b.durationValue
        : parseFloat(a.distance) - parseFloat(b.distance)
    );
  }, [routes, filterType, sortBy]);

  async function handleSearch() {
    if (!origin.trim() || !destination.trim()) {
      Alert.alert('Atenção', 'Informe a origem e o destino.');
      return;
    }
    setLoading(true);
    setSearched(false);
    setFilterType('ALL');
    setSortBy('duration');
    try {
      const result = await fetchRoutes(origin.trim(), destination.trim());
      setRoutes(result);
      setSearched(true);
      const updated = await addToHistory(origin.trim(), destination.trim());
      setHistory(updated);
    } catch (err) {
      Alert.alert('Erro', err.message ?? 'Não foi possível buscar rotas.');
    } finally {
      setLoading(false);
    }
  }

  function applyHistory(item) {
    setOrigin(item.origin);
    setDestination(item.destination);
    setSearched(false);
    setRoutes([]);
  }

  async function handleClearHistory() {
    await clearHistory();
    setHistory([]);
  }

  function handleLogout() {
    Alert.alert('Sair', 'Deseja encerrar a sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ]);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>Olá, {user?.name?.split(' ')[0]} 👋</Text>
          <Text style={styles.headerSubtitle}>Para onde você quer ir?</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.clockBox}>
            <Text style={styles.clockTime}>{formattedTime}</Text>
            <Text style={styles.clockDate}>{formattedDate}</Text>
          </View>
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.profileInitial}>
              {user?.name?.charAt(0).toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        {/* Campos de busca */}
        <View style={styles.searchCard}>
          <View style={styles.inputRow}>
            <View style={styles.dotGreen} />
            <TextInput
              style={styles.searchInput}
              placeholder="Localização atual"
              placeholderTextColor={colors.textLight}
              value={origin}
              onChangeText={setOrigin}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.inputRow}>
            <View style={styles.dotRed} />
            <TextInput
              style={styles.searchInput}
              placeholder="Destino"
              placeholderTextColor={colors.textLight}
              value={destination}
              onChangeText={setDestination}
            />
          </View>
        </View>

        {/* Botões de ação */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.searchButton, loading && styles.searchButtonDisabled, { flex: 1 }]}
            onPress={handleSearch}
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.searchButtonText}>Buscar Rotas</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.popularBtn}
            onPress={() => navigation.navigate('PopularRoutes')}
          >
            <Text style={styles.popularBtnText}>⭐</Text>
          </TouchableOpacity>
        </View>

        {/* Histórico */}
        {history.length > 0 && !searched && !loading && (
          <View style={styles.historySection}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>Buscas recentes</Text>
              <TouchableOpacity onPress={handleClearHistory}>
                <Text style={styles.historyClear}>Limpar</Text>
              </TouchableOpacity>
            </View>
            {history.map((item, i) => (
              <TouchableOpacity key={i} style={styles.historyItem} onPress={() => applyHistory(item)}>
                <Text style={styles.historyIcon}>🕐</Text>
                <Text style={styles.historyText} numberOfLines={1}>
                  {item.origin} → {item.destination}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Filtros + Ordenação */}
        {searched && (
          <View style={styles.resultsSection}>
            <Text style={styles.resultsTitle}>Rotas disponíveis</Text>
            <Text style={styles.resultsSubtitle}>{origin} → {destination}</Text>

            {/* Filtros */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
              {FILTERS.map((f) => (
                <TouchableOpacity
                  key={f.key}
                  style={[styles.filterChip, filterType === f.key && styles.filterChipActive]}
                  onPress={() => setFilterType(f.key)}
                >
                  <Text style={[styles.filterChipText, filterType === f.key && styles.filterChipTextActive]}>
                    {f.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Ordenação */}
            <View style={styles.sortRow}>
              <Text style={styles.sortLabel}>Ordenar:</Text>
              {SORTS.map((s) => (
                <TouchableOpacity
                  key={s.key}
                  style={[styles.sortBtn, sortBy === s.key && styles.sortBtnActive]}
                  onPress={() => setSortBy(s.key)}
                >
                  <Text style={[styles.sortBtnText, sortBy === s.key && styles.sortBtnTextActive]}>
                    {s.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {displayedRoutes.length === 0 ? (
              <View style={styles.noResults}>
                <Text style={styles.noResultsText}>Nenhuma rota encontrada para este filtro.</Text>
              </View>
            ) : (
              displayedRoutes.map((r) => (
                <RouteCard
                  key={r.id}
                  route={r}
                  onPress={() => navigation.navigate('RouteDetail', { route: r })}
                />
              ))
            )}
          </View>
        )}

        {/* Empty state */}
        {!searched && !loading && history.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🗺️</Text>
            <Text style={styles.emptyTitle}>Planeje sua rota</Text>
            <Text style={styles.emptyText}>
              Informe sua localização e destino para visualizar as opções de transporte público disponíveis.
            </Text>
            <TouchableOpacity
              style={styles.popularHint}
              onPress={() => navigation.navigate('PopularRoutes')}
            >
              <Text style={styles.popularHintText}>⭐ Ver rotas populares</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    header: {
      backgroundColor: colors.headerBg,
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 20,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    greeting: { fontSize: 18, fontWeight: '700', color: '#FFF' },
    headerSubtitle: { fontSize: 12, color: colors.primaryLight, marginTop: 2 },
    headerRight: { alignItems: 'flex-end', gap: 8 },
    clockBox: { alignItems: 'flex-end' },
    clockTime: { fontSize: 15, fontWeight: '700', color: '#FFF', letterSpacing: 1 },
    clockDate: { fontSize: 11, color: colors.primaryLight, marginTop: 1, textTransform: 'capitalize' },
    profileBtn: {
      width: 36, height: 36, borderRadius: 18,
      backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center',
    },
    profileInitial: { fontSize: 16, fontWeight: '700', color: colors.headerBg },

    body: { padding: 20, paddingBottom: 40 },

    searchCard: {
      backgroundColor: colors.surface,
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 10,
      elevation: 4,
    },
    inputRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
    dotGreen: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.success, marginRight: 12 },
    dotRed:   { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.danger,  marginRight: 12 },
    searchInput: { flex: 1, paddingVertical: 12, fontSize: 15, color: colors.text },
    divider: { height: 1, backgroundColor: colors.divider, marginLeft: 24 },

    actionRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
    searchButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 15,
      alignItems: 'center',
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 5,
    },
    searchButtonDisabled: { opacity: 0.7 },
    searchButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
    popularBtn: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      paddingHorizontal: 16,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    },
    popularBtnText: { fontSize: 20 },

    // Histórico
    historySection: { marginTop: 24 },
    historyHeader: {
      flexDirection: 'row', justifyContent: 'space-between',
      alignItems: 'center', marginBottom: 10,
    },
    historyTitle: { fontSize: 14, fontWeight: '700', color: colors.textSecondary },
    historyClear: { fontSize: 12, color: colors.danger },
    historyItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 12,
      marginBottom: 6,
      gap: 10,
      elevation: 1,
    },
    historyIcon: { fontSize: 16 },
    historyText: { flex: 1, fontSize: 13, color: colors.text },

    // Resultados
    resultsSection: { marginTop: 24 },
    resultsTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
    resultsSubtitle: { fontSize: 13, color: colors.textMuted, marginTop: 2, marginBottom: 12 },

    // Filtros
    filterRow: { marginBottom: 10 },
    filterChip: {
      borderRadius: 20,
      paddingHorizontal: 14,
      paddingVertical: 7,
      marginRight: 8,
      backgroundColor: colors.surface,
      borderWidth: 1.5,
      borderColor: colors.border,
    },
    filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    filterChipText: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
    filterChipTextActive: { color: '#FFF' },

    // Ordenação
    sortRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 16,
    },
    sortLabel: { fontSize: 13, color: colors.textMuted },
    sortBtn: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    sortBtnActive: { backgroundColor: colors.primaryBg, borderColor: colors.primary },
    sortBtnText: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
    sortBtnTextActive: { color: colors.primary },

    noResults: { alignItems: 'center', paddingVertical: 24 },
    noResultsText: { fontSize: 14, color: colors.textMuted },

    // Empty
    emptyState: { alignItems: 'center', marginTop: 60 },
    emptyIcon:  { fontSize: 56, marginBottom: 16 },
    emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 8 },
    emptyText:  { fontSize: 14, color: colors.textMuted, textAlign: 'center', lineHeight: 20 },
    popularHint: {
      marginTop: 20,
      backgroundColor: colors.primaryBg,
      borderRadius: 12,
      paddingHorizontal: 20,
      paddingVertical: 12,
    },
    popularHintText: { color: colors.primary, fontWeight: '700', fontSize: 14 },
  });
}
