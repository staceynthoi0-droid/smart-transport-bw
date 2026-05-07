import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

const DRIVER_TRIPS = [
  { id: 'dt1', route: 'Main Mall to BBS Mall', date: '2026-05-07', passengers: 12, fareTotal: 66, status: 'Completed' },
  { id: 'dt2', route: 'Station Bus Rank to UB', date: '2026-05-06', passengers: 18, fareTotal: 126, status: 'Completed' },
  { id: 'dt3', route: 'Tlokweng Border to Game City', date: '2026-05-05', passengers: 9, fareTotal: 81, status: 'Completed' },
];

export default function DriverTripHistoryScreen() {
  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={DRIVER_TRIPS}
      keyExtractor={trip => trip.id}
      ListHeaderComponent={<Text style={styles.intro}>Daily driver trip records, passenger counts, and cash fare totals.</Text>}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <Ionicons name="bus-outline" size={22} color={Colors.primary} />
          </View>
          <View style={styles.info}>
            <Text style={styles.title}>{item.route}</Text>
            <Text style={styles.meta}>{item.date} - {item.status}</Text>
            <Text style={styles.detail}>{item.passengers} passengers - BWP {item.fareTotal.toFixed(2)} collected</Text>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 32 },
  intro: { color: Colors.textSecondary, fontSize: 14, lineHeight: 20, marginBottom: 14 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 8, borderWidth: 1, borderColor: Colors.border, padding: 14, marginBottom: 10 },
  iconWrap: { width: 42, height: 42, borderRadius: 21, backgroundColor: Colors.primary + '12', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  info: { flex: 1 },
  title: { color: Colors.text, fontWeight: '800', fontSize: 15 },
  meta: { color: Colors.textSecondary, fontSize: 12, marginTop: 3 },
  detail: { color: Colors.primary, fontWeight: '800', fontSize: 13, marginTop: 6 },
});
