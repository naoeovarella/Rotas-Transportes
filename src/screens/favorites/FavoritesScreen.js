import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getFavorites } from '../../services/storageService';
import { useTheme } from '../../context/ThemeContext';
import RouteCard from '../../components/RouteCard';

export default function FavoritesScreen({ navigation }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [favorites, setFavorites] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getFavorites().then(setFavorites);
    }, [])
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rotas Favoritas</Text>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>☆</Text>
          <Text style={styles.emptyTitle}>Nenhum favorito ainda</Text>
          <Text style={styles.emptyText}>
            Toque na estrela em qualquer rota para salvá-la aqui.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item, i) => `${item.id}-${i}`}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <RouteCard
              route={item}
              onPress={() => navigation.navigate('RouteDetail', { route: item })}
            />
          )}
        />
      )}
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
    list: { padding: 16, paddingBottom: 40 },
    empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
    emptyIcon: { fontSize: 56, color: colors.warning, marginBottom: 16 },
    emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 8 },
    emptyText: { fontSize: 14, color: colors.textMuted, textAlign: 'center', lineHeight: 20 },
  });
}
