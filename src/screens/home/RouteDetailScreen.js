import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

function StepItem({ step, isLast, colors }) {
  const isTransit = step.type === 'transit';
  const typeColors = {
    SUBWAY: colors.badge.SUBWAY,
    BUS:    colors.badge.BUS,
    TRAIN:  colors.badge.TRAIN,
  };
  const dotColor = isTransit ? (typeColors[step.vehicle] ?? colors.primary) : colors.textMuted;

  return (
    <View style={stepStyles(colors).row}>
      <View style={stepStyles(colors).timeline}>
        <View style={[stepStyles(colors).dot, { backgroundColor: dotColor }]} />
        {!isLast && <View style={[stepStyles(colors).line, { backgroundColor: dotColor + '44' }]} />}
      </View>

      <View style={stepStyles(colors).content}>
        {isTransit ? (
          <View style={[stepStyles(colors).transitCard, { borderLeftColor: dotColor }]}>
            <View style={stepStyles(colors).transitHeader}>
              <View style={[stepStyles(colors).transitBadge, { backgroundColor: dotColor }]}>
                <Text style={stepStyles(colors).transitBadgeText}>{step.badge}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={stepStyles(colors).transitLineName}>{step.instruction}</Text>
                {step.numStops && (
                  <Text style={stepStyles(colors).transitStops}>{step.numStops} paradas</Text>
                )}
              </View>
              <Text style={[stepStyles(colors).transitDuration, { color: dotColor }]}>{step.duration}</Text>
            </View>
            <View style={stepStyles(colors).transitTimes}>
              <View style={{ flex: 1 }}>
                <Text style={stepStyles(colors).transitTimeLabel}>Embarque</Text>
                <Text style={stepStyles(colors).transitTimeValue}>{step.departureStop}</Text>
                <Text style={[stepStyles(colors).transitTime, { color: dotColor }]}>{step.departureTime}</Text>
              </View>
              <Text style={stepStyles(colors).transitArrow}>→</Text>
              <View style={{ flex: 1 }}>
                <Text style={stepStyles(colors).transitTimeLabel}>Desembarque</Text>
                <Text style={stepStyles(colors).transitTimeValue}>{step.arrivalStop}</Text>
                <Text style={[stepStyles(colors).transitTime, { color: dotColor }]}>{step.arrivalTime}</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={stepStyles(colors).walkCard}>
            <Text style={stepStyles(colors).walkIcon}>🚶</Text>
            <View style={{ flex: 1 }}>
              <Text style={stepStyles(colors).walkInstruction}>{step.instruction}</Text>
              <Text style={stepStyles(colors).walkMeta}>{step.duration} · {step.distance}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

export default function RouteDetailScreen({ route, navigation }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const routeData = route.params.route;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes da Rota</Text>
      </View>

      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <View style={[styles.summaryDot, { backgroundColor: colors.success }]} />
          <Text style={styles.summaryText} numberOfLines={1}>{routeData.origin}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <View style={[styles.summaryDot, { backgroundColor: colors.danger }]} />
          <Text style={styles.summaryText} numberOfLines={1}>{routeData.destination}</Text>
        </View>

        <View style={styles.summaryStats}>
          {[
            { value: routeData.duration,      label: 'Duração' },
            { value: routeData.distance,      label: 'Distância' },
            { value: routeData.departureTime, label: 'Saída' },
            { value: routeData.arrivalTime,   label: 'Chegada' },
          ].map((s, i, arr) => (
            <React.Fragment key={s.label}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
              {i < arr.length - 1 && <View style={styles.statDivider} />}
            </React.Fragment>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.steps} showsVerticalScrollIndicator={false}>
        <Text style={styles.stepsTitle}>Passo a passo</Text>
        {routeData.steps.map((step, i) => (
          <StepItem
            key={i}
            step={step}
            isLast={i === routeData.steps.length - 1}
            colors={colors}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const stepStyles = (colors) => StyleSheet.create({
  row:      { flexDirection: 'row', marginBottom: 0 },
  timeline: { width: 24, alignItems: 'center' },
  dot:      { width: 14, height: 14, borderRadius: 7, marginTop: 4 },
  line:     { width: 2, flex: 1, minHeight: 16, marginTop: 4 },
  content:  { flex: 1, paddingLeft: 12, paddingBottom: 16 },
  transitCard: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 14,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  transitHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  transitBadge: { width: 30, height: 30, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  transitBadgeText: { color: '#FFF', fontWeight: '700', fontSize: 13 },
  transitLineName: { fontSize: 13, fontWeight: '700', color: colors.text },
  transitStops: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  transitDuration: { fontSize: 14, fontWeight: '700' },
  transitTimes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 8,
    padding: 10,
  },
  transitTimeLabel: { fontSize: 10, color: colors.textLight, textTransform: 'uppercase', letterSpacing: 0.5 },
  transitTimeValue: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginTop: 2 },
  transitTime: { fontSize: 13, fontWeight: '700', marginTop: 2 },
  transitArrow: { fontSize: 16, color: colors.textLight },
  walkCard: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 4 },
  walkIcon: { fontSize: 20 },
  walkInstruction: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
  walkMeta: { fontSize: 12, color: colors.textLight, marginTop: 2 },
});

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
    summary: {
      backgroundColor: colors.surface,
      margin: 16,
      borderRadius: 14,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.07,
      shadowRadius: 8,
      elevation: 3,
    },
    summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    summaryDot: { width: 12, height: 12, borderRadius: 6 },
    summaryText: { flex: 1, fontSize: 14, color: colors.text, fontWeight: '500' },
    summaryDivider: { width: 1, height: 16, backgroundColor: colors.border, marginLeft: 5, marginVertical: 4 },
    summaryStats: {
      flexDirection: 'row',
      marginTop: 16,
      paddingTop: 14,
      borderTopWidth: 1,
      borderTopColor: colors.divider,
    },
    statItem: { flex: 1, alignItems: 'center' },
    statValue: { fontSize: 14, fontWeight: '700', color: colors.primary },
    statLabel: { fontSize: 11, color: colors.textLight, marginTop: 2 },
    statDivider: { width: 1, backgroundColor: colors.border },
    steps: { paddingHorizontal: 16, paddingBottom: 40 },
    stepsTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 16 },
  });
}
