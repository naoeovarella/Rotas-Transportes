import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

// TODO (70% restante): Substituir este placeholder pela integração real com a Google Maps Directions API.
// Endpoint: https://maps.googleapis.com/maps/api/directions/json
// Parâmetros necessários: origin, destination, mode=transit, key=GOOGLE_MAPS_API_KEY
// A função fetchRoutes abaixo deve ser implementada em src/services/mapsService.js
function RouteCardPlaceholder({ index }) {
  const lines = [
    { type: 'Metrô', line: 'Linha 2 - Verde', duration: '32 min', distance: '12,4 km', stops: 'Consolação → Anhangabaú' },
    { type: 'Ônibus', line: '8012-10 Paulista', duration: '48 min', distance: '9,8 km', stops: 'Av. Paulista → Sé' },
    { type: 'Trem', line: 'CPTM L7', duration: '55 min', distance: '18 km', stops: 'Luz → Brás' },
  ];
  const data = lines[index % lines.length];

  return (
    <View style={styles.routeCard}>
      <View style={styles.routeCardHeader}>
        <View style={[styles.badge, data.type === 'Metrô' ? styles.badgeMetro : data.type === 'Trem' ? styles.badgeTrain : styles.badgeBus]}>
          <Text style={styles.badgeText}>{data.type === 'Metrô' ? 'M' : data.type === 'Trem' ? 'T' : 'Ô'}</Text>
        </View>
        <View style={styles.routeCardInfo}>
          <Text style={styles.routeLineName}>{data.line}</Text>
          <Text style={styles.routeStops}>{data.stops}</Text>
        </View>
        <View style={styles.routeDuration}>
          <Text style={styles.routeDurationText}>{data.duration}</Text>
          <Text style={styles.routeDistance}>{data.distance}</Text>
        </View>
      </View>
      <View style={styles.placeholderBanner}>
        <Text style={styles.placeholderBannerText}>Dados simulados — integração Maps pendente</Text>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [searched, setSearched] = useState(false);

  function handleSearch() {
    if (!origin.trim() || !destination.trim()) {
      Alert.alert('Atenção', 'Informe a origem e o destino.');
      return;
    }
    // TODO (70% restante): Chamar mapsService.fetchRoutes(origin, destination)
    // e exibir as rotas reais retornadas pela API.
    setSearched(true);
  }

  function handleLogout() {
    Alert.alert('Sair', 'Deseja encerrar a sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ]);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {user?.name?.split(' ')[0]} 👋</Text>
          <Text style={styles.headerSubtitle}>Para onde você quer ir?</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <View style={styles.searchCard}>
          <View style={styles.inputRow}>
            <View style={styles.dotGreen} />
            <TextInput
              style={styles.searchInput}
              placeholder="Localização atual"
              placeholderTextColor="#9E9E9E"
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
              placeholderTextColor="#9E9E9E"
              value={destination}
              onChangeText={setDestination}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.searchButton} onPress={handleSearch} activeOpacity={0.8}>
          <Text style={styles.searchButtonText}>Buscar Rotas</Text>
        </TouchableOpacity>

        {searched && (
          <View style={styles.resultsSection}>
            <Text style={styles.resultsTitle}>Rotas disponíveis</Text>
            <Text style={styles.resultsSubtitle}>
              {origin} → {destination}
            </Text>

            {/* TODO (70%): Mapear aqui as rotas reais retornadas pela API */}
            {[0, 1, 2].map((i) => (
              <RouteCardPlaceholder key={i} index={i} />
            ))}
          </View>
        )}

        {!searched && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🗺️</Text>
            <Text style={styles.emptyTitle}>Planeje sua rota</Text>
            <Text style={styles.emptyText}>
              Informe sua localização e destino para visualizar as opções de transporte público disponíveis.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F7FB' },
  header: {
    backgroundColor: '#1565C0',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: { fontSize: 20, fontWeight: '700', color: '#FFF' },
  headerSubtitle: { fontSize: 13, color: '#90CAF9', marginTop: 2 },
  logoutBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#90CAF9',
  },
  logoutText: { color: '#90CAF9', fontSize: 13, fontWeight: '600' },
  body: { padding: 24, paddingBottom: 40 },
  searchCard: {
    backgroundColor: '#FFF',
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
  dotGreen: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#43A047', marginRight: 12 },
  dotRed: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#E53935', marginRight: 12 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 15, color: '#212121' },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginLeft: 24 },
  searchButton: {
    backgroundColor: '#1565C0',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#1565C0',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  searchButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  resultsSection: { marginTop: 28 },
  resultsTitle: { fontSize: 18, fontWeight: '700', color: '#212121' },
  resultsSubtitle: { fontSize: 13, color: '#757575', marginTop: 2, marginBottom: 16 },
  routeCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  routeCardHeader: { flexDirection: 'row', alignItems: 'center' },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  badgeMetro: { backgroundColor: '#1565C0' },
  badgeBus: { backgroundColor: '#2E7D32' },
  badgeTrain: { backgroundColor: '#6A1B9A' },
  badgeText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  routeCardInfo: { flex: 1 },
  routeLineName: { fontSize: 14, fontWeight: '700', color: '#212121' },
  routeStops: { fontSize: 12, color: '#757575', marginTop: 2 },
  routeDuration: { alignItems: 'flex-end' },
  routeDurationText: { fontSize: 15, fontWeight: '700', color: '#1565C0' },
  routeDistance: { fontSize: 12, color: '#9E9E9E', marginTop: 2 },
  placeholderBanner: {
    backgroundColor: '#FFF9C4',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 12,
  },
  placeholderBannerText: { fontSize: 11, color: '#F57F17', textAlign: 'center' },
  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyIcon: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#424242', marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#9E9E9E', textAlign: 'center', lineHeight: 20 },
});
