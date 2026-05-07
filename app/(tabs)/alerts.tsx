import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { MOCK_ALERTS } from '@/constants/mock-data';
import EmptyState from '@/components/EmptyState';

const alertIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  delay: 'time-outline',
  cancellation: 'close-circle-outline',
  info: 'information-circle-outline',
  sos: 'warning-outline',
};
const alertColors: Record<string, string> = {
  delay: Colors.warning,
  cancellation: Colors.danger,
  info: Colors.primary,
  sos: Colors.sos,
};

export default function AlertsScreen() {
  if (MOCK_ALERTS.length === 0) {
    return <EmptyState icon="notifications-off-outline" title="No alerts" message="You're all caught up! No alerts right now." />;
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={{ padding: 16 }}
      data={MOCK_ALERTS}
      keyExtractor={a => a.id}
      renderItem={({ item }) => (
        <View style={[styles.card, { borderLeftColor: alertColors[item.type] }]}>
          <View style={styles.iconWrap}>
            <Ionicons name={alertIcons[item.type]} size={22} color={alertColors[item.type]} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.time}>{new Date(item.created_at).toLocaleTimeString()}</Text>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  card: { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: 12, padding: 14, marginBottom: 10, borderLeftWidth: 4, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3 },
  iconWrap: { marginRight: 12, paddingTop: 2 },
  cardContent: { flex: 1 },
  title: { fontSize: 15, fontWeight: '700', color: Colors.text },
  message: { fontSize: 13, color: Colors.textSecondary, marginTop: 4 },
  time: { fontSize: 11, color: Colors.textSecondary, marginTop: 6 },
});
