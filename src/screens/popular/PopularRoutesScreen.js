import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const POPULAR_ROUTES = [
  { id: '1', icon: '🏙️', origin: 'Estação Sé',      destination: 'Av. Paulista',    tag: 'Centro → Paulista' },
  { id: '2', icon: '🚇', origin: 'Santana',           destination: 'Centro',          tag: 'Norte → Centro' },
  { id: '3', icon: '🎨', origin: 'Vila Madalena',     destination: 'Pinheiros',       tag: 'Zona Oeste' },
  { id: '4', icon: '💼', origin: 'Brooklin',          destination: 'Berrini',         tag: 'Vila Olímpia' },
  { id: '5', icon: '🏘️', origin: 'Tatuapé',          destination: 'Consolação',      tag: 'Leste → Centro' },
  { id: '6', icon: '🏛️', origin: 'Luz',              destination: 'República',       tag: 'Centro Histórico' },
  { id: '7', icon: '🎓', origin: 'USP Butantã',       destination: 'Av. Paulista',    tag: 'Universidade' },
  { id: '8', icon: '✈️', origin: 'Aeroporto Congonhas', destination: 'Centro',       tag: 'Aeroporto' },
  { id: '9', icon: '🏥', origin: 'Hospital das Clínicas', destination: 'República', tag: 'Hospitais' },
];

export default function PopularRoutesScreen({ navigation }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  function handleSelect(item) {
    navigation.navigate('Home', {
      prefillOrigin: item.origin,
      prefillDestination: item.destination,
    });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rotas Populares</Text>
      </View>

      <Text style={styles.subtitle}>
        Toque em uma rota para buscar automaticamente
      </Text>

      <FlatList
        data={POPULAR_ROUTES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handleSelect(item)} activeOpacity={0.8}>
            <Text style={styles.cardIcon}>{item.icon}</Text>
            <View style={styles.cardInfo}>
              <Text style={styles.cardRoute}>{item.origin}</Text>
              <Text style={styles.cardArrow}>↓</Text>
              <Text style={styles.cardRoute}>{item.destination}</Text>
            </View>
            <View style={styles.tagBox}>
              <Text style={styles.tagText}>{item.tag}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
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

    subtitle: {
      fontSize: 13,
      color: colors.textMuted,
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 8,
    },

    list: { padding: 16, paddingBottom: 40 },

    card: {
      backgroundColor: colors.surface,
      borderRadius: 14,
      padding: 16,
      marginBottom: 10,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.07,
      shadowRadius: 6,
      elevation: 2,
    },
    cardIcon: { fontSize: 28 },
    cardInfo: { flex: 1 },
    cardRoute: { fontSize: 14, fontWeight: '600', color: colors.text },
    cardArrow: { fontSize: 11, color: colors.textLight, marginVertical: 2 },
    tagBox: {
      backgroundColor: colors.primaryBg,
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    tagText: { fontSize: 11, color: colors.primary, fontWeight: '600' },
  });
}
