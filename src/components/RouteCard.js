import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { isRouteFavorite, toggleFavorite } from '../services/storageService';
import { useTheme } from '../context/ThemeContext';

export default function RouteCard({ route, onPress }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const [favorite, setFavorite] = useState(false);

  const transitStep = route.steps.find((s) => s.type === 'transit');
  const badgeColor  = colors.badge[transitStep?.vehicle] ?? colors.primary;

  useEffect(() => {
    isRouteFavorite(route).then(setFavorite);
  }, []);

  async function handleFavorite() {
    const { isFavorite } = await toggleFavorite(route);
    setFavorite(isFavorite);
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.header}>
        <View style={[styles.badge, { backgroundColor: badgeColor }]}>
          <Text style={styles.badgeText}>{route.badge}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.lineName}>{route.transitLine}</Text>
          <Text style={styles.stops}>{route.origin} → {route.destination}</Text>
        </View>
        <View style={styles.right}>
          <TouchableOpacity onPress={handleFavorite} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.favIcon}>{favorite ? '★' : '☆'}</Text>
          </TouchableOpacity>
          <Text style={styles.duration}>{route.duration}</Text>
          <Text style={styles.distance}>{route.distance}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Saída {route.departureTime} · Chegada {route.arrivalTime}
        </Text>
        <Text style={styles.detailLink}>Ver detalhes →</Text>
      </View>
    </TouchableOpacity>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.07,
      shadowRadius: 6,
      elevation: 2,
    },
    header: { flexDirection: 'row', alignItems: 'center' },
    badge: {
      width: 38,
      height: 38,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    badgeText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
    info: { flex: 1 },
    lineName: { fontSize: 14, fontWeight: '700', color: colors.text },
    stops: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
    right: { alignItems: 'flex-end', gap: 2 },
    favIcon: { fontSize: 20, color: colors.warning, marginBottom: 2 },
    duration: { fontSize: 15, fontWeight: '700', color: colors.primary },
    distance: { fontSize: 12, color: colors.textLight, marginTop: 1 },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 12,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: colors.divider,
    },
    footerText: { fontSize: 12, color: colors.textMuted },
    detailLink: { fontSize: 12, color: colors.primary, fontWeight: '600' },
  });
}
